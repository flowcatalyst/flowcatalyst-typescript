/**
 * Update Subscription
 *
 * Command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type {
	SubscriptionRepository,
	DispatchPoolRepository,
	ConnectionRepository,
} from "../../infrastructure/persistence/index.js";
import {
	updateSubscription,
	SubscriptionUpdated,
	type EventTypeBinding,
	type ConfigEntry,
	type DispatchMode,
	type SubscriptionStatus,
} from "../../domain/index.js";

export interface UpdateSubscriptionCommand extends Command {
	readonly subscriptionId: string;
	readonly name?: string | undefined;
	readonly description?: string | null | undefined;
	readonly endpoint?: string | undefined;
	readonly eventTypes?: EventTypeBinding[] | undefined;
	readonly connectionId?: string | null | undefined;
	readonly queue?: string | null | undefined;
	readonly customConfig?: ConfigEntry[] | undefined;
	readonly status?: SubscriptionStatus | undefined;
	readonly maxAgeSeconds?: number | undefined;
	readonly dispatchPoolId?: string | null | undefined;
	readonly dispatchPoolCode?: string | null | undefined;
	readonly delaySeconds?: number | undefined;
	readonly sequence?: number | undefined;
	readonly mode?: DispatchMode | undefined;
	readonly timeoutSeconds?: number | undefined;
	readonly maxRetries?: number | undefined;
	readonly dataOnly?: boolean | undefined;
}

export interface UpdateSubscriptionUseCaseDeps {
	readonly subscriptionRepository: SubscriptionRepository;
	readonly dispatchPoolRepository: DispatchPoolRepository;
	readonly connectionRepository: ConnectionRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdateSubscriptionUseCase(
	deps: UpdateSubscriptionUseCaseDeps,
): UseCase<UpdateSubscriptionCommand, SubscriptionUpdated> {
	const { subscriptionRepository, dispatchPoolRepository, connectionRepository, unitOfWork } = deps;

	return {
		async execute(
			command: UpdateSubscriptionCommand,
			context: ExecutionContext,
		): Promise<Result<SubscriptionUpdated>> {
			const subscription = await subscriptionRepository.findById(
				command.subscriptionId,
			);
			if (!subscription) {
				return Result.failure(
					UseCaseError.notFound(
						"SUBSCRIPTION_NOT_FOUND",
						"Subscription not found",
						{
							subscriptionId: command.subscriptionId,
						},
					),
				);
			}

			// Validate event types if provided
			if (command.eventTypes !== undefined && command.eventTypes.length === 0) {
				return Result.failure(
					UseCaseError.validation(
						"EVENT_TYPES_REQUIRED",
						"At least one event type binding is required",
					),
				);
			}

			// Validate dispatch pool if changing
			if (
				command.dispatchPoolId !== undefined &&
				command.dispatchPoolId !== null
			) {
				const poolExists = await dispatchPoolRepository.exists(
					command.dispatchPoolId,
				);
				if (!poolExists) {
					return Result.failure(
						UseCaseError.notFound(
							"DISPATCH_POOL_NOT_FOUND",
							"Dispatch pool not found",
							{
								dispatchPoolId: command.dispatchPoolId,
							},
						),
					);
				}
			}

			// Validate connection if changing (and not being set to null)
			if (command.connectionId !== undefined && command.connectionId !== null) {
				const connectionExists = await connectionRepository.exists(
					command.connectionId,
				);
				if (!connectionExists) {
					return Result.failure(
						UseCaseError.notFound(
							"CONNECTION_NOT_FOUND",
							"Connection not found",
							{ connectionId: command.connectionId },
						),
					);
				}
			}

			const updated = updateSubscription(subscription, {
				...(command.name !== undefined ? { name: command.name } : {}),
				...(command.description !== undefined
					? { description: command.description }
					: {}),
				...(command.endpoint !== undefined
					? { endpoint: command.endpoint }
					: {}),
				...(command.eventTypes !== undefined
					? { eventTypes: command.eventTypes }
					: {}),
				...(command.connectionId !== undefined
					? { connectionId: command.connectionId }
					: {}),
				...(command.queue !== undefined ? { queue: command.queue } : {}),
				...(command.customConfig !== undefined
					? { customConfig: command.customConfig }
					: {}),
				...(command.status !== undefined ? { status: command.status } : {}),
				...(command.maxAgeSeconds !== undefined
					? { maxAgeSeconds: command.maxAgeSeconds }
					: {}),
				...(command.dispatchPoolId !== undefined
					? { dispatchPoolId: command.dispatchPoolId }
					: {}),
				...(command.dispatchPoolCode !== undefined
					? { dispatchPoolCode: command.dispatchPoolCode }
					: {}),
				...(command.delaySeconds !== undefined
					? { delaySeconds: command.delaySeconds }
					: {}),
				...(command.sequence !== undefined
					? { sequence: command.sequence }
					: {}),
				...(command.mode !== undefined ? { mode: command.mode } : {}),
				...(command.timeoutSeconds !== undefined
					? { timeoutSeconds: command.timeoutSeconds }
					: {}),
				...(command.maxRetries !== undefined
					? { maxRetries: command.maxRetries }
					: {}),
				...(command.dataOnly !== undefined
					? { dataOnly: command.dataOnly }
					: {}),
			});

			const event = new SubscriptionUpdated(context, {
				subscriptionId: updated.id,
				code: updated.code,
				applicationCode: updated.applicationCode,
				name: updated.name,
				clientId: updated.clientId,
				endpoint: updated.endpoint,
				eventTypes: updated.eventTypes,
				connectionId: updated.connectionId,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
