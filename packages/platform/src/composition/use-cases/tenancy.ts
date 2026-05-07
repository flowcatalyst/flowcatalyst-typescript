/**
 * Tenancy use cases — clients, anchor domains.
 */

import type { CreateUseCasesDeps } from "./index.js";
import {
	createGuardedUseCase,
	clientAccessGuard,
} from "../../authorization/index.js";
import {
	createCreateClientUseCase,
	createUpdateClientUseCase,
	createChangeClientStatusUseCase,
	createDeleteClientUseCase,
	createAddClientNoteUseCase,
	createUpdateClientApplicationsUseCase,
	createCreateAnchorDomainUseCase,
	createUpdateAnchorDomainUseCase,
	createDeleteAnchorDomainUseCase,
} from "../../application/index.js";

export function createTenancyUseCases(deps: CreateUseCasesDeps) {
	const { repos, unitOfWork } = deps;

	// --- Client use cases (with resource-level guards) ---
	const createClientUseCase = createCreateClientUseCase({
		clientRepository: repos.clientRepository,
		unitOfWork,
	});

	const updateClientUseCase = createGuardedUseCase(
		createUpdateClientUseCase({
			clientRepository: repos.clientRepository,
			unitOfWork,
		}),
		clientAccessGuard((cmd) => cmd.clientId),
	);

	const changeClientStatusUseCase = createGuardedUseCase(
		createChangeClientStatusUseCase({
			clientRepository: repos.clientRepository,
			unitOfWork,
		}),
		clientAccessGuard((cmd) => cmd.clientId),
	);

	const deleteClientUseCase = createGuardedUseCase(
		createDeleteClientUseCase({
			clientRepository: repos.clientRepository,
			unitOfWork,
		}),
		clientAccessGuard((cmd) => cmd.clientId),
	);

	const addClientNoteUseCase = createGuardedUseCase(
		createAddClientNoteUseCase({
			clientRepository: repos.clientRepository,
			unitOfWork,
		}),
		clientAccessGuard((cmd) => cmd.clientId),
	);

	const updateClientApplicationsUseCase = createGuardedUseCase(
		createUpdateClientApplicationsUseCase({
			applicationRepository: repos.applicationRepository,
			clientRepository: repos.clientRepository,
			applicationClientConfigRepository:
				repos.applicationClientConfigRepository,
			unitOfWork,
		}),
		clientAccessGuard((cmd) => cmd.clientId),
	);

	// --- Anchor domain use cases ---
	const createAnchorDomainUseCase = createCreateAnchorDomainUseCase({
		anchorDomainRepository: repos.anchorDomainRepository,
		unitOfWork,
	});

	const updateAnchorDomainUseCase = createUpdateAnchorDomainUseCase({
		anchorDomainRepository: repos.anchorDomainRepository,
		unitOfWork,
	});

	const deleteAnchorDomainUseCase = createDeleteAnchorDomainUseCase({
		anchorDomainRepository: repos.anchorDomainRepository,
		unitOfWork,
	});

	return {
		createClientUseCase,
		updateClientUseCase,
		changeClientStatusUseCase,
		deleteClientUseCase,
		addClientNoteUseCase,
		updateClientApplicationsUseCase,
		createAnchorDomainUseCase,
		updateAnchorDomainUseCase,
		deleteAnchorDomainUseCase,
	};
}
