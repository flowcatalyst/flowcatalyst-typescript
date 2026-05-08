/**
 * Config Access Admin API
 *
 * REST endpoints for managing which roles can read/write platform configuration.
 */

import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type, type Static } from "@sinclair/typebox";
import {
	jsonCreated,
	jsonSuccess,
	noContent,
	notFound,
	jsonError,
	ErrorResponseSchema,
} from "@flowcatalyst/http";

import { Result } from "@flowcatalyst/application";
import type { UseCase } from "@flowcatalyst/application";

import type { PlatformConfigAccessRepository } from "../../infrastructure/persistence/index.js";
import { type PlatformConfigAccess } from "../../domain/index.js";
import type {
	GrantPlatformConfigAccessCommand,
	UpdatePlatformConfigAccessCommand,
	RevokePlatformConfigAccessCommand,
} from "../../application/index.js";
import type {
	PlatformConfigAccessGranted,
	PlatformConfigAccessUpdated,
	PlatformConfigAccessRevoked,
} from "../../domain/index.js";
import { sendResult } from "@flowcatalyst/http";

// ─── Request Schemas ────────────────────────────────────────────────────────

const AppCodeParam = Type.Object({ appCode: Type.String() });
const RoleParam = Type.Object({
	appCode: Type.String(),
	roleCode: Type.String(),
});

const GrantAccessSchema = Type.Object({
	roleCode: Type.String({ minLength: 1 }),
	canRead: Type.Optional(Type.Boolean()),
	canWrite: Type.Optional(Type.Boolean()),
});

const UpdateAccessSchema = Type.Object({
	canRead: Type.Optional(Type.Boolean()),
	canWrite: Type.Optional(Type.Boolean()),
});

// ─── Response Schemas ───────────────────────────────────────────────────────

const AccessGrantResponseSchema = Type.Object({
	id: Type.String(),
	applicationCode: Type.String(),
	roleCode: Type.String(),
	canRead: Type.Boolean(),
	canWrite: Type.Boolean(),
	createdAt: Type.String({ format: "date-time" }),
});

const AccessGrantListResponseSchema = Type.Object({
	items: Type.Array(AccessGrantResponseSchema),
});

type AccessGrantResponse = Static<typeof AccessGrantResponseSchema>;

/**
 * Dependencies for the config access admin API.
 */
export interface ConfigAccessRoutesDeps {
	readonly platformConfigAccessRepository: PlatformConfigAccessRepository;
	readonly grantPlatformConfigAccessUseCase: UseCase<
		GrantPlatformConfigAccessCommand,
		PlatformConfigAccessGranted
	>;
	readonly updatePlatformConfigAccessUseCase: UseCase<
		UpdatePlatformConfigAccessCommand,
		PlatformConfigAccessUpdated
	>;
	readonly revokePlatformConfigAccessUseCase: UseCase<
		RevokePlatformConfigAccessCommand,
		PlatformConfigAccessRevoked
	>;
}

/**
 * Register config access admin API routes.
 */
export async function registerConfigAccessRoutes(
	fastify: FastifyInstance,
	deps: ConfigAccessRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		platformConfigAccessRepository,
		grantPlatformConfigAccessUseCase,
		updatePlatformConfigAccessUseCase,
		revokePlatformConfigAccessUseCase,
	} = deps;

	// GET /api/config-access/:appCode - List access grants
	f.get(
		"/config-access/:appCode",
		{
			schema: {
				params: AppCodeParam,
				response: {
					200: AccessGrantListResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { appCode } = request.params as Static<typeof AppCodeParam>;
			const grants =
				await platformConfigAccessRepository.findByApplication(appCode);

			return jsonSuccess(reply, {
				items: grants.map(toAccessGrantResponse),
			});
		},
	);

	// POST /api/config-access/:appCode - Grant config access
	f.post(
		"/config-access/:appCode",
		{
			schema: {
				params: AppCodeParam,
				body: GrantAccessSchema,
				response: {
					201: AccessGrantResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { appCode } = request.params as Static<typeof AppCodeParam>;
			const body = request.body as Static<typeof GrantAccessSchema>;
			const ctx = request.executionContext;

			const command: GrantPlatformConfigAccessCommand = {
				applicationCode: appCode,
				roleCode: body.roleCode,
				...(body.canRead !== undefined && { canRead: body.canRead }),
				...(body.canWrite !== undefined && { canWrite: body.canWrite }),
			};
			const result = await grantPlatformConfigAccessUseCase.execute(
				command,
				ctx,
			);
			if (Result.isFailure(result)) return sendResult(reply, result);

			const grant =
				await platformConfigAccessRepository.findByApplicationAndRole(
					appCode,
					body.roleCode,
				);
			if (!grant) {
				return jsonError(
					reply,
					500,
					"GRANT_DISAPPEARED",
					"Grant not found after creation",
				);
			}
			return jsonCreated(reply, toAccessGrantResponse(grant));
		},
	);

	// PUT /api/config-access/:appCode/:roleCode - Update access grant
	f.put(
		"/config-access/:appCode/:roleCode",
		{
			schema: {
				params: RoleParam,
				body: UpdateAccessSchema,
				response: {
					200: AccessGrantResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { appCode, roleCode } = request.params as Static<typeof RoleParam>;
			const body = request.body as Static<typeof UpdateAccessSchema>;
			const ctx = request.executionContext;

			const command: UpdatePlatformConfigAccessCommand = {
				applicationCode: appCode,
				roleCode,
				...(body.canRead !== undefined && { canRead: body.canRead }),
				...(body.canWrite !== undefined && { canWrite: body.canWrite }),
			};
			const result = await updatePlatformConfigAccessUseCase.execute(
				command,
				ctx,
			);
			if (Result.isFailure(result)) return sendResult(reply, result);

			const grant =
				await platformConfigAccessRepository.findByApplicationAndRole(
					appCode,
					roleCode,
				);
			if (!grant) return notFound(reply, `Access grant not found for role: ${roleCode}`);
			return jsonSuccess(reply, toAccessGrantResponse(grant));
		},
	);

	// DELETE /api/config-access/:appCode/:roleCode - Revoke access
	f.delete(
		"/config-access/:appCode/:roleCode",
		{
			schema: {
				params: RoleParam,
				response: {
					204: Type.Null(),
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { appCode, roleCode } = request.params as Static<typeof RoleParam>;
			const ctx = request.executionContext;

			const command: RevokePlatformConfigAccessCommand = {
				applicationCode: appCode,
				roleCode,
			};
			const result = await revokePlatformConfigAccessUseCase.execute(
				command,
				ctx,
			);
			if (Result.isFailure(result)) return sendResult(reply, result);
			return noContent(reply);
		},
	);
}

function toAccessGrantResponse(
	grant: PlatformConfigAccess,
): AccessGrantResponse {
	return {
		id: grant.id,
		applicationCode: grant.applicationCode,
		roleCode: grant.roleCode,
		canRead: grant.canRead,
		canWrite: grant.canWrite,
		createdAt: grant.createdAt.toISOString(),
	};
}
