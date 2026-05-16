/**
 * Process use cases.
 */

import type { CreateUseCasesDeps } from "./index.js";
import {
	createCreateProcessUseCase,
	createUpdateProcessUseCase,
	createArchiveProcessUseCase,
	createDeleteProcessUseCase,
	createSyncProcessesUseCase,
} from "../../application/index.js";

export function createProcessUseCases(deps: CreateUseCasesDeps) {
	const { repos, unitOfWork } = deps;

	const createProcessUseCase = createCreateProcessUseCase({
		processRepository: repos.processRepository,
		unitOfWork,
	});

	const updateProcessUseCase = createUpdateProcessUseCase({
		processRepository: repos.processRepository,
		unitOfWork,
	});

	const archiveProcessUseCase = createArchiveProcessUseCase({
		processRepository: repos.processRepository,
		unitOfWork,
	});

	const deleteProcessUseCase = createDeleteProcessUseCase({
		processRepository: repos.processRepository,
		unitOfWork,
	});

	const syncProcessesUseCase = createSyncProcessesUseCase({
		processRepository: repos.processRepository,
		unitOfWork,
	});

	return {
		createProcessUseCase,
		updateProcessUseCase,
		archiveProcessUseCase,
		deleteProcessUseCase,
		syncProcessesUseCase,
	};
}
