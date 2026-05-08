/**
 * Platform Config Access use cases.
 */

import type { CreateUseCasesDeps } from "./index.js";
import {
	createGrantPlatformConfigAccessUseCase,
	createUpdatePlatformConfigAccessUseCase,
	createRevokePlatformConfigAccessUseCase,
} from "../../application/index.js";

export function createConfigAccessUseCases(deps: CreateUseCasesDeps) {
	const { repos, unitOfWork } = deps;

	const grantPlatformConfigAccessUseCase = createGrantPlatformConfigAccessUseCase({
		platformConfigAccessRepository: repos.platformConfigAccessRepository,
		unitOfWork,
	});

	const updatePlatformConfigAccessUseCase = createUpdatePlatformConfigAccessUseCase({
		platformConfigAccessRepository: repos.platformConfigAccessRepository,
		unitOfWork,
	});

	const revokePlatformConfigAccessUseCase = createRevokePlatformConfigAccessUseCase({
		platformConfigAccessRepository: repos.platformConfigAccessRepository,
		unitOfWork,
	});

	return {
		grantPlatformConfigAccessUseCase,
		updatePlatformConfigAccessUseCase,
		revokePlatformConfigAccessUseCase,
	};
}
