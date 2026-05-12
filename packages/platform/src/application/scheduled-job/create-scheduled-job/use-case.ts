/**
 * Create ScheduledJob Use Case
 */

import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError, validateRequired } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import {
	createScheduledJob,
	ScheduledJobCreated,
} from "../../../domain/index.js";
import { validateCrons, CronEvaluationError } from "../../../scheduled-job-scheduler/index.js";

import type { CreateScheduledJobCommand } from "./command.js";

export interface CreateScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createCreateScheduledJobUseCase(
	deps: CreateScheduledJobUseCaseDeps,
): UseCase<CreateScheduledJobCommand, ScheduledJobCreated> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: CreateScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobCreated>> {
			const codeReq = validateRequired(command.code, "code", "CODE_REQUIRED");
			if (Result.isFailure(codeReq)) return codeReq;

			const nameReq = validateRequired(command.name, "name", "NAME_REQUIRED");
			if (Result.isFailure(nameReq)) return nameReq;

			if (!command.crons || command.crons.length === 0) {
				return Result.failure(
					UseCaseError.validation(
						"CRONS_REQUIRED",
						"At least one cron expression is required",
					),
				);
			}

			const tz = command.timezone ?? "UTC";
			try {
				validateCrons(command.crons, tz);
			} catch (err) {
				if (err instanceof CronEvaluationError) {
					return Result.failure(
						UseCaseError.validation("INVALID_CRON_OR_TIMEZONE", err.message),
					);
				}
				throw err;
			}

			const clientId = command.clientId ?? null;
			const existing = await scheduledJobRepository.findByCode(
				clientId,
				command.code,
			);
			if (existing) {
				return Result.failure(
					UseCaseError.businessRule(
						"CODE_EXISTS",
						"Scheduled job with this code already exists for this client scope",
						{ code: command.code, clientId },
					),
				);
			}

			const job = createScheduledJob({
				clientId,
				code: command.code,
				name: command.name,
				description: command.description ?? null,
				crons: command.crons,
				timezone: tz,
				payload: command.payload ?? null,
				concurrent: command.concurrent ?? false,
				tracksCompletion: command.tracksCompletion ?? false,
				timeoutSeconds: command.timeoutSeconds ?? null,
				deliveryMaxAttempts: command.deliveryMaxAttempts ?? 3,
				targetUrl: command.targetUrl ?? null,
				createdBy: context.principalId ?? null,
			});

			const event = new ScheduledJobCreated(context, {
				scheduledJobId: job.id,
				clientId: job.clientId,
				code: job.code,
				name: job.name,
			});

			return unitOfWork.commit(job, event, command);
		},
	};
}
