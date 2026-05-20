# Application OAuth Provisioning — TS-side port from Rust PR #6

This is a handoff doc for porting two related changes from the Rust repo
(`flowcatalyst-rust` PR #6) into this TS monorepo. The Rust change shipped
both pieces together because they share the OAuth-client provisioning
plumbing. Do the same here.

## What the Rust change did

1. **Extended `POST /api/applications/{id}/provision-service-account`** so
   that creating a service account ALSO mints a `CONFIDENTIAL` OAuth client
   with `grant_types: ["client_credentials"]` linked to the SA's principal.
   The response now returns the plaintext `clientSecret` exactly once. All
   three writes (`ServiceAccount`, `Application.serviceAccountId` attach,
   `OAuthClient`) happen in a single PG transaction; partial failure rolls
   back the whole set.

2. **Added `POST /api/applications/{id}/provision-login-client`** —
   creates one OAuth client with `grant_types: ["authorization_code"]`,
   PKCE-required if PUBLIC (the default for SPAs/native), or with a
   generated `clientSecret` if CONFIDENTIAL. Body: `{ clientType?:
   "PUBLIC" | "CONFIDENTIAL", redirectUris: string[], allowedOrigins?:
   string[] }`. 409 if a login client already exists for the application
   (defined as "OAuth client whose `applicationIds` contains this app AND
   `grantTypes` contains `authorization_code` AND
   `serviceAccountPrincipalId` is null").

3. Application detail GET response gained a `hasLoginClient: boolean`
   field so the UI can gate the "Provision Login Client" form vs the
   "Provisioned" status. The list endpoint leaves it absent (avoid N+1).

4. Frontend application detail page now renders two cards (Service
   Account + Login Client). Each card has a provision form when not yet
   set up, and a "Provisioned, manage in OAuth Clients" status with link
   when it is.

Reference PR: https://github.com/flowcatalyst/flowcatalyst/pull/6 (commit
`ffb446c`). The Rust diff is the source of truth for shape/semantics.

## TS-side gaps (verified)

Most of the plumbing already exists. Notable surprises:

- **`createServiceAccountUseCase` already mints an OAuth client internally**
  (`packages/platform/src/application/service-account/create-service-account/use-case.ts:153-160`)
  — generates encrypted secret, links to the principal, writes via
  `unitOfWork.commitAll(...)` on line 179. So step 1 in this repo is
  smaller than it looked in Rust: the use case is already correct; you
  mostly need to make sure the handler **returns** the plaintext secret
  it threw away.
- **`OAuthClientRepository.findByApplication(appId)` does NOT exist**
  (`packages/platform/src/infrastructure/persistence/repositories/oauth-client-repository.ts:47-69`).
  Add it before step 3.
- The frontend already has the Service Account card + credentials modal
  on `apps/platform-frontend/src/pages/applications/ApplicationDetailPage.vue:336-485`.
  No new card scaffolding needed for SA; add a sibling Login Client card.

## Step-by-step

### 1. Add `OAuthClientRepository.findByApplication`

**File**: `packages/platform/src/infrastructure/persistence/repositories/oauth-client-repository.ts`

Add to the interface (lines 47–69) and implement on the Drizzle repository.
Query the `oauthClientApplicationIds` join table for `applicationId = $1`,
then fetch the matching `oauthClients` rows and hydrate the join arrays
the same way `findById` does. Mirror what
`crates/fc-platform/src/auth/oauth_client_repository.rs:423-442` does in
Rust — return `Promise<OAuthClient[]>`.

### 2. Make `provision-service-account` return plaintext credentials

**File**: `packages/platform/src/api/admin/applications.ts:722-808`

Today the handler returns just the `ProvisionServiceAccountResponseSchema`
shape (lines 173–180) — service account metadata, no credentials. After:

- Capture the plaintext `clientSecret` from the
  `createServiceAccountUseCase.execute()` result (the use case already
  computes it on line 124; expose it in the success event payload if
  it's not already there).
- Update the response schema to match the frontend's existing
  expectation:
  ```ts
  {
    message: string;
    serviceAccount: {
      principalId: string;
      name: string;
      oauthClient: { id: string; clientId: string; clientSecret: string };
    };
  }
  ```
  This is the shape the frontend already reads at
  `apps/platform-frontend/src/api/applications.ts:140-147` and
  `apps/platform-frontend/src/pages/applications/ApplicationDetailPage.vue:443-471`.
- Confirm the existing PG-transaction guarantee covers all three writes
  (SA insert, Application attach via
  `attachServiceAccountToApplicationUseCase`, OAuthClient insert). If
  `attach` runs after `commitAll` rather than inside it, fold it in.

### 3. Add the new endpoint `POST /api/applications/{id}/provision-login-client`

**File**: `packages/platform/src/api/admin/applications.ts`

Mirror the SA route's structure (lines 722–808). Authorization: anchor-only
(existing `requireAnchor` middleware). Body Zod schema:

```ts
const ProvisionLoginClientRequest = z.object({
  clientType: z.enum(["PUBLIC", "CONFIDENTIAL"]).optional(), // default PUBLIC
  redirectUris: z.array(z.string().url()).min(1, "At least one redirect URI"),
  allowedOrigins: z.array(z.string().url()).optional(),
});
```

Handler flow:

1. Load application (404 if missing).
2. Reject with **409** if `OAuthClientRepository.findByApplication(app.id)`
   has any client with `grantTypes.includes("authorization_code") &&
   !serviceAccountPrincipalId`.
3. Generate fresh `oauthClientId` + public `clientId` (TSIDs — `crypto.randomUUID`-style,
   matches the existing pattern in `createServiceAccountUseCase`).
4. For `CONFIDENTIAL`: generate a 32-byte secret, encrypt via
   `encryptionService.encrypt(plaintext)` (from
   `@flowcatalyst/platform-crypto` — same import the SA use case uses on
   line 104–132), wrap result as `encrypted:<ciphertext>`.
5. Build a `CreateOAuthClientCommand` with:
   - `clientType` as supplied (default `PUBLIC`)
   - `clientSecretRef` set only when CONFIDENTIAL
   - `grantTypes: ["authorization_code"]`
   - `defaultScopes: ["openid", "profile", "email"]`
   - `pkceRequired: clientType === "PUBLIC"`
   - `applicationIds: [app.id]`
   - `serviceAccountPrincipalId: null`
6. Call `createOAuthClientUseCase.execute(cmd, ctx)`
   (`packages/platform/src/application/oauth/create-oauth-client/use-case.ts`).
7. Return:
   ```ts
   {
     message: "Login client provisioned",
     loginClient: {
       clientType: "PUBLIC" | "CONFIDENTIAL",
       redirectUris: string[],
       oauthClient: {
         id: oauthClientId,
         clientId,
         clientSecret?: string,  // only when CONFIDENTIAL
       },
     },
   }
   ```

Add a Zod schema for the response and register it in the OpenAPI surface.
Generate SDK clients via the repo's standard regen flow.

### 4. Add `hasLoginClient` to the application detail response

**File**: `packages/platform/src/api/admin/applications.ts` — application
detail GET handler (around line 841) and the response schema (lines
123–138).

- Schema: add `hasLoginClient: z.boolean().optional()`.
- Detail GET: compute via
  `OAuthClientRepository.findByApplication(app.id)`, filter for
  `grantTypes.includes("authorization_code") && !serviceAccountPrincipalId`,
  set `hasLoginClient: true` if any match.
- List GET: leave the field absent to avoid an N+1 across rows.

### 5. Frontend — `applicationsApi` + Login Client card

**File**: `apps/platform-frontend/src/api/applications.ts`

Add types and method (mirroring the Rust frontend's `applications.ts`
additions in commit `ffb446c`):

```ts
export interface ProvisionLoginClientRequest {
  clientType?: "PUBLIC" | "CONFIDENTIAL";
  redirectUris: string[];
  allowedOrigins?: string[];
}
export interface LoginClientCredentials {
  clientType: "PUBLIC" | "CONFIDENTIAL";
  redirectUris: string[];
  oauthClient: { id: string; clientId: string; clientSecret?: string };
}
// Inside applicationsApi:
provisionLoginClient(id: string, body: ProvisionLoginClientRequest):
  Promise<{ message: string; loginClient: LoginClientCredentials }>
```

Also add `hasLoginClient?: boolean` to the `Application` interface.

**File**: `apps/platform-frontend/src/pages/applications/ApplicationDetailPage.vue`

After the existing Service Account card (lines 336–376), add a sibling
"Login Client" card:

- Gate on `application.hasLoginClient`: when true, show the "Provisioned"
  status with an info message pointing at the OAuth Clients page. When
  false, render the form:
  - Client-type `<Select>` with two options (PUBLIC default, CONFIDENTIAL)
  - Redirect-URI input using the existing `InputText` + `Button` + `<Chip>`
    array pattern (copy the structure from
    `OAuthClientCreatePage.vue:246-268`)
  - "Provision Login Client" button disabled until at least one redirect
    URI is added
- Add a second credentials `<Dialog>` mirroring the SA dialog but with
  conditional rendering for `clientSecret` (only shown for CONFIDENTIAL)
  and a different warning message for PUBLIC ("PUBLIC clients use PKCE
  — no client secret").

The Rust commit (`ffb446c`) is the easiest reference for the exact Vue
template — copy the structure and rename the API method.

## Test plan

1. `pnpm typecheck && pnpm test` from repo root, clean.
2. Bring up the platform locally and the frontend.
3. Create a fresh application, click **Provision Service Account**. The
   modal should show `clientId` + `clientSecret`. Reload the page; the
   "Provision" button should be gone, replaced with "Provisioned".
4. Click **Provision Login Client** with `PUBLIC` + one redirect URI.
   Modal shows `clientId` only, no secret. Reload; "Provision Login
   Client" is gone.
5. Repeat step 4 on a different app, choose `CONFIDENTIAL`. Modal shows
   `clientId` + `clientSecret`.
6. Click Provision Login Client again on an app that already has one.
   Expect 409, surfaced as a toast.
7. Use the minted SA's `client_credentials` to fetch a token from the
   `/oauth/token` endpoint. Should succeed.
8. Use the minted PUBLIC login client's `clientId` in an auth-code +
   PKCE flow against `/oauth/authorize` → `/oauth/token`. Should
   succeed.
9. Rotate the SA's secret via the OAuth Clients page, then re-test the
   M2M token call. Old secret rejected, new secret accepted.

## Things easy to get wrong

- The frontend reads `application.serviceAccountId` (canonical) in some
  places and `application.serviceAccountPrincipalId` (legacy/stale) in
  others — the Rust fix was committed in `9967476` ("frontend: fix
  Application service-account field name"). When porting the page,
  prefer `serviceAccountId` everywhere.
- `unitOfWork.commitAll` in TS already covers multi-aggregate atomicity;
  don't introduce a second tx wrapper.
- The encryption ref format is `encrypted:<ciphertext>` — keep the
  literal `encrypted:` prefix; the M2M token verifier strips it.
- PUBLIC clients **must not** set `clientSecretRef` — the OAuth client
  domain rejects it. PKCE is the only auth mechanism.
- The login-client conflict check must filter on BOTH
  `grantTypes` AND `!serviceAccountPrincipalId`. Without the second
  predicate, a previously-provisioned SA's OAuth client would
  incorrectly count as a login client.
