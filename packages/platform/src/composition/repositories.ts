/**
 * Repository creation — instantiates all platform repositories.
 */

import {
	createPrincipalRepository,
	createAnchorDomainRepository,
	createClientRepository,
	createApplicationRepository,
	createApplicationClientConfigRepository,
	createRoleRepository,
	createPermissionRepository,
	createClientAccessGrantRepository,
	createClientAuthConfigRepository,
	createOAuthClientRepository,
	createAuditLogRepository,
	createEventTypeRepository,
	createDispatchPoolRepository,
	createConnectionRepository,
	createSubscriptionRepository,
	createServiceAccountRepository,
	createEventReadRepository,
	createDispatchJobReadRepository,
	createIdentityProviderRepository,
	createEmailDomainMappingRepository,
	createIdpRoleMappingRepository,
	createOidcLoginStateRepository,
	createCorsAllowedOriginRepository,
	createPlatformConfigRepository,
	createPlatformConfigAccessRepository,
	createLoginAttemptRepository,
	createPasswordResetTokenRepository,
	createWebauthnCredentialRepository,
	createWebauthnCeremonyRepository,
	createScheduledJobRepository,
	createScheduledJobInstanceRepository,
} from "../infrastructure/persistence/index.js";
import type postgres from "postgres";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRepositories(db: any, schemaDb: any, rawSql?: postgres.Sql) {
	return {
		principalRepository: createPrincipalRepository(db),
		anchorDomainRepository: createAnchorDomainRepository(db),
		clientRepository: createClientRepository(db),
		applicationRepository: createApplicationRepository(db),
		applicationClientConfigRepository:
			createApplicationClientConfigRepository(db),
		roleRepository: createRoleRepository(db),
		permissionRepository: createPermissionRepository(db),
		clientAccessGrantRepository: createClientAccessGrantRepository(db),
		clientAuthConfigRepository: createClientAuthConfigRepository(db),
		oauthClientRepository: createOAuthClientRepository(schemaDb),
		auditLogRepository: createAuditLogRepository(db),
		eventTypeRepository: createEventTypeRepository(schemaDb),
		dispatchPoolRepository: createDispatchPoolRepository(db),
		connectionRepository: createConnectionRepository(db),
		serviceAccountRepository: createServiceAccountRepository(db),
		subscriptionRepository: createSubscriptionRepository(schemaDb),
		eventReadRepository: createEventReadRepository(db),
		dispatchJobReadRepository: createDispatchJobReadRepository(db),
		identityProviderRepository: createIdentityProviderRepository(schemaDb),
		emailDomainMappingRepository: createEmailDomainMappingRepository(schemaDb),
		idpRoleMappingRepository: createIdpRoleMappingRepository(db),
		oidcLoginStateRepository: createOidcLoginStateRepository(db),
		corsAllowedOriginRepository: createCorsAllowedOriginRepository(db),
		platformConfigRepository: createPlatformConfigRepository(db),
		platformConfigAccessRepository: createPlatformConfigAccessRepository(db),
		loginAttemptRepository: createLoginAttemptRepository(db),
		passwordResetTokenRepository: createPasswordResetTokenRepository(db),
		webauthnCredentialRepository: createWebauthnCredentialRepository(db),
		webauthnCeremonyRepository: createWebauthnCeremonyRepository(db),
		scheduledJobRepository: createScheduledJobRepository(schemaDb),
		// Instance repo uses the raw postgres.js client because the
		// instance/log tables are written via raw SQL (infrastructure path).
		// Required: caller must pass the postgres.js client.
		scheduledJobInstanceRepository: rawSql
			? createScheduledJobInstanceRepository(rawSql)
			: undefined,
	};
}

export type Repositories = ReturnType<typeof createRepositories>;
