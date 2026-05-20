/**
 * Pack the `argon2` npm package's runtime files into a SEA asset. argon2 uses
 * `node-gyp-build` at runtime to pick the right prebuilt `.node` binary from
 * its `prebuilds/` directory, which can't survive bundling. We externalize it
 * from the SEA bundle, ship its full dist inside the SEA blob, and extract +
 * createRequire it at runtime — see packages/crypto/src/password.ts.
 *
 * Uses the same binary format as scripts/pack-pglite.js:
 *   [4-byte BE u32: header length][header JSON][raw entry bytes...]
 */

import {
	readFileSync,
	writeFileSync,
	readdirSync,
	statSync,
	existsSync,
	mkdirSync,
} from "node:fs";
import { resolve, dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");
const outputPath = resolve(distDir, "argon2.bin");

const require = createRequire(import.meta.url);
const argon2Entry = require.resolve("argon2");
const argon2Root = dirname(argon2Entry);

if (!existsSync(argon2Root)) {
	console.error(`argon2 package not found: ${argon2Root}`);
	process.exit(1);
}

// argon2.cjs requires `@phc/format` and `node-gyp-build` at runtime
// (node-addon-api is build-time only). Pack them inside a sibling
// node_modules/ so Node's CJS resolver finds them next to argon2.cjs after
// extraction.
const ARGON2_RUNTIME_DEPS = ["@phc/format", "node-gyp-build"];

function walk(dir, prefix = "") {
	const out = [];
	for (const entry of readdirSync(dir)) {
		// Skip nested node_modules — argon2 only needs its own files. Also
		// skip docs/build artifacts that aren't loaded at runtime.
		if (
			entry === "node_modules" ||
			entry === "binding.gyp" ||
			entry === "argon2.cpp" ||
			entry === "argon2" || // the C source dir
			entry === "LICENSE" ||
			entry === "README.md" ||
			entry.endsWith(".d.cts.map")
		) {
			continue;
		}
		const full = join(dir, entry);
		const rel = prefix ? `${prefix}/${entry}` : entry;
		const stat = statSync(full);
		if (stat.isDirectory()) {
			out.push(...walk(full, rel));
		} else {
			out.push({ rel, full, size: stat.size });
		}
	}
	return out;
}

const files = walk(argon2Root);

// Add argon2's runtime deps under node_modules/<dep>/ so argon2.cjs's
// `require("@phc/format")` etc. resolve next to it after extraction.
// Resolve from argon2's own location — under pnpm's strict mode the deps
// aren't visible from the app package even though they're installed.
const argon2Require = createRequire(argon2Entry);
for (const dep of ARGON2_RUNTIME_DEPS) {
	const depEntry = argon2Require.resolve(dep);
	let depRoot = dirname(depEntry);
	while (!existsSync(join(depRoot, "package.json"))) {
		const parent = dirname(depRoot);
		if (parent === depRoot) break;
		depRoot = parent;
	}
	for (const f of walk(depRoot)) {
		files.push({
			rel: `node_modules/${dep}/${f.rel}`,
			full: f.full,
			size: f.size,
		});
	}
}

const entries = files.map((f) => ({ name: f.rel, size: f.size }));
const headerJson = JSON.stringify({ entries });
const headerLen = Buffer.alloc(4);
headerLen.writeUInt32BE(Buffer.byteLength(headerJson, "utf8"), 0);

const chunks = [headerLen, Buffer.from(headerJson, "utf8")];
for (const f of files) {
	chunks.push(readFileSync(f.full));
}

mkdirSync(distDir, { recursive: true });
const blob = Buffer.concat(chunks);
writeFileSync(outputPath, blob);

const mb = (blob.length / 1024 / 1024).toFixed(2);
console.log(
	`Packed ${entries.length} argon2 file(s) (${mb} MB) into ${relative(process.cwd(), outputPath)}`,
);
