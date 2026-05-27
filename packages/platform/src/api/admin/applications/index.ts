/**
 * Applications Admin API — orchestrator.
 *
 * Splits the routes across four files by concern:
 *
 *   - crud.ts          create / list / get / get-by-code / update / delete + roles
 *   - activation.ts    activate / deactivate
 *   - client-config.ts list / enable / disable for client
 *   - provisioning.ts  provision-service-account + provision-login-client
 *
 * External callers still import `registerApplicationsRoutes` and
 * `ApplicationsRoutesDeps` from this directory — same names, same
 * signatures, same registered routes in the same order.
 */

import type { FastifyInstance } from "fastify";
import type { UseCase } from "@flowcatalyst/application";
import type { EncryptionService } from "@flowcatalyst/platform-crypto";

import type {
	ActivateApplicationCommand,
	AttachServiceAccountToApplicationCommand,
	CreateApplicationCommand,
	CreateOAuthClientCommand,
	CreateServiceAccountCommand,
	DeactivateApplicationCommand,
	DeleteApplicationCommand,
	DisableApplicationForClientCommand,
	EnableApplicationForClientCommand,
	UpdateApplicationCommand,
} from "../../../application/index.js";
import type {
	ApplicationActivated,
	ApplicationCreated,
	ApplicationDeactivated,
	ApplicationDeleted,
	ApplicationDisabledForClient,
	ApplicationEnabledForClient,
	ApplicationServiceAccountProvisioned,
	ApplicationUpdated,
	OAuthClientCreated,
	ServiceAccountCreated,
} from "../../../domain/index.js";
import type {
	ApplicationClientConfigRepository,
	ApplicationRepository,
	OAuthClientRepository,
	PrincipalRepository,
	RoleRepository,
} from "../../../infrastructure/persistence/index.js";

import { registerActivationRoutes } from "./activation.js";
import { registerClientConfigRoutes } from "./client-config.js";
import { registerCrudRoutes } from "./crud.js";
import { makeAppHasLoginClient, registerProvisioningRoutes } from "./provisioning.js";

/**
 * Dependencies for the applications API. One bag of all repositories +
 * use cases the route groups need — each group destructures the subset
 * it uses.
 */
export interface ApplicationsRoutesDeps {
	readonly applicationRepository: ApplicationRepository;
	readonly applicationClientConfigRepository: ApplicationClientConfigRepository;
	readonly roleRepository: RoleRepository;
	readonly principalRepository: PrincipalRepository;
	readonly oauthClientRepository: OAuthClientRepository;
	readonly encryptionService: EncryptionService;
	readonly createApplicationUseCase: UseCase<
		CreateApplicationCommand,
		ApplicationCreated
	>;
	readonly updateApplicationUseCase: UseCase<
		UpdateApplicationCommand,
		ApplicationUpdated
	>;
	readonly deleteApplicationUseCase: UseCase<
		DeleteApplicationCommand,
		ApplicationDeleted
	>;
	readonly activateApplicationUseCase: UseCase<
		ActivateApplicationCommand,
		ApplicationActivated
	>;
	readonly deactivateApplicationUseCase: UseCase<
		DeactivateApplicationCommand,
		ApplicationDeactivated
	>;
	readonly enableApplicationForClientUseCase: UseCase<
		EnableApplicationForClientCommand,
		ApplicationEnabledForClient
	>;
	readonly disableApplicationForClientUseCase: UseCase<
		DisableApplicationForClientCommand,
		ApplicationDisabledForClient
	>;
	readonly createServiceAccountUseCase: UseCase<
		CreateServiceAccountCommand,
		ServiceAccountCreated
	>;
	readonly attachServiceAccountToApplicationUseCase: UseCase<
		AttachServiceAccountToApplicationCommand,
		ApplicationServiceAccountProvisioned
	>;
	readonly createOAuthClientUseCase: UseCase<
		CreateOAuthClientCommand,
		OAuthClientCreated
	>;
}

/**
 * Register every applications admin route on `fastify`. Route
 * registration order is preserved from the pre-split file (CRUD →
 * activation → client-config → roles is part of CRUD → provisioning).
 */
export async function registerApplicationsRoutes(
	fastify: FastifyInstance,
	deps: ApplicationsRoutesDeps,
): Promise<void> {
	const appHasLoginClient = makeAppHasLoginClient(deps);

	// Order matches the pre-split file's registration order so any
	// route-priority assumptions in the underlying Fastify router
	// stay identical.
	await registerCrudRoutes(fastify, deps, { appHasLoginClient });
	await registerActivationRoutes(fastify, deps);
	await registerClientConfigRoutes(fastify, deps);
	await registerProvisioningRoutes(fastify, deps, appHasLoginClient);
}
