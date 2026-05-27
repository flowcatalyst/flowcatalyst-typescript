/**
 * TypeBox request / response schemas for the applications admin API.
 * Exported separately so route-group files can import what they need
 * without the router file becoming the central schema dump.
 */

import { Type, type Static } from "@sinclair/typebox";

// ─── Request bodies ────────────────────────────────────────────────────────

export const CreateApplicationSchema = Type.Object({
	code: Type.String({ minLength: 1, maxLength: 50 }),
	name: Type.String({ minLength: 1, maxLength: 255 }),
	type: Type.Optional(
		Type.Union([Type.Literal("APPLICATION"), Type.Literal("INTEGRATION")]),
	),
	description: Type.Optional(
		Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
	),
	iconUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	website: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	logo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	logoMimeType: Type.Optional(
		Type.Union([Type.String({ maxLength: 100 }), Type.Null()]),
	),
	defaultBaseUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
});

export const UpdateApplicationSchema = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	description: Type.Optional(
		Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
	),
	iconUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	website: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	logo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	logoMimeType: Type.Optional(
		Type.Union([Type.String({ maxLength: 100 }), Type.Null()]),
	),
	defaultBaseUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
});

export const ClientIdSchema = Type.Object({
	clientId: Type.String({ minLength: 13, maxLength: 13 }),
});

// ─── Path / query params ───────────────────────────────────────────────────

export const IdParam = Type.Object({ id: Type.String() });
export const CodeParam = Type.Object({ code: Type.String() });
export const IdClientIdParam = Type.Object({
	id: Type.String(),
	clientId: Type.String(),
});

export const ListApplicationsQuery = Type.Object({
	page: Type.Optional(Type.String()),
	pageSize: Type.Optional(Type.String()),
	type: Type.Optional(Type.String()),
	activeOnly: Type.Optional(Type.String()),
});

export type CreateApplicationBody = Static<typeof CreateApplicationSchema>;
export type UpdateApplicationBody = Static<typeof UpdateApplicationSchema>;
export type ClientIdBody = Static<typeof ClientIdSchema>;

// ─── Responses ─────────────────────────────────────────────────────────────

export const ApplicationResponseSchema = Type.Object({
	id: Type.String(),
	type: Type.String(),
	code: Type.String(),
	name: Type.String(),
	description: Type.Union([Type.String(), Type.Null()]),
	iconUrl: Type.Union([Type.String(), Type.Null()]),
	website: Type.Union([Type.String(), Type.Null()]),
	logo: Type.Union([Type.String(), Type.Null()]),
	logoMimeType: Type.Union([Type.String(), Type.Null()]),
	defaultBaseUrl: Type.Union([Type.String(), Type.Null()]),
	serviceAccountId: Type.Union([Type.String(), Type.Null()]),
	active: Type.Boolean(),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
	// True iff this application has an authorization_code OAuth client
	// (login client) provisioned. Returned on detail GET only — list GET
	// omits it to avoid N+1.
	hasLoginClient: Type.Optional(Type.Boolean()),
});

export const ApplicationsListResponseSchema = Type.Object({
	applications: Type.Array(ApplicationResponseSchema),
	total: Type.Integer(),
	page: Type.Integer(),
	pageSize: Type.Integer(),
});

export const ApplicationClientConfigResponseSchema = Type.Object({
	id: Type.String(),
	applicationId: Type.String(),
	clientId: Type.String(),
	enabled: Type.Boolean(),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});

export const ApplicationClientConfigsListResponseSchema = Type.Object({
	configs: Type.Array(ApplicationClientConfigResponseSchema),
});

export const ApplicationRolesResponseSchema = Type.Object({
	roles: Type.Array(
		Type.Object({
			id: Type.String(),
			name: Type.String(),
			displayName: Type.String(),
			description: Type.Union([Type.String(), Type.Null()]),
			permissions: Type.Array(Type.String()),
			clientManaged: Type.Boolean(),
		}),
	),
});

export const OAuthClientCredentialsSchema = Type.Object({
	id: Type.String(),
	clientId: Type.String(),
	clientSecret: Type.Optional(Type.String()),
});

export const ServiceAccountCredentialsSchema = Type.Object({
	principalId: Type.String(),
	name: Type.String(),
	oauthClient: OAuthClientCredentialsSchema,
});

export const ProvisionServiceAccountResponseSchema = Type.Object({
	message: Type.String(),
	serviceAccount: ServiceAccountCredentialsSchema,
});

export const ProvisionServiceAccountSchema = Type.Object({
	code: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
	name: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
});

export const LoginClientTypeSchema = Type.Union([
	Type.Literal("PUBLIC"),
	Type.Literal("CONFIDENTIAL"),
]);

export const ProvisionLoginClientRequestSchema = Type.Object({
	clientType: Type.Optional(LoginClientTypeSchema),
	redirectUris: Type.Array(Type.String({ minLength: 1 }), { minItems: 1 }),
	allowedOrigins: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
});

export const LoginClientCredentialsSchema = Type.Object({
	clientType: LoginClientTypeSchema,
	redirectUris: Type.Array(Type.String()),
	oauthClient: OAuthClientCredentialsSchema,
});

export const ProvisionLoginClientResponseSchema = Type.Object({
	message: Type.String(),
	loginClient: LoginClientCredentialsSchema,
});

export type ApplicationResponse = Static<typeof ApplicationResponseSchema>;
export type ApplicationClientConfigResponse = Static<
	typeof ApplicationClientConfigResponseSchema
>;
