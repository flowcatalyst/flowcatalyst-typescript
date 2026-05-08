/**
 * API client for WebAuthn / passkey operations.
 *
 * The `/auth/webauthn/*` routes sit under `/auth`, not `/api`, so this
 * uses raw fetch (with credentials: 'include') rather than apiFetch
 * which prepends `/api`. Same convention as /auth/login and /auth/me.
 *
 * The browser-side ceremony helpers from @simplewebauthn/browser are
 * wrapped here so callers don't need to know the options shape.
 */

import {
	startAuthentication,
	startRegistration,
} from "@simplewebauthn/browser";

export interface PasskeySummary {
	id: string;
	name: string | null;
	createdAt: string;
	lastUsedAt: string | null;
}

async function authFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<
	| { ok: true; data: T }
	| { ok: false; status: number; body: unknown }
> {
	const headers: Record<string, string> = {
		Accept: "application/json",
		...(init?.headers as Record<string, string> | undefined),
	};
	if (init?.body !== undefined && headers["Content-Type"] === undefined) {
		headers["Content-Type"] = "application/json";
	}
	const res = await fetch(path, {
		credentials: "include",
		...init,
		headers,
	});
	if (!res.ok) {
		let body: unknown = null;
		try {
			body = await res.json();
		} catch {
			/* non-JSON body */
		}
		return { ok: false, status: res.status, body };
	}
	if (res.status === 204) {
		return { ok: true, data: undefined as T };
	}
	const data = (await res.json()) as T;
	return { ok: true, data };
}

export async function listPasskeys(): Promise<PasskeySummary[]> {
	const res = await authFetch<PasskeySummary[]>("/auth/webauthn/credentials");
	if (!res.ok) throw new Error("failed to list passkeys");
	return res.data ?? [];
}

export async function deletePasskey(id: string): Promise<void> {
	const res = await authFetch<void>(
		`/auth/webauthn/credentials/${encodeURIComponent(id)}`,
		{ method: "DELETE" },
	);
	if (!res.ok) throw new Error("failed to revoke passkey");
}

export async function registerPasskey(opts: {
	displayName?: string;
	name?: string;
}): Promise<{ credentialId: string }> {
	const begin = await authFetch<{ stateId: string; options: unknown }>(
		"/auth/webauthn/register/begin",
		{
			method: "POST",
			body: JSON.stringify({ displayName: opts.displayName }),
		},
	);
	if (!begin.ok) {
		const body = begin.body as { code?: string; message?: string } | null;
		throw new Error(
			body?.code === "DOMAIN_FEDERATED"
				? "Passkeys are not available for your domain."
				: (body?.message ?? "registration failed"),
		);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const credential = await startRegistration({ optionsJSON: begin.data.options as any });

	const complete = await authFetch<{ credentialId: string }>(
		"/auth/webauthn/register/complete",
		{
			method: "POST",
			body: JSON.stringify({
				stateId: begin.data.stateId,
				name: opts.name ?? null,
				credential,
			}),
		},
	);
	if (!complete.ok) {
		throw new Error("passkey could not be saved");
	}
	return complete.data;
}

export async function authenticateWithPasskey(email: string): Promise<{
	principalId: string;
	email: string | null;
	name: string;
	roles: string[];
}> {
	const begin = await authFetch<{ stateId: string; options: unknown }>(
		"/auth/webauthn/authenticate/begin",
		{
			method: "POST",
			body: JSON.stringify({ email }),
		},
	);
	if (!begin.ok) throw new Error("passkey authentication failed");

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const credential = await startAuthentication({ optionsJSON: begin.data.options as any });

	const complete = await authFetch<{
		principalId: string;
		email: string | null;
		name: string;
		roles: string[];
	}>("/auth/webauthn/authenticate/complete", {
		method: "POST",
		body: JSON.stringify({
			stateId: begin.data.stateId,
			credential,
		}),
	});
	if (!complete.ok) {
		throw new Error("passkey authentication failed");
	}
	return complete.data;
}
