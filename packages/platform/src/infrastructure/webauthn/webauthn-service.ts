/**
 * WebauthnService
 *
 * Thin wrapper around @simplewebauthn/server that owns RP configuration
 * (id, origin, name) and exposes the four ceremonies the routes need:
 *
 *   - generateRegistration(...) → challenge for navigator.credentials.create()
 *   - verifyRegistration(...)   → produces a credential to persist
 *   - generateAuthentication(...) → challenge for navigator.credentials.get()
 *   - verifyAuthentication(...)  → produces a new sign-count to update
 *
 * Plus a deterministic-fake authentication challenge for the enumeration
 * defense path (used by `authenticate/begin` when the email is unknown,
 * federated, or has no credentials).
 *
 * Verification is forced to require user verification — passkeys are a
 * single-factor scheme; UV is the factor.
 */

import { createHmac, randomBytes } from "node:crypto";
import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
	type AuthenticationResponseJSON,
	type AuthenticatorTransportFuture,
	type PublicKeyCredentialCreationOptionsJSON,
	type PublicKeyCredentialRequestOptionsJSON,
	type RegistrationResponseJSON,
	type WebAuthnCredential,
} from "@simplewebauthn/server";
import type { WebauthnCredentialData } from "../persistence/schema/webauthn-credentials.js";

export interface WebauthnServiceConfig {
	/** RP ID — typically the registrable domain (e.g. "example.com"). */
	readonly rpId: string;
	/** Full origin(s) the browser will report (e.g. ["https://auth.example.com"]). */
	readonly origins: readonly string[];
	/** RP name shown in the authenticator UI. */
	readonly rpName: string;
	/** HMAC key for deterministic-fake challenges (enumeration defense). */
	readonly enumerationDefenseKey: Buffer;
}

export interface VerifiedRegistration {
	/** Raw credential id bytes — index column. */
	readonly credentialIdBytes: Uint8Array;
	/** Persistable credential data (public key, sign-count, transports, …). */
	readonly data: WebauthnCredentialData;
}

export interface VerifiedAuthentication {
	/** Refreshed credential data to write back to the row. */
	readonly data: WebauthnCredentialData;
}

export class WebauthnService {
	private readonly config: WebauthnServiceConfig;

	constructor(config: WebauthnServiceConfig) {
		this.config = config;
	}

	get rpId(): string {
		return this.config.rpId;
	}

	get origins(): readonly string[] {
		return this.config.origins;
	}

	async generateRegistration(input: {
		principalId: string;
		userName: string;
		userDisplayName: string;
		excludeCredentials: readonly Uint8Array[];
	}): Promise<PublicKeyCredentialCreationOptionsJSON> {
		return await generateRegistrationOptions({
			rpName: this.config.rpName,
			rpID: this.config.rpId,
			userID: new TextEncoder().encode(input.principalId),
			userName: input.userName,
			userDisplayName: input.userDisplayName,
			attestationType: "none",
			excludeCredentials: input.excludeCredentials.map((id) => ({
				id: bytesToBase64Url(id),
			})),
			authenticatorSelection: {
				residentKey: "preferred",
				userVerification: "required",
			},
			supportedAlgorithmIDs: [-8, -7, -257],
		});
	}

	async verifyRegistration(input: {
		response: RegistrationResponseJSON;
		expectedChallenge: string;
	}): Promise<VerifiedRegistration> {
		const result = await verifyRegistrationResponse({
			response: input.response,
			expectedChallenge: input.expectedChallenge,
			expectedOrigin: [...this.config.origins],
			expectedRPID: this.config.rpId,
			requireUserVerification: true,
		});
		if (!result.verified || !result.registrationInfo) {
			throw new WebauthnVerificationError("registration verification failed");
		}
		const info = result.registrationInfo;
		const data: WebauthnCredentialData = {
			credentialID: info.credential.id,
			credentialPublicKey: bytesToBase64Url(info.credential.publicKey),
			counter: info.credential.counter,
			deviceType: info.credentialDeviceType,
			backedUp: info.credentialBackedUp,
			...(info.credential.transports
				? { transports: info.credential.transports }
				: {}),
		};
		return {
			credentialIdBytes: info.credential.id
				? base64UrlToBytes(info.credential.id)
				: new Uint8Array(),
			data,
		};
	}

	async generateAuthentication(input: {
		allowCredentials: readonly Uint8Array[];
		transportsByCredentialId?: ReadonlyMap<string, readonly string[]>;
	}): Promise<PublicKeyCredentialRequestOptionsJSON> {
		return await generateAuthenticationOptions({
			rpID: this.config.rpId,
			userVerification: "required",
			allowCredentials: input.allowCredentials.map((id) => {
				const idB64 = bytesToBase64Url(id);
				const transports = input.transportsByCredentialId?.get(idB64);
				return transports !== undefined
					? {
							id: idB64,
							transports: transports as AuthenticatorTransportFuture[],
						}
					: { id: idB64 };
			}),
		});
	}

	async verifyAuthentication(input: {
		response: AuthenticationResponseJSON;
		expectedChallenge: string;
		credential: WebauthnCredentialData;
	}): Promise<VerifiedAuthentication> {
		const credential: WebAuthnCredential = {
			id: input.credential.credentialID,
			publicKey: base64UrlToBytes(input.credential.credentialPublicKey),
			counter: input.credential.counter,
			...(input.credential.transports
				? {
						transports:
							input.credential.transports as AuthenticatorTransportFuture[],
					}
				: {}),
		};

		const result = await verifyAuthenticationResponse({
			response: input.response,
			expectedChallenge: input.expectedChallenge,
			expectedOrigin: [...this.config.origins],
			expectedRPID: this.config.rpId,
			credential,
			requireUserVerification: true,
		});
		if (!result.verified) {
			throw new WebauthnVerificationError("authentication verification failed");
		}
		return {
			data: {
				...input.credential,
				counter: result.authenticationInfo.newCounter,
				deviceType: result.authenticationInfo.credentialDeviceType,
				backedUp: result.authenticationInfo.credentialBackedUp,
			},
		};
	}

	/**
	 * Build a deterministic-fake authentication challenge for emails that
	 * are unknown, federated, or have no credentials. Same email always
	 * returns the same fake `allowCredentials` list (HMAC-derived) so the
	 * caller can't distinguish a real challenge from a fake without the
	 * enumerationDefenseKey.
	 */
	async generateFakeAuthentication(
		email: string,
	): Promise<PublicKeyCredentialRequestOptionsJSON> {
		const fakeIds = deriveFakeCredentialIds(
			email,
			this.config.enumerationDefenseKey,
		);
		return await generateAuthenticationOptions({
			rpID: this.config.rpId,
			userVerification: "required",
			allowCredentials: fakeIds.map((id) => ({ id: bytesToBase64Url(id) })),
		});
	}
}

export class WebauthnVerificationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "WebauthnVerificationError";
	}
}

/**
 * 1–2 deterministic credential ids per email, derived via HMAC. The
 * caller cannot distinguish a real challenge from this without the key.
 */
function deriveFakeCredentialIds(
	email: string,
	key: Buffer,
): readonly Uint8Array[] {
	const h1 = createHmac("sha256", key).update(`${email}|0`).digest();
	const h2 = createHmac("sha256", key).update(`${email}|1`).digest();
	return [new Uint8Array(h1), new Uint8Array(h2)];
}

function bytesToBase64Url(bytes: Uint8Array): string {
	return Buffer.from(bytes)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function base64UrlToBytes(b64url: string): Uint8Array<ArrayBuffer> {
	const padded = b64url.replace(/-/g, "+").replace(/_/g, "/");
	const padding =
		padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
	const buf = Buffer.from(padded + padding, "base64");
	// Copy into a fresh ArrayBuffer-backed Uint8Array. WebAuthnCredential
	// requires Uint8Array<ArrayBuffer>, not Uint8Array<ArrayBufferLike>.
	const out = new Uint8Array(new ArrayBuffer(buf.byteLength));
	out.set(buf);
	return out;
}

/**
 * Generate a per-deployment HMAC key for the enumeration-defense path.
 * Operators MUST set WEBAUTHN_ENUMERATION_KEY in production for stable
 * fake responses across deployments — otherwise it'll churn on each
 * restart, which still defends but means the "deterministic" property
 * is only per-instance.
 */
export function generateEnumerationDefenseKey(): Buffer {
	return randomBytes(32);
}
