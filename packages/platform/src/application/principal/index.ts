/**
 * Principal Application Layer
 *
 * Use cases for managing principals (users).
 */

// Create User
export {
	type CreateUserCommand,
	createCreateUserUseCase,
	type CreateUserUseCaseDeps,
} from "./create-user.js";

// Update User
export {
	type UpdateUserCommand,
	createUpdateUserUseCase,
	type UpdateUserUseCaseDeps,
} from "./update-user.js";

// Activate User
export {
	type ActivateUserCommand,
	createActivateUserUseCase,
	type ActivateUserUseCaseDeps,
} from "./activate-user.js";

// Deactivate User
export {
	type DeactivateUserCommand,
	createDeactivateUserUseCase,
	type DeactivateUserUseCaseDeps,
} from "./deactivate-user.js";

// Delete User
export {
	type DeleteUserCommand,
	createDeleteUserUseCase,
	type DeleteUserUseCaseDeps,
} from "./delete-user.js";

// Assign Roles
export {
	type AssignRolesCommand,
	createAssignRolesUseCase,
	type AssignRolesUseCaseDeps,
} from "./assign-roles.js";

// Grant Client Access
export {
	type GrantClientAccessCommand,
	createGrantClientAccessUseCase,
	type GrantClientAccessUseCaseDeps,
} from "./grant-client-access.js";

// Revoke Client Access
export {
	type RevokeClientAccessCommand,
	createRevokeClientAccessUseCase,
	type RevokeClientAccessUseCaseDeps,
} from "./revoke-client-access.js";

// Assign Application Access
export {
	type AssignApplicationAccessCommand,
	createAssignApplicationAccessUseCase,
	type AssignApplicationAccessUseCaseDeps,
} from "./assign-application-access.js";

// Sync Principals
export {
	type SyncPrincipalsCommand,
	type SyncPrincipalItem,
	createSyncPrincipalsUseCase,
	type SyncPrincipalsUseCaseDeps,
} from "./sync-principals.js";

// Reset User Password
export {
	type ResetUserPasswordCommand,
	createResetUserPasswordUseCase,
	type ResetUserPasswordUseCaseDeps,
} from "./reset-user-password.js";
