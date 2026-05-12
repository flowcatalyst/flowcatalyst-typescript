/**
 * Scheduled-Job use cases — wires repos + UoW to use case factories.
 */

import type { CreateUseCasesDeps } from "./index.js";
import {
	createCreateScheduledJobUseCase,
	createUpdateScheduledJobUseCase,
	createPauseScheduledJobUseCase,
	createResumeScheduledJobUseCase,
	createArchiveScheduledJobUseCase,
	createDeleteScheduledJobUseCase,
	createFireScheduledJobUseCase,
	createSyncScheduledJobsUseCase,
} from "../../application/index.js";

export function createScheduledJobUseCases(deps: CreateUseCasesDeps) {
	const { repos, unitOfWork } = deps;

	if (!repos.scheduledJobInstanceRepository) {
		throw new Error(
			"scheduledJobInstanceRepository is required for scheduled-job use cases; " +
				"ensure createRepositories() is called with the postgres.js client.",
		);
	}

	return {
		createScheduledJobUseCase: createCreateScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
		updateScheduledJobUseCase: createUpdateScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
		pauseScheduledJobUseCase: createPauseScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
		resumeScheduledJobUseCase: createResumeScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
		archiveScheduledJobUseCase: createArchiveScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
		deleteScheduledJobUseCase: createDeleteScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
		fireScheduledJobUseCase: createFireScheduledJobUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			scheduledJobInstanceRepository: repos.scheduledJobInstanceRepository,
			unitOfWork,
		}),
		syncScheduledJobsUseCase: createSyncScheduledJobsUseCase({
			scheduledJobRepository: repos.scheduledJobRepository,
			unitOfWork,
		}),
	};
}
