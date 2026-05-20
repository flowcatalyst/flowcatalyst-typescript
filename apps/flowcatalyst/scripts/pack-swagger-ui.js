/**
 * Pack @fastify/swagger-ui's static assets (logo, Swagger UI HTML/JS/CSS) into
 * a SEA asset. fastify-swagger-ui reads its assets via
 * `path.join(__dirname, "./static/...")` — bundling re-anchors __dirname to
 * our SEA bundle dir where those files don't exist. The runtime loader in
 * plugins.ts extracts this asset to /tmp and passes `baseDir`/`logo` to the
 * plugin so /docs works in the binary.
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
const outputPath = resolve(distDir, "swagger-ui.bin");

// Resolve @fastify/swagger-ui's installed location. Its `exports` field
// doesn't expose ./package.json, so we resolve the main entry and walk up.
const require = createRequire(import.meta.url);
const swaggerUiEntry = require.resolve("@fastify/swagger-ui");
// entry is .../node_modules/@fastify/swagger-ui/index.js (or lib/index.js)
let swaggerUiRoot = dirname(swaggerUiEntry);
while (!existsSync(join(swaggerUiRoot, "static"))) {
	const parent = dirname(swaggerUiRoot);
	if (parent === swaggerUiRoot) {
		console.error("Could not locate @fastify/swagger-ui static dir");
		process.exit(1);
	}
	swaggerUiRoot = parent;
}
const staticDir = join(swaggerUiRoot, "static");

function listFiles(dir, prefix = "") {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const rel = prefix ? `${prefix}/${entry}` : entry;
		const stat = statSync(full);
		if (stat.isDirectory()) {
			out.push(...listFiles(full, rel));
		} else {
			out.push({ rel, full, size: stat.size });
		}
	}
	return out;
}

const files = listFiles(staticDir);

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
	`Packed ${entries.length} swagger-ui file(s) (${mb} MB) into ${relative(process.cwd(), outputPath)}`,
);
