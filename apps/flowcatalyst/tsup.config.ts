import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs"],
	dts: false,
	clean: true,
	sourcemap: true,
	target: "node24",
	// Bundle every npm dep into the SEA blob EXCEPT packages whose runtime
	// loading relies on sidecar files relative to themselves on disk (and so
	// can't survive bundling):
	//   - argon2: uses node-gyp-build to pick a prebuilt .node binary from
	//     its own `prebuilds/` directory
	//   - @embedded-postgres/<platform>: ships the real PostgreSQL binary
	//     and its dylibs under native/ — bundling would lose the directory
	//     structure. We pack it as a SEA asset and extract on first run.
	// See scripts/pack-{argon2,postgres}.js plus the corresponding loaders.
	noExternal: [/^(?!(argon2$|@embedded-postgres\/.*$)).*$/],
	external: [
		"node:sea",
		"argon2",
		"@embedded-postgres/darwin-arm64",
		"@embedded-postgres/darwin-x64",
		"@embedded-postgres/linux-arm64",
		"@embedded-postgres/linux-x64",
		"@embedded-postgres/windows-x64",
	],
	esbuildOptions(options) {
		// `import.meta` references in source are intentional ESM/CJS-bivalent guards
		// (see __dirname derivation in src/index.ts). esbuild rightly notes they're
		// empty in CJS output; our code handles that case.
		options.logOverride = {
			...options.logOverride,
			"empty-import-meta": "silent",
		};
		options.alias = {
			"@flowcatalyst/tsid": "../../packages/tsid/src/index.ts",
			"@flowcatalyst/logging": "../../packages/logging/src/index.ts",
			"@flowcatalyst/config": "../../packages/config/src/index.ts",
			"@flowcatalyst/contracts": "../../packages/contracts/src/index.ts",
			"@flowcatalyst/platform-crypto": "../../packages/crypto/src/index.ts",
			"@flowcatalyst/domain": "../../packages/domain/src/index.ts",
			"@flowcatalyst/application": "../../packages/framework/src/index.ts",
			"@flowcatalyst/http": "../../packages/http/src/index.ts",
			"@flowcatalyst/persistence": "../../packages/persistence/src/index.ts",
			"@flowcatalyst/queue-core": "../../packages/queue-core/src/index.ts",
			"@flowcatalyst/platform": "../../packages/platform/src/index.ts",
			"@flowcatalyst/message-router": "../../packages/message-router/src/index.ts",
			"@flowcatalyst/stream-processor": "../../packages/stream-processor/src/index.ts",
			"@flowcatalyst/outbox-processor": "../../packages/outbox-processor/src/index.ts",
		};
	},
});
