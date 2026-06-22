/**
 * Create Subscription
 *
 * Command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	UseCaseError,
} from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type {
	SubscriptionRepository,
	DispatchPoolRepository,
	ConnectionRepository,
} from "../../infrastructure/persistence/index.js";
import {
	createSubscription,
	SubscriptionCreated,
	type SubscriptionSource,
	type EventTypeBinding,
	type ConfigEntry,
	type DispatchMode,
} from "../../domain/index.js";

export interface CreateSubscriptionCommand extends Command {
	readonly code: string;
	readonly applicationCode?: string | null | undefined;
	readonly name: string;
	readonly description?: string | null | undefined;
	readonly clientId?: string | null | undefined;
	readonly clientScoped?: boolean | undefined;
	readonly endpoint: string;
	readonly eventTypes: EventTypeBinding[];
	readonly connectionId?: string | null | undefined;
	readonly queue?: string | null | undefined;
	readonly customConfig?: ConfigEntry[] | undefined;
	readonly source?: string | undefined;
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

export interface CreateSubscriptionUseCaseDeps {
	readonly subscriptionRepository: SubscriptionRepository;
	readonly dispatchPoolRepository: DispatchPoolRepository;
	readonly connectionRepository: ConnectionRepository;
	readonly unitOfWork: UnitOfWork;
}

// Must start with a lowercase letter, end with a letter or digit, and
// only contain lowercase letters / digits / hyphens in between. Min 2
// chars. Matches Rust crates/fc-platform/src/subscription/operations/create.rs:114-119.
// (Earlier looser TS regex allowed trailing hyphens like "my-sub-".)
const CODE_PATTERN = /^[a-z][a-z0-9-]*[a-z0-9]$/;

export function createCreateSubscriptionUseCase(
	deps: CreateSubscriptionUseCaseDeps,
): UseCase<CreateSubscriptionCommand, SubscriptionCreated> {
	const { subscriptionRepository, dispatchPoolRepository, connectionRepository, unitOfWork } = deps;

	return {
		async execute(
			command: CreateSubscriptionCommand,
			context: ExecutionContext,
		): Promise<Result<SubscriptionCreated>> {
			// Validate required fields
			const codeResult = validateRequired(
				command.code,
				"code",
				"CODE_REQUIRED",
			);
			if (Result.isFailure(codeResult)) return codeResult;

			const nameResult = validateRequired(
				command.name,
				"name",
				"NAME_REQUIRED",
			);
			if (Result.isFailure(nameResult)) return nameResult;

			const endpointResult = validateRequired(
				command.endpoint,
				"endpoint",
				"ENDPOINT_REQUIRED",
			);
			if (Result.isFailure(endpointResult)) return endpointResult;

			// Validate code format
			if (!CODE_PATTERN.test(command.code)) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_CODE_FORMAT",
						"Code must start with a lowercase letter, end with a letter or digit, and contain only lowercase letters, numbers, and hyphens (min 2 chars)",
					),
				);
			}

			// Must have at least one event type
			if (!command.eventTypes || command.eventTypes.length === 0) {
				return Result.failure(
					UseCaseError.validation(
						"EVENT_TYPES_REQUIRED",
						"At least one event type binding is required",
					),
				);
			}

			// Validate client scoping
			const clientScoped = command.clientScoped ?? false;
			if (!clientScoped && command.clientId) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_CLIENT_SCOPE",
						"Cannot specify clientId when subscription is not client-scoped",
					),
				);
			}

			// Validate dispatch pool exists if provided
			if (command.dispatchPoolId) {
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

			// Validate connection exists if provided
			const connectionId = command.connectionId ?? null;
			if (connectionId) {
				const connectionExists = await connectionRepository.exists(
					connectionId,
				);
				if (!connectionExists) {
					return Result.failure(
						UseCaseError.notFound(
							"CONNECTION_NOT_FOUND",
							"Connection not found",
							{ connectionId },
						),
					);
				}
			}

			// Check code uniqueness within client scope
			const clientId = command.clientId ?? null;
			const codeExists = await subscriptionRepository.existsByCodeAndClient(
				command.code,
				clientId,
			);
			if (codeExists) {
				return Result.failure(
					UseCaseError.businessRule(
						"CODE_EXISTS",
						"Subscription code already exists in this scope",
						{
							code: command.code,
						},
					),
				);
			}

			const subscription = createSubscription({
				code: command.code,
				applicationCode: command.applicationCode ?? null,
				name: command.name,
				description: command.description ?? null,
				clientId,
				clientScoped,
				endpoint: command.endpoint,
				eventTypes: command.eventTypes,
				connectionId,
				queue: command.queue ?? null,
				customConfig: command.customConfig ?? [],
				source: (command.source as SubscriptionSource) ?? "UI",
				...(command.maxAgeSeconds !== undefined
					? { maxAgeSeconds: command.maxAgeSeconds }
					: {}),
				dispatchPoolId: command.dispatchPoolId ?? null,
				dispatchPoolCode: command.dispatchPoolCode ?? null,
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

			const event = new SubscriptionCreated(context, {
				subscriptionId: subscription.id,
				code: subscription.code,
				applicationCode: subscription.applicationCode,
				name: subscription.name,
				clientId: subscription.clientId,
				clientScoped: subscription.clientScoped,
				endpoint: subscription.endpoint,
				eventTypes: subscription.eventTypes,
				connectionId: subscription.connectionId,
			});

			return unitOfWork.commit(subscription, event, command);
		},
	};
}
