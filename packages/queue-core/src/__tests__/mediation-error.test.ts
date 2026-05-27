/**
 * MediationError — conversion + classification tests.
 *
 * The hierarchy is the public contract callers branch on; this file
 * pins the mapping from raw runtime errors (undici / Node system
 * codes / plain Error) to MediationError subclasses so a future undici
 * refactor doesn't silently re-route classifications.
 */

import { describe, it, expect } from "vitest";
import { errors as undiciErrors } from "undici";
import {
	ConnectionFailureError,
	ConnectionTimeoutError,
	MediationError,
	MediationUnknownError,
	RequestTimeoutError,
	toMediationError,
} from "../mediation/mediation-error.js";

describe("toMediationError", () => {
	it("classifies undici ConnectTimeoutError as ConnectionTimeoutError", () => {
		const raw = new undiciErrors.ConnectTimeoutError("connect timeout");
		const err = toMediationError(raw);
		expect(err).toBeInstanceOf(ConnectionTimeoutError);
		expect(err.cause).toBe(raw);
		expect(err.message).toBe("connect timeout");
	});

	it("classifies undici BodyTimeoutError as RequestTimeoutError", () => {
		const raw = new undiciErrors.BodyTimeoutError("body timeout");
		expect(toMediationError(raw)).toBeInstanceOf(RequestTimeoutError);
	});

	it("classifies undici HeadersTimeoutError as RequestTimeoutError", () => {
		const raw = new undiciErrors.HeadersTimeoutError("headers timeout");
		expect(toMediationError(raw)).toBeInstanceOf(RequestTimeoutError);
	});

	it("classifies undici SocketError as ConnectionFailureError", () => {
		const raw = new undiciErrors.SocketError("socket boom");
		const err = toMediationError(raw);
		expect(err).toBeInstanceOf(ConnectionFailureError);
	});

	const systemCodes = [
		"ECONNREFUSED",
		"ECONNRESET",
		"ENOTFOUND",
		"ETIMEDOUT",
		"EHOSTUNREACH",
		"ENETUNREACH",
		"EAI_AGAIN",
	];
	for (const code of systemCodes) {
		it(`classifies Node system error with code ${code} as ConnectionFailureError`, () => {
			const raw = Object.assign(new Error("system"), { code });
			const err = toMediationError(raw);
			expect(err).toBeInstanceOf(ConnectionFailureError);
			expect((err as ConnectionFailureError).code).toBe(code);
		});
	}

	it("preserves an existing MediationError instance instead of re-wrapping", () => {
		const original = new ConnectionTimeoutError("orig", new Error("inner"));
		expect(toMediationError(original)).toBe(original);
	});

	it("falls back to MediationUnknownError for unrecognised plain errors", () => {
		const raw = new Error("something else");
		const err = toMediationError(raw);
		expect(err).toBeInstanceOf(MediationUnknownError);
		expect(err.message).toBe("something else");
	});

	it("falls back to MediationUnknownError for thrown non-Error values", () => {
		const err = toMediationError("just a string");
		expect(err).toBeInstanceOf(MediationUnknownError);
		expect(err.message).toBe("just a string");
	});

	it("ignores .code values that aren't connection-failure codes", () => {
		// An EISDIR or EACCES on the local filesystem is a programmer
		// error, not a connection failure — make sure we don't mis-classify.
		const raw = Object.assign(new Error("eperm"), { code: "EPERM" });
		expect(toMediationError(raw)).toBeInstanceOf(MediationUnknownError);
	});

	it("every classification is a MediationError subclass", () => {
		const samples = [
			new undiciErrors.ConnectTimeoutError("x"),
			new undiciErrors.BodyTimeoutError("x"),
			new undiciErrors.SocketError("x"),
			Object.assign(new Error("x"), { code: "ECONNREFUSED" }),
			new Error("plain"),
			"raw string",
		];
		for (const raw of samples) {
			expect(toMediationError(raw)).toBeInstanceOf(MediationError);
		}
	});
});
