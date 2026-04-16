/**
 * API Layer
 *
 * REST API endpoints for the platform service.
 */

import type { FastifyInstance } from "fastify";

import {
	registerPrincipalsRoutes,
	type PrincipalsRoutesDeps,
} from "./admin/principals.js";
import {
	registerClientsRoutes,
	type ClientsRoutesDeps,
} from "./admin/clients.js";
import {
	registerAnchorDomainsRoutes,
	type AnchorDomainsRoutesDeps,
} from "./admin/anchor-domains.js";
import {
	registerApplicationsRoutes,
	type ApplicationsRoutesDeps,
} from "./admin/applications.js";
import { registerRolesRoutes, type RolesRoutesDeps } from "./admin/roles.js";
import {
	registerAuthConfigsRoutes,
	type AuthConfigsRoutesDeps,
} from "./admin/auth-configs.js";
import {
	registerOAuthClientsRoutes,
	type OAuthClientsRoutesDeps,
} from "./admin/oauth-clients.js";
import {
	registerAuditLogsRoutes,
	type AuditLogsRoutesDeps,
} from "./admin/audit-logs.js";
import {
	registerEventTypesRoutes,
	type EventTypesRoutesDeps,
} from "./admin/event-types.js";
import {
	registerDispatchPoolsRoutes,
	type DispatchPoolsRoutesDeps,
} from "./admin/dispatch-pools.js";
import {
	registerConnectionsRoutes,
	type ConnectionsRoutesDeps,
} from "./admin/connections.js";
import {
	registerSubscriptionsRoutes,
	type SubscriptionsRoutesDeps,
} from "./admin/subscriptions.js";
import { registerEventsRoutes, type EventsRoutesDeps } from "./admin/events.js";
import {
	registerDispatchJobsRoutes,
	type DispatchJobsRoutesDeps,
} from "./admin/dispatch-jobs.js";
import {
	registerIdentityProvidersRoutes,
	type IdentityProvidersRoutesDeps,
} from "./admin/identity-providers.js";
import {
	registerEmailDomainMappingsRoutes,
	type EmailDomainMappingsRoutesDeps,
} from "./admin/email-domain-mappings.js";
import {
	registerServiceAccountsRoutes,
	type ServiceAccountsRoutesDeps,
} from "./admin/service-accounts.js";
import { registerCorsRoutes, type CorsRoutesDeps } from "./admin/cors.js";
import { registerConfigRoutes, type ConfigRoutesDeps } from "./admin/config.js";
import {
	registerConfigAccessRoutes,
	type ConfigAccessRoutesDeps,
} from "./admin/config-access.js";
import {
	registerLoginAttemptsRoutes,
	type LoginAttemptsRoutesDeps,
} from "./admin/login-attempts.js";
import {
	registerEventTypesBffRoutes,
	type EventTypesBffDeps,
} from "./bff/event-types.js";
import { registerRolesBffRoutes, type RolesBffDeps } from "./bff/roles.js";
import {
	registerEventsRoutes as registerEventsBffRoutes,
	type EventsRoutesDeps as EventsBffDeps,
} from "./admin/events.js";
import {
	registerDispatchJobsRoutes as registerDispatchJobsBffRoutes,
	type DispatchJobsRoutesDeps as DispatchJobsBffDeps,
} from "./admin/dispatch-jobs.js";
import {
	registerDebugEventsBffRoutes,
	type DebugEventsBffDeps,
} from "./bff/debug-events.js";
import {
	registerDebugDispatchJobsBffRoutes,
	type DebugDispatchJobsBffDeps,
} from "./bff/debug-dispatch-jobs.js";
import {
	registerApplicationSyncRoutes,
	type ApplicationSyncRoutesDeps,
} from "./applications/sync.js";
import {
	registerEventsBatchRoutes,
	type EventsBatchDeps,
} from "./sdk/events-batch.js";
import {
	registerDispatchJobsBatchRoutes,
	type DispatchJobsBatchDeps,
} from "./sdk/dispatch-jobs-batch.js";
import {
	registerAuditLogsBatchRoutes,
	type AuditLogsBatchDeps,
} from "./sdk/audit-logs-batch.js";
import { registerMeRoutes, type MeRoutesDeps } from "./me.js";
import {
	registerPublicConfigRoutes,
	type PublicConfigRoutesDeps,
} from "./public/config.js";
import {
	registerDispatchProcessRoutes,
	type DispatchProcessDeps,
} from "./dispatch/process.js";

/**
 * Dependencies for admin routes.
 */
export interface AdminRoutesDeps
	extends PrincipalsRoutesDeps,
		ClientsRoutesDeps,
		AnchorDomainsRoutesDeps,
		ApplicationsRoutesDeps,
		RolesRoutesDeps,
		AuthConfigsRoutesDeps,
		OAuthClientsRoutesDeps,
		AuditLogsRoutesDeps,
		EventTypesRoutesDeps,
		DispatchPoolsRoutesDeps,
		ConnectionsRoutesDeps,
		SubscriptionsRoutesDeps,
		EventsRoutesDeps,
		DispatchJobsRoutesDeps,
		IdentityProvidersRoutesDeps,
		EmailDomainMappingsRoutesDeps,
		ServiceAccountsRoutesDeps,
		CorsRoutesDeps,
		ConfigRoutesDeps,
		ConfigAccessRoutesDeps,
		LoginAttemptsRoutesDeps {}

/**
 * Register all API routes. Gated by permissions, not URL tier.
 *
 * Previously split across `/api/admin/*` and `/api/sdk/*`; consolidated into
 * a single `/api/*` surface. See CLAUDE.md for tier convention.
 */
export async function registerAdminRoutes(
	fastify: FastifyInstance,
	deps: AdminRoutesDeps,
): Promise<void> {
	await fastify.register(
		async (apiRouter) => {
			await registerPrincipalsRoutes(apiRouter, deps);
			await registerClientsRoutes(apiRouter, deps);
			await registerAnchorDomainsRoutes(apiRouter, deps);
			await registerApplicationsRoutes(apiRouter, deps);
			await registerRolesRoutes(apiRouter, deps);
			await registerAuthConfigsRoutes(apiRouter, deps);
			await registerOAuthClientsRoutes(apiRouter, deps);
			await registerAuditLogsRoutes(apiRouter, deps);
			await registerEventTypesRoutes(apiRouter, deps);
			await registerDispatchPoolsRoutes(apiRouter, deps);
			await registerConnectionsRoutes(apiRouter, deps);
			await registerSubscriptionsRoutes(apiRouter, deps);
			await registerEventsRoutes(apiRouter, deps);
			await registerDispatchJobsRoutes(apiRouter, deps);
			await registerIdentityProvidersRoutes(apiRouter, deps);
			await registerEmailDomainMappingsRoutes(apiRouter, deps);
			await registerServiceAccountsRoutes(apiRouter, deps);
			await registerCorsRoutes(apiRouter, deps);
			await registerConfigRoutes(apiRouter, deps);
			await registerConfigAccessRoutes(apiRouter, deps);
			await registerLoginAttemptsRoutes(apiRouter, deps);
		},
		{ prefix: "/api" },
	);
}

/**
 * Dependencies for BFF routes.
 */
export interface BffRoutesDeps
	extends EventTypesBffDeps,
		RolesBffDeps,
		EventsBffDeps,
		DispatchJobsBffDeps {}

/**
 * Register all BFF routes (frontend-facing).
 */
export async function registerBffRoutes(
	fastify: FastifyInstance,
	deps: BffRoutesDeps,
): Promise<void> {
	const registerRoutes = async (router: FastifyInstance) => {
		await registerEventTypesBffRoutes(router, deps);
		await registerRolesBffRoutes(router, deps);
		await registerEventsBffRoutes(router, deps);
		await registerDispatchJobsBffRoutes(router, deps);
	};

	await fastify.register(registerRoutes, { prefix: "/bff" });
}

/**
 * Dependencies for debug BFF routes.
 */
export interface DebugBffRoutesDeps
	extends DebugEventsBffDeps,
		DebugDispatchJobsBffDeps {}

/**
 * Register debug BFF routes (admin/debug access).
 */
export async function registerDebugBffRoutes(
	fastify: FastifyInstance,
	deps: DebugBffRoutesDeps,
): Promise<void> {
	const registerRoutes = async (router: FastifyInstance) => {
		await registerDebugEventsBffRoutes(router, deps);
		await registerDebugDispatchJobsBffRoutes(router, deps);
	};

	await fastify.register(registerRoutes, { prefix: "/bff/debug" });
}

/**
 * Register application-scoped sync routes (SDK sync endpoints).
 */
export async function registerApplicationSyncApiRoutes(
	fastify: FastifyInstance,
	deps: ApplicationSyncRoutesDeps,
): Promise<void> {
	await fastify.register(
		async (appRouter) => {
			await registerApplicationSyncRoutes(appRouter, deps);
		},
		{ prefix: "/api/applications" },
	);
}

/**
 * Dependencies for batch ingestion routes.
 */
export interface BatchRoutesDeps
	extends EventsBatchDeps,
		DispatchJobsBatchDeps,
		AuditLogsBatchDeps {}

/**
 * Register batch ingestion routes (outbox processor / SDK batch endpoints).
 */
export async function registerBatchRoutes(
	fastify: FastifyInstance,
	deps: BatchRoutesDeps,
): Promise<void> {
	await fastify.register(
		async (batchRouter) => {
			await registerEventsBatchRoutes(batchRouter, deps);
			await registerDispatchJobsBatchRoutes(batchRouter, deps);
			await registerAuditLogsBatchRoutes(batchRouter, deps);
		},
		{ prefix: "/api" },
	);
}

/**
 * Register user-facing /api/me routes.
 */
export async function registerMeApiRoutes(
	fastify: FastifyInstance,
	deps: MeRoutesDeps,
): Promise<void> {
	await fastify.register(
		async (meRouter) => {
			await registerMeRoutes(meRouter, deps);
		},
		{ prefix: "/api/me" },
	);
}

/**
 * Register public routes (no auth required).
 */
export async function registerPublicApiRoutes(
	fastify: FastifyInstance,
	deps: PublicConfigRoutesDeps,
): Promise<void> {
	await fastify.register(
		async (publicRouter) => {
			await registerPublicConfigRoutes(publicRouter, deps);
		},
		{ prefix: "/api/public" },
	);
}

/**
 * Register platform config routes (no auth required).
 */
export async function registerPlatformConfigApiRoutes(
	fastify: FastifyInstance,
	deps: PublicConfigRoutesDeps,
): Promise<void> {
	await fastify.register(
		async (configRouter) => {
			await registerPublicConfigRoutes(configRouter, deps);
		},
		{ prefix: "/api/config" },
	);
}

/**
 * Register dispatch processing routes (message router callback).
 */
export async function registerDispatchApiRoutes(
	fastify: FastifyInstance,
	deps: DispatchProcessDeps,
): Promise<void> {
	await fastify.register(
		async (dispatchRouter) => {
			await registerDispatchProcessRoutes(dispatchRouter, deps);
		},
		{ prefix: "/api/dispatch" },
	);
}

export { type DispatchProcessDeps } from "./dispatch/process.js";
export { type MeRoutesDeps } from "./me.js";
export { type PublicConfigRoutesDeps } from "./public/config.js";
export { type PrincipalsRoutesDeps } from "./admin/principals.js";
export { type ClientsRoutesDeps } from "./admin/clients.js";
export { type AnchorDomainsRoutesDeps } from "./admin/anchor-domains.js";
export { type ApplicationsRoutesDeps } from "./admin/applications.js";
export { type RolesRoutesDeps } from "./admin/roles.js";
export { type AuthConfigsRoutesDeps } from "./admin/auth-configs.js";
export { type OAuthClientsRoutesDeps } from "./admin/oauth-clients.js";
export { type AuditLogsRoutesDeps } from "./admin/audit-logs.js";
export { type EventTypesRoutesDeps } from "./admin/event-types.js";
export { type DispatchPoolsRoutesDeps } from "./admin/dispatch-pools.js";
export { type ConnectionsRoutesDeps } from "./admin/connections.js";
export { type SubscriptionsRoutesDeps } from "./admin/subscriptions.js";
export { type EventsRoutesDeps } from "./admin/events.js";
export { type DispatchJobsRoutesDeps } from "./admin/dispatch-jobs.js";
export { type IdentityProvidersRoutesDeps } from "./admin/identity-providers.js";
export { type EmailDomainMappingsRoutesDeps } from "./admin/email-domain-mappings.js";
export { type ServiceAccountsRoutesDeps } from "./admin/service-accounts.js";
export { type CorsRoutesDeps } from "./admin/cors.js";
export { type ConfigRoutesDeps } from "./admin/config.js";
export { type ConfigAccessRoutesDeps } from "./admin/config-access.js";
export { type LoginAttemptsRoutesDeps } from "./admin/login-attempts.js";
export { type EventTypesBffDeps } from "./bff/event-types.js";
export { type RolesBffDeps } from "./bff/roles.js";
export { type DebugEventsBffDeps } from "./bff/debug-events.js";
export { type DebugDispatchJobsBffDeps } from "./bff/debug-dispatch-jobs.js";
export { type EventsBatchDeps } from "./sdk/events-batch.js";
export { type DispatchJobsBatchDeps } from "./sdk/dispatch-jobs-batch.js";
export { type AuditLogsBatchDeps } from "./sdk/audit-logs-batch.js";
export { type ApplicationSyncRoutesDeps } from "./applications/sync.js";
