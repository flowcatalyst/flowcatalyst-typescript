/**
 * Argon2id Password Hashing Service
 *
 * Compatible with the Java PasswordService implementation.
 *
 * Parameters (OWASP recommended for Argon2id):
 * - Memory cost: 65536 KiB (64 MiB)
 * - Time cost: 3 iterations
 * - Parallelism: 4 threads
 * - Salt length: 16 bytes
 * - Hash length: 32 bytes
 *
 * Output format: PHC string format
 * $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
 */

import type Argon2 from "argon2";
import { type Result, ok, err, ResultAsync } from "neverthrow";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

// Lazy argon2 loader.
//
// In a Node SEA binary, argon2 is packed as an asset (see scripts/pack-argon2.js)
// and extracted to /tmp on first use, then loaded via createRequire. In normal
// CJS/ESM contexts, the require() falls through to node_modules resolution.
//
// Loaded once, then cached for the lifetime of the process.
let argon2Cache: typeof Argon2 | null = null;
function argon2(): typeof Argon2 {
	if (argon2Cache) return argon2Cache;

	// In a SEA bundle the injected `require` is `embedderRequire`, which only
	// resolves Node built-in modules — it can't load a file by absolute path
	// or do node_modules resolution. We use it to access `node:sea` (a
	// built-in) but always switch to `createRequire` for loading argon2 from
	// disk (either the extracted SEA asset, or normal node_modules).
	const cjsRequire: NodeJS.Require | null =
		typeof require !== "undefined" ? require : null;

	// SEA mode: extract argon2 dist to /tmp and load it from there.
	const sea = (() => {
		try {
			return cjsRequire
				? (cjsRequire("node:sea") as typeof import("node:sea"))
				: null;
		} catch {
			return null;
		}
	})();
	if (sea?.isSea()) {
		const extractDir = join(tmpdir(), "flowcatalyst-argon2");
		const sentinel = join(extractDir, ".extracted");
		if (!existsSync(sentinel)) {
			const blob = Buffer.from(sea.getAsset("argon2") as ArrayBuffer);
			extractArgon2Blob(blob, extractDir);
			writeFileSync(sentinel, "");
		}
		// createRequire anchored INSIDE the extracted dir so argon2's internal
		// require calls (node-gyp-build looks at __filename to find prebuilds/)
		// resolve correctly.
		const fileReq = createRequire(join(extractDir, "package.json"));
		argon2Cache = fileReq(join(extractDir, "argon2.cjs")) as typeof Argon2;
		return argon2Cache;
	}

	// Non-SEA: prefer the CJS-injected require if present (covers CJS bundle
	// run outside SEA); otherwise use createRequire for ESM dev mode.
	const metaUrl: string | undefined = (import.meta as { url?: string }).url;
	const req: NodeJS.Require =
		cjsRequire ?? createRequire(metaUrl ?? __filename);
	argon2Cache = req("argon2") as typeof Argon2;
	return argon2Cache;
}

function extractArgon2Blob(blob: Buffer, destDir: string): void {
	const headerLen = blob.readUInt32BE(0);
	const header = JSON.parse(
		blob.subarray(4, 4 + headerLen).toString("utf8"),
	) as { entries: { name: string; size: number }[] };
	let offset = 4 + headerLen;
	mkdirSync(destDir, { recursive: true });
	for (const entry of header.entries) {
		const bytes = blob.subarray(offset, offset + entry.size);
		offset += entry.size;
		const outPath = join(destDir, entry.name);
		mkdirSync(dirname(outPath), { recursive: true });
		writeFileSync(outPath, bytes);
	}
}

// Build the Argon2 options against a loaded module instance. `argon2id` is a
// runtime constant exposed by the loaded module.
function options(a: typeof Argon2): Argon2.Options {
	return {
		type: a.argon2id,
		memoryCost: 65536, // 64 MiB
		timeCost: 3,
		parallelism: 4,
		hashLength: 32,
	};
}

// Password complexity requirements
const MIN_LENGTH = 8;
const RELAXED_MIN_LENGTH = 2;
const MAX_LENGTH = 128;
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";

export interface PasswordComplexityOptions {
	/**
	 * When false, the platform skips uppercase/lowercase/digit/special
	 * requirements and only enforces a 2-character minimum. Intended for SDK
	 * callers that apply their own password policy. Defaults to true.
	 */
	enforceComplexity?: boolean;
}

export type PasswordError =
	| { type: "validation"; field: string; message: string }
	| { type: "hashing_failed"; message: string; cause?: Error | undefined }
	| { type: "verification_failed"; message: string; cause?: Error | undefined };

/**
 * Argon2id Password Hashing Service
 */
export class PasswordService {
	/**
	 * Hash a password using Argon2id.
	 *
	 * @param password - The plaintext password
	 * @returns Result with PHC format hash string, or error
	 */
	hash(password: string): ResultAsync<string, PasswordError> {
		const a = argon2();
		return ResultAsync.fromPromise(a.hash(password, options(a)), (e) => ({
			type: "hashing_failed" as const,
			message: `Password hashing failed: ${e instanceof Error ? e.message : String(e)}`,
			cause: e instanceof Error ? e : undefined,
		}));
	}

	/**
	 * Verify a password against a hash.
	 *
	 * @param password - The plaintext password to verify
	 * @param hash - The stored hash to verify against
	 * @returns true if password matches, false otherwise
	 */
	async verify(password: string, hash: string): Promise<boolean> {
		try {
			return await argon2().verify(hash, password);
		} catch {
			return false;
		}
	}

	/**
	 * Check if a hash needs to be rehashed (e.g., after parameter upgrade).
	 *
	 * @param hash - The stored hash to check
	 * @returns true if rehashing is needed
	 */
	async needsRehash(hash: string): Promise<boolean> {
		try {
			const a = argon2();
			return a.needsRehash(hash, options(a));
		} catch {
			return true;
		}
	}

	/**
	 * Validate password complexity requirements.
	 *
	 * When `enforceComplexity` is true (default):
	 * - Length: 8-128 characters
	 * - At least 1 uppercase letter
	 * - At least 1 lowercase letter
	 * - At least 1 digit
	 * - At least 1 special character
	 *
	 * When `enforceComplexity` is false, only a 2-character minimum is enforced.
	 * Intended for SDK callers that apply their own password policy.
	 *
	 * @param password - The password to validate
	 * @param options - Optional flags; set `enforceComplexity: false` to skip rules
	 * @returns Result with void on success, or validation error
	 */
	validateComplexity(
		password: string,
		options?: PasswordComplexityOptions,
	): Result<void, PasswordError> {
		const enforce = options?.enforceComplexity ?? true;
		const minLength = enforce ? MIN_LENGTH : RELAXED_MIN_LENGTH;

		if (password.length < minLength) {
			return err({
				type: "validation",
				field: "password",
				message: `Password must be at least ${minLength} characters`,
			});
		}

		if (password.length > MAX_LENGTH) {
			return err({
				type: "validation",
				field: "password",
				message: `Password must be at most ${MAX_LENGTH} characters`,
			});
		}

		if (!enforce) {
			return ok(undefined);
		}

		if (!/[A-Z]/.test(password)) {
			return err({
				type: "validation",
				field: "password",
				message: "Password must contain at least one uppercase letter",
			});
		}

		if (!/[a-z]/.test(password)) {
			return err({
				type: "validation",
				field: "password",
				message: "Password must contain at least one lowercase letter",
			});
		}

		if (!/[0-9]/.test(password)) {
			return err({
				type: "validation",
				field: "password",
				message: "Password must contain at least one digit",
			});
		}

		const hasSpecial = [...password].some((c) => SPECIAL_CHARS.includes(c));
		if (!hasSpecial) {
			return err({
				type: "validation",
				field: "password",
				message: "Password must contain at least one special character",
			});
		}

		return ok(undefined);
	}

	/**
	 * Validate complexity and hash the password if valid.
	 *
	 * @param password - The plaintext password
	 * @param options - Optional flags; set `enforceComplexity: false` to skip complexity rules
	 * @returns Result with hash on success, or error
	 */
	validateAndHash(
		password: string,
		options?: PasswordComplexityOptions,
	): ResultAsync<string, PasswordError> {
		const validationResult = this.validateComplexity(password, options);
		if (validationResult.isErr()) {
			return ResultAsync.fromPromise(
				Promise.reject(validationResult.error),
				() => validationResult.error,
			);
		}
		return this.hash(password);
	}
}

/**
 * Singleton instance for convenience
 */
let defaultInstance: PasswordService | null = null;

/**
 * Get the default PasswordService instance
 */
export function getPasswordService(): PasswordService {
	if (!defaultInstance) {
		defaultInstance = new PasswordService();
	}
	return defaultInstance;
}
