/**
 * OAuth Application Layer
 *
 * Use cases for managing OAuth clients.
 */

// Create OAuth Client
export {
	type CreateOAuthClientCommand,
	createCreateOAuthClientUseCase,
	type CreateOAuthClientUseCaseDeps,
} from "./create-oauth-client.js";

// Update OAuth Client
export {
	type UpdateOAuthClientCommand,
	type RegenerateOAuthClientSecretCommand,
	createUpdateOAuthClientUseCase,
	createRegenerateOAuthClientSecretUseCase,
	type UpdateOAuthClientUseCaseDeps,
} from "./update-oauth-client.js";

// Delete OAuth Client
export {
	type DeleteOAuthClientCommand,
	createDeleteOAuthClientUseCase,
	type DeleteOAuthClientUseCaseDeps,
} from "./delete-oauth-client.js";

// Activate OAuth Client
export {
	type ActivateOAuthClientCommand,
	createActivateOAuthClientUseCase,
	type ActivateOAuthClientUseCaseDeps,
} from "./activate-oauth-client.js";

// Deactivate OAuth Client
export {
	type DeactivateOAuthClientCommand,
	createDeactivateOAuthClientUseCase,
	type DeactivateOAuthClientUseCaseDeps,
} from "./deactivate-oauth-client.js";
