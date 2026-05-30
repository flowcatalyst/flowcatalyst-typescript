import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import {
	updateScheduledJob,
	ScheduledJobUpdated,
} from "../../../domain/index.js";
import { validateCrons, CronEvaluationError } from "../../../scheduled-job-scheduler/index.js";

import type { UpdateScheduledJobCommand } from "./command.js";

export interface UpdateScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdateScheduledJobUseCase(
	deps: UpdateScheduledJobUseCaseDeps,
): UseCase<UpdateScheduledJobCommand, ScheduledJobUpdated> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: UpdateScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobUpdated>> {
			// delivery_max_attempts must be 1-20 when supplied. Validated
			// before the lookup, matching Rust scheduled_job/operations/
			// update.rs:80-87.
			if (
				command.deliveryMaxAttempts !== undefined &&
				(command.deliveryMaxAttempts < 1 || command.deliveryMaxAttempts > 20)
			) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_DELIVERY_ATTEMPTS",
						"deliveryMaxAttempts must be between 1 and 20",
					),
				);
			}

			const job = await scheduledJobRepository.findById(command.scheduledJobId);
			if (!job) {
				return Result.failure(
					UseCaseError.notFound(
						"SCHEDULED_JOB_NOT_FOUND",
						"Scheduled job not found",
						{ scheduledJobId: command.scheduledJobId },
					),
				);
			}

			if (job.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"ARCHIVED",
						"Cannot update an archived scheduled job",
					),
				);
			}

			if (command.crons !== undefined) {
				if (command.crons.length === 0) {
					return Result.failure(
						UseCaseError.validation(
							"CRONS_REQUIRED",
							"At least one cron expression is required",
						),
					);
				}
				const tz = command.timezone ?? job.timezone;
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
			}

			// No-op guard: if nothing the command provides differs from the
			// current job, reject with NO_CHANGES rather than bumping the
			// version. Mirrors Rust update.rs:120-187 (per-field diff).
			const changed: string[] = [];
			if (command.name !== undefined && command.name !== job.name)
				changed.push("name");
			if (
				command.description !== undefined &&
				command.description !== job.description
			)
				changed.push("description");
			if (command.crons !== undefined && !arrayEquals(command.crons, job.crons))
				changed.push("crons");
			if (command.timezone !== undefined && command.timezone !== job.timezone)
				changed.push("timezone");
			if (
				command.payload !== undefined &&
				!payloadEquals(command.payload, job.payload)
			)
				changed.push("payload");
			if (
				command.concurrent !== undefined &&
				command.concurrent !== job.concurrent
			)
				changed.push("concurrent");
			if (
				command.tracksCompletion !== undefined &&
				command.tracksCompletion !== job.tracksCompletion
			)
				changed.push("tracksCompletion");
			if (
				command.timeoutSeconds !== undefined &&
				command.timeoutSeconds !== job.timeoutSeconds
			)
				changed.push("timeoutSeconds");
			if (
				command.deliveryMaxAttempts !== undefined &&
				command.deliveryMaxAttempts !== job.deliveryMaxAttempts
			)
				changed.push("deliveryMaxAttempts");
			if (command.targetUrl !== undefined && command.targetUrl !== job.targetUrl)
				changed.push("targetUrl");

			if (changed.length === 0) {
				return Result.failure(
					UseCaseError.businessRule(
						"NO_CHANGES",
						"Update command did not change any fields",
					),
				);
			}

			const updated = updateScheduledJob(job, {
				name: command.name,
				description: command.description,
				crons: command.crons,
				timezone: command.timezone,
				payload: command.payload,
				concurrent: command.concurrent,
				tracksCompletion: command.tracksCompletion,
				timeoutSeconds: command.timeoutSeconds,
				deliveryMaxAttempts: command.deliveryMaxAttempts,
				targetUrl: command.targetUrl,
				updatedBy: context.principalId ?? null,
			});

			const event = new ScheduledJobUpdated(context, {
				scheduledJobId: updated.id,
				code: updated.code,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}

function arrayEquals(a: readonly string[], b: readonly string[]): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function payloadEquals(a: unknown, b: unknown): boolean {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}
