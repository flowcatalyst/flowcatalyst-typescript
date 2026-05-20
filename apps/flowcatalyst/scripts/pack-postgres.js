/**
 * Pack the `@embedded-postgres/<platform>` `native/` directory into a SEA
 * asset (postgres binary, libs, share/, plus the pg-symlinks.json manifest).
 * At runtime the SEA app extracts it to /tmp and rehydrates symlinks so
 * postgres's @loader_path dylib resolution works.
 *
 * Binary format:
 *   [u32 BE header length]
 *   [header JSON: { entries: { name, size, mode, link? }[] }]
 *   [raw bytes for non-symlink entries, in entry order]
 *
 * `link` (relative target) marks an entry as a symlink; no bytes are appended
 * for it. The extractor recreates symlinks after writing regular files.
 *
 * Notes:
 *  - Only the current build host's platform is packed; cross-platform builds
 *    aren't supported (the SEA binary itself is platform-specific anyway).
 *  - File modes are preserved so executables (postgres, initdb, pg_ctl)
 *    survive the round trip.
 */

import {
	readFileSync,
	writeFileSync,
	readdirSync,
	lstatSync,
	readlinkSync,
	existsSync,
	mkdirSync,
	rmSync,
	symlinkSync,
} from "node:fs";
import { resolve, dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");
const outputPath = resolve(distDir, "postgres.bin");

const require = createRequire(import.meta.url);

function platformPackageName() {
	const map = {
		"darwin-arm64": "@embedded-postgres/darwin-arm64",
		"darwin-x64": "@embedded-postgres/darwin-x64",
		"linux-arm64": "@embedded-postgres/linux-arm64",
		"linux-x64": "@embedded-postgres/linux-x64",
		"win32-x64": "@embedded-postgres/windows-x64",
	};
	const key = `${process.platform}-${process.arch}`;
	const name = map[key];
	if (!name) {
		throw new Error(`Unsupported build platform: ${key}`);
	}
	return name;
}

const pkgName = platformPackageName();
// Resolve through embedded-postgres because the platform binary is a peer
// dep of it — pnpm's strict mode hides it from the consumer (this script's)
// require path.
const embeddedPostgresEntry = require.resolve("embedded-postgres");
const epRequire = createRequire(embeddedPostgresEntry);
const pkgEntry = epRequire.resolve(pkgName);
// dist/index.js -> walk up to package root (next to ./native/)
let pkgRoot = dirname(pkgEntry);
while (!existsSync(join(pkgRoot, "native"))) {
	const parent = dirname(pkgRoot);
	if (parent === pkgRoot) {
		throw new Error(`Could not locate native/ dir for ${pkgName}`);
	}
	pkgRoot = parent;
}
const nativeDir = join(pkgRoot, "native");

// pnpm's strict mode skips the `@embedded-postgres/<plat>` postinstall script
// which hydrates symlinks from pg-symlinks.json. Run it ourselves if needed —
// after this point `lstatSync` faithfully reports which files are symlinks vs
// regular files.
const symlinkManifestPath = join(nativeDir, "pg-symlinks.json");
if (existsSync(symlinkManifestPath)) {
	const manifest = JSON.parse(readFileSync(symlinkManifestPath, "utf8"));
	for (const { source, target } of manifest) {
		// `source` = real file; `target` = symlink path to create at.
		const realAbs = resolve(pkgRoot, source);
		const symlinkAbs = resolve(pkgRoot, target);
		if (existsSync(symlinkAbs)) {
			// If it's a regular file (pnpm copied it), replace with a symlink.
			const lst = lstatSync(symlinkAbs);
			if (lst.isSymbolicLink()) continue;
			rmSync(symlinkAbs);
		}
		const rel = relative(dirname(symlinkAbs), realAbs);
		try {
			symlinkSync(rel, symlinkAbs);
		} catch (e) {
			console.warn(`failed to create symlink ${symlinkAbs}: ${e.message}`);
		}
	}
}

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const lst = lstatSync(full);
		const rel = relative(nativeDir, full);
		if (lst.isSymbolicLink()) {
			out.push({ rel, full, link: readlinkSync(full), mode: lst.mode });
			continue;
		}
		if (lst.isDirectory()) {
			out.push(...walk(full));
			continue;
		}
		out.push({ rel, full, size: lst.size, mode: lst.mode });
	}
	return out;
}

const files = walk(nativeDir);

const entries = files.map((f) => {
	const e = { name: f.rel, mode: f.mode };
	if (f.link !== undefined) {
		e.link = f.link;
		e.size = 0;
	} else {
		e.size = f.size;
	}
	return e;
});

const headerJson = JSON.stringify({ entries });
const headerLen = Buffer.alloc(4);
headerLen.writeUInt32BE(Buffer.byteLength(headerJson, "utf8"), 0);

const chunks = [headerLen, Buffer.from(headerJson, "utf8")];
for (const f of files) {
	if (f.link !== undefined) continue;
	chunks.push(readFileSync(f.full));
}

mkdirSync(distDir, { recursive: true });
const blob = Buffer.concat(chunks);
writeFileSync(outputPath, blob);

const mb = (blob.length / 1024 / 1024).toFixed(1);
const symlinkCount = entries.filter((e) => e.link !== undefined).length;
console.log(
	`Packed ${entries.length} postgres file(s) (${symlinkCount} symlinks, ${mb} MB) into ${relative(process.cwd(), outputPath)}`,
);
