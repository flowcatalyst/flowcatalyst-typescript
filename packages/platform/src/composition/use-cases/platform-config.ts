/**
 * Platform Config use cases (set / delete on the configs themselves).
 *
 * Distinct from `./config-access.ts` which composes the access-grant
 * use cases — those govern WHO can read/write configs, while these
 * govern the configs themselves.
 */

import type { CreateUseCasesDeps } from "./index.js";
import {
	createSetPlatformConfigUseCase,
	createDeletePlatformConfigUseCase,
} from "../../application/index.js";

export function createPlatformConfigUseCases(deps: CreateUseCasesDeps) {
	const { repos, unitOfWork } = deps;

	const setPlatformConfigUseCase = createSetPlatformConfigUseCase({
		platformConfigRepository: repos.platformConfigRepository,
		unitOfWork,
	});

	const deletePlatformConfigUseCase = createDeletePlatformConfigUseCase({
		platformConfigRepository: repos.platformConfigRepository,
		unitOfWork,
	});

	return {
		setPlatformConfigUseCase,
		deletePlatformConfigUseCase,
	};
}
