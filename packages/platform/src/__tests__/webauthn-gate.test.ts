import { describe, it, expect } from "vitest";
import {
	WebauthnDomainFederatedError,
	WebauthnInvalidEmailError,
	ensureInternalAuth,
	extractDomain,
} from "../infrastructure/webauthn/webauthn-gate.js";
import type { EmailDomainMappingRepository } from "../infrastructure/persistence/repositories/email-domain-mapping-repository.js";

/**
 * Stub repo that returns a mapping for the listed domains and undefined
 * for everything else. The other repository methods are unused by the
 * gate and throw if called.
 */
function makeRepo(federatedDomains: readonly string[]): EmailDomainMappingRepository {
	const set = new Set(federatedDomains.map((d) => d.toLowerCase()));
	return {
		async findByEmailDomain(domain: string) {
			if (!set.has(domain)) return undefined;
			return {
				id: `edm_${domain}`,
				emailDomain: domain,
				identityProviderId: "idp_test",
				active: true,
				autoProvisionUsers: false,
				defaultRoles: [],
				additionalApplicationCodes: [],
				additionalClientIds: [],
				grantedClientIds: [],
				allowedRoles: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
}

describe("extractDomain", () => {
	it("lowercases the domain", () => {
		expect(extractDomain("Alice@Example.COM")).toBe("example.com");
	});

	it("rejects emails without an @", () => {
		expect(() => extractDomain("alice")).toThrow(WebauthnInvalidEmailError);
	});

	it("rejects emails ending in @", () => {
		expect(() => extractDomain("alice@")).toThrow(WebauthnInvalidEmailError);
	});

	it("takes the part after the first @ only", () => {
		expect(extractDomain("alice@example.com")).toBe("example.com");
	});
});

describe("ensureInternalAuth", () => {
	it("resolves to the domain when no mapping exists", async () => {
		const repo = makeRepo([]);
		await expect(ensureInternalAuth("u@internal.test", repo)).resolves.toBe(
			"internal.test",
		);
	});

	it("rejects federated domains with WebauthnDomainFederatedError", async () => {
		const repo = makeRepo(["entra.example.com"]);
		await expect(
			ensureInternalAuth("u@entra.example.com", repo),
		).rejects.toBeInstanceOf(WebauthnDomainFederatedError);
	});

	it("treats domain matching as case-insensitive", async () => {
		const repo = makeRepo(["entra.example.com"]);
		await expect(
			ensureInternalAuth("u@Entra.Example.COM", repo),
		).rejects.toBeInstanceOf(WebauthnDomainFederatedError);
	});

	it("does NOT collide on substring — `entra.com` does not match `notentra.com`", async () => {
		const repo = makeRepo(["entra.com"]);
		await expect(ensureInternalAuth("u@notentra.com", repo)).resolves.toBe(
			"notentra.com",
		);
	});

	it("rejects malformed emails before consulting the repo", async () => {
		const repo = makeRepo([]);
		await expect(ensureInternalAuth("notanemail", repo)).rejects.toBeInstanceOf(
			WebauthnInvalidEmailError,
		);
	});
});
