/**
 * OIDC Infrastructure Module
 *
 * Exports all OIDC-related infrastructure components.
 */

// Drizzle adapter for oidc-provider
export {
	createDrizzleAdapterFactory,
	cleanupExpiredPayloads,
	getPayloadStats,
	invalidateOidcClientCache,
} from "./drizzle-adapter.js";

// Account adapter (Principal integration)
export {
	createFindAccount,
	createAccountAdapter,
	type AccountAdapter,
} from "./account-adapter.js";

// Client adapter (OAuthClient integration)
export {
	createClientLoader,
	createClientValidator,
	getClientAllowedOrigins,
	isOriginAllowedForAnyClient,
} from "./client-adapter.js";

// OIDC provider configuration and setup
export {
	createOidcProvider,
	getProviderCallback,
	type OidcProviderConfig,
	type OidcProvider,
} from "./provider.js";

// Fastify integration
export {
	mountOidcProvider,
	registerWellKnownRoutes,
	registerOAuthCompatibilityRoutes,
	registerOidcEndpointRoutes,
	registerCustomUserInfoRoute,
} from "./fastify-adapter.js";

// JWT key service (RS256 signing, JWKS)
export {
	createJwtKeyService,
	extractApplicationCodes,
	type JwtKeyService,
	type JwtKeyServiceConfig,
} from "./jwt-key-service.js";

// Key utilities (generation, rotation, directory management)
export {
	generateKeyPair,
	computeKeyId,
	loadKeyDir,
	writeKeyPair,
	removeKeyPair,
	type KeyPairFiles,
} from "./key-utils.js";

// Auth routes (login, logout, me)
export {
	registerAuthRoutes,
	type AuthRoutesDeps,
	type SessionCookieConfig,
} from "./auth-routes.js";

// OIDC federation routes (external IDP login)
export {
	registerOidcFederationRoutes,
	type OidcFederationDeps,
} from "./oidc-federation-routes.js";

// Client selection routes (client context switching)
export {
	registerClientSelectionRoutes,
	type ClientSelectionDeps,
} from "./client-selection-routes.js";

// OIDC sync service (user + role sync)
export {
	createOrUpdateOidcUser,
	syncIdpRoles,
	extractIdpRoles,
} from "./oidc-sync-service.js";

// Login rate limiting (layered model: per-(email, ip) backoff + per-email lockout)
export {
	LoginRateLimitService,
	defaultLoginRateLimitConfig,
	type LoginRateLimitConfig,
	type LoginRateLimitDecision,
	type LoginRateLimitReason,
} from "./login-rate-limit-service.js";

// Per-IP rate limiting for /auth/* and /oauth/token endpoints
export {
	AuthRateLimiters,
	defaultAuthRateLimitConfig,
	registerAuthIpRateLimit,
	registerTokenIpRateLimit,
	type AuthRateLimitConfig,
} from "./auth-rate-limit-plugin.js";

// Safe client-IP extractor (X-Forwarded-For aware, spoof-resistant)
export { getClientIp, type ClientIpOptions } from "./client-ip.js";
