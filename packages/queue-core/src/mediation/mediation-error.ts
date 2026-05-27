import { errors as undiciErrors } from "undici";

/**
 * Typed failure modes for outbound HTTP mediation. Callers branch on
 * `instanceof MediationError` (or one of its subclasses) instead of
 * grepping `error.message` or knowing which Node / undici classes
 * undici happens to throw.
 *
 * The mapping from raw runtime errors to these classes lives in
 * {@link toMediationError}; produce instances via that function rather
 * than `new ConnectionTimeoutError(...)` directly so the wire-detail
 * extraction stays in one place.
 *
 * Inheritance:
 *
 *   MediationError                (abstract — never thrown directly)
 *   ├── ConnectionTimeoutError    // never finished TCP/TLS handshake
 *   ├── RequestTimeoutError       // headers / body never arrived
 *   └── ConnectionFailureError    // socket / DNS / refused / reset
 *
 * Anything we can't classify becomes `MediationUnknownError`, which is
 * the only direct (non-abstract) `MediationError` and exists so the
 * caller never has to special-case raw `Error` instances.
 */
export abstract class MediationError extends Error {
	abstract override readonly name: string;
	/**
	 * The raw underlying error, kept for diagnostic logging. Don't
	 * branch on this — that's what the subclasses are for.
	 */
	override readonly cause: unknown;
	constructor(message: string, cause: unknown) {
		super(message);
		this.cause = cause;
	}
}

/** Never finished establishing a TCP/TLS connection. */
export class ConnectionTimeoutError extends MediationError {
	override readonly name = "ConnectionTimeoutError";
}

/** Connected, but no response headers/body within the configured timeout. */
export class RequestTimeoutError extends MediationError {
	override readonly name = "RequestTimeoutError";
}

/**
 * Connection-level failure that isn't a timeout: socket reset, refused,
 * DNS lookup failed, host unreachable, etc. The `code` field carries
 * the underlying Node system code where available.
 */
export class ConnectionFailureError extends MediationError {
	override readonly name = "ConnectionFailureError";
	readonly code: string | undefined;
	constructor(message: string, cause: unknown, code: string | undefined) {
		super(message, cause);
		this.code = code;
	}
}

/**
 * Catch-all for errors we can't classify. Concrete (not abstract) so
 * callers can always rely on `toMediationError` returning *some*
 * `MediationError` instance.
 */
export class MediationUnknownError extends MediationError {
	override readonly name = "MediationUnknownError";
}

/**
 * Node.js system-error codes that indicate a connection-level failure
 * (DNS lookup, TCP handshake, TLS handshake, socket reset, etc.). Node
 * doesn't model these as subclasses so we branch on `.code` instead.
 */
const CONNECTION_ERROR_CODES = new Set([
	"ECONNREFUSED",
	"ECONNRESET",
	"ENOTFOUND",
	"ETIMEDOUT",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"EAI_AGAIN",
]);

function systemErrorCode(error: unknown): string | undefined {
	if (error instanceof Error) {
		const code = (error as Error & { code?: unknown }).code;
		if (typeof code === "string") return code;
	}
	return undefined;
}

/**
 * Single conversion point from raw runtime errors (undici / Node) to
 * the {@link MediationError} hierarchy. All branching on undici
 * classes and Node error codes lives here — nowhere else in the
 * codebase needs to know about either.
 */
export function toMediationError(raw: unknown): MediationError {
	if (raw instanceof MediationError) return raw;

	const message = raw instanceof Error ? raw.message : String(raw);

	if (raw instanceof undiciErrors.ConnectTimeoutError) {
		return new ConnectionTimeoutError(message, raw);
	}
	if (
		raw instanceof undiciErrors.BodyTimeoutError ||
		raw instanceof undiciErrors.HeadersTimeoutError
	) {
		return new RequestTimeoutError(message, raw);
	}
	if (raw instanceof undiciErrors.SocketError) {
		return new ConnectionFailureError(message, raw, systemErrorCode(raw));
	}

	const code = systemErrorCode(raw);
	if (code !== undefined && CONNECTION_ERROR_CODES.has(code)) {
		return new ConnectionFailureError(message, raw, code);
	}

	return new MediationUnknownError(message, raw);
}
