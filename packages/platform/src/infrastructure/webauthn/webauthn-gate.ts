/**
 * Domain gate — passkeys are only available for internal-auth principals.
 *
 * A domain is "federated" if it has any row in `email_domain_mapping`.
 * Federated domains MUST NOT be issued passkey challenges or have
 * credentials returned to them — the IdP owns identity for that domain.
 *
 * The check is enforced at TWO points:
 *   1. `register/begin` and `authenticate/begin` — refuse to issue a
 *      challenge (or, in the public auth path, return a deterministic-
 *      fake challenge for enumeration defense).
 *   2. `authenticate/complete` — hard cutover. Even if a domain becomes
 *      federated AFTER credentials were registered, the credential is
 *      not honoured.
 */

import type { EmailDomainMappingRepository } from "../persistence/repositories/email-domain-mapping-repository.js";

export class WebauthnDomainFederatedError extends Error {
	constructor(message: string = "passkeys are not available for this domain") {
		super(message);
		this.name = "WebauthnDomainFederatedError";
	}
}

export class WebauthnInvalidEmailError extends Error {
	constructor(message: string = "email is not in a valid 'local@domain' format") {
		super(message);
		this.name = "WebauthnInvalidEmailError";
	}
}

export function extractDomain(email: string): string {
	const at = email.indexOf("@");
	if (at < 0 || at === email.length - 1) {
		throw new WebauthnInvalidEmailError();
	}
	const domain = email.slice(at + 1).toLowerCase();
	if (!domain) throw new WebauthnInvalidEmailError();
	return domain;
}

/**
 * Resolves to the canonical domain when the email is internal-auth.
 * Throws `WebauthnDomainFederatedError` when the domain has a mapping.
 */
export async function ensureInternalAuth(
	email: string,
	repo: EmailDomainMappingRepository,
): Promise<string> {
	const domain = extractDomain(email);
	const mapping = await repo.findByEmailDomain(domain);
	if (mapping) {
		throw new WebauthnDomainFederatedError();
	}
	return domain;
}
