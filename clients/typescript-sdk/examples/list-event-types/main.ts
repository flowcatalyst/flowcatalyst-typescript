/**
 * list-event-types — smallest possible FlowCatalyst SDK example.
 *
 * Builds a FlowCatalystClient against a platform URL, calls
 * `eventTypes().list()`, and prints the result. Two auth flavors are shown:
 *
 *   - Static bearer token (set via FC_TOKEN). Fine for scripts.
 *   - OAuth2 client_credentials (set FC_CLIENT_ID + FC_CLIENT_SECRET).
 *     The OidcTokenManager caches tokens until ~60s before expiry and
 *     refreshes on demand — wire this for long-running services.
 *
 * # Run
 *
 *   FC_BASE_URL=https://api.flowcatalyst.io \
 *   FC_TOKEN=eyJ...                          \
 *   pnpm tsx examples/list-event-types/main.ts
 *
 * Or with client credentials:
 *
 *   FC_BASE_URL=https://api.flowcatalyst.io \
 *   FC_CLIENT_ID=svc-app                    \
 *   FC_CLIENT_SECRET=...                    \
 *   pnpm tsx examples/list-event-types/main.ts
 */

import { FlowCatalystClient, type FlowCatalystConfig } from "@flowcatalyst/sdk";

async function main(): Promise<void> {
	const baseUrl = process.env["FC_BASE_URL"];
	if (!baseUrl) {
		console.error("FC_BASE_URL is required");
		process.exit(1);
	}

	const client = new FlowCatalystClient(buildConfig(baseUrl));

	const application = process.env["FC_APP"];
	const result = await client.eventTypes().list(
		application ? { application: [application] } : undefined,
	);

	if (result.isErr()) {
		// SdkError is a tagged union — surface the type field so the user
		// can see whether this is auth, network, validation, etc.
		const e = result.error;
		console.error(`list event types failed (${e.type}): ${e.message}`);
		process.exit(1);
	}

	for (const et of result.value.eventTypes ?? []) {
		console.log(`${et.code}\t${et.name}\t(application=${et.application})`);
	}
}

function buildConfig(baseUrl: string): FlowCatalystConfig {
	const token = process.env["FC_TOKEN"];
	if (token) {
		return { baseUrl, accessToken: token };
	}
	const clientId = process.env["FC_CLIENT_ID"];
	const clientSecret = process.env["FC_CLIENT_SECRET"];
	if (clientId && clientSecret) {
		return { baseUrl, clientId, clientSecret };
	}
	console.error(
		"set FC_TOKEN, or FC_CLIENT_ID + FC_CLIENT_SECRET",
	);
	process.exit(1);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
