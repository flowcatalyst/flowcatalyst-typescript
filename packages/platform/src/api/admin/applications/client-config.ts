/**
 * Applications admin API — application-client-config sub-aggregate.
 *
 *   GET    /applications/:id/clients
 *   POST   /applications/:id/clients
 *   DELETE /applications/:id/clients/:clientId
 */

import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type, type Static } from "@sinclair/typebox";
import {
	ErrorResponseSchema,
	jsonCreated,
	jsonSuccess,
	noContent,
	notFound,
	sendResult,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";

import type {
	DisableApplicationForClientCommand,
	EnableApplicationForClientCommand,
} from "../../../application/index.js";
import { requirePermission } from "../../../authorization/index.js";
import { APPLICATION_PERMISSIONS } from "../../../authorization/permissions/platform-admin.js";

import type { ApplicationsRoutesDeps } from "./index.js";
import { toApplicationClientConfigResponse } from "./mappers.js";
import {
	ApplicationClientConfigResponseSchema,
	ApplicationClientConfigsListResponseSchema,
	ClientIdSchema,
	IdClientIdParam,
	IdParam,
	type ClientIdBody,
} from "./schemas.js";

export async function registerClientConfigRoutes(
	fastify: FastifyInstance,
	deps: ApplicationsRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		applicationRepository,
		applicationClientConfigRepository,
		enableApplicationForClientUseCase,
		disableApplicationForClientUseCase,
	} = deps;

	// GET /api/applications/:id/clients - Get client configs for application
	f.get(
		"/applications/:id/clients",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationClientConfigsListResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;

			const applicationExists = await applicationRepository.exists(id);
			if (!applicationExists) {
				return notFound(reply, `Application not found: ${id}`);
			}

			const configs =
				await applicationClientConfigRepository.findByApplication(id);

			return jsonSuccess(reply, {
				configs: configs.map(toApplicationClientConfigResponse),
			});
		},
	);

	// POST /api/applications/:id/clients - Enable application for client
	f.post(
		"/applications/:id/clients",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.ENABLE_CLIENT),
			schema: {
				params: IdParam,
				body: ClientIdSchema,
				response: {
					201: ApplicationClientConfigResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as ClientIdBody;
			const ctx = request.executionContext;

			const command: EnableApplicationForClientCommand = {
				applicationId: id,
				clientId: body.clientId,
			};

			const result = await enableApplicationForClientUseCase.execute(
				command,
				ctx,
			);

			if (Result.isSuccess(result)) {
				const config =
					await applicationClientConfigRepository.findByApplicationAndClient(
						id,
						body.clientId,
					);
				if (config) {
					return jsonCreated(reply, toApplicationClientConfigResponse(config));
				}
			}

			return sendResult(reply, result);
		},
	);

	// DELETE /api/applications/:id/clients/:clientId - Disable application for client
	f.delete(
		"/applications/:id/clients/:clientId",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.DISABLE_CLIENT),
			schema: {
				params: IdClientIdParam,
				response: {
					204: Type.Null(),
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id, clientId } = request.params as Static<typeof IdClientIdParam>;
			const ctx = request.executionContext;

			const command: DisableApplicationForClientCommand = {
				applicationId: id,
				clientId,
			};

			const result = await disableApplicationForClientUseCase.execute(
				command,
				ctx,
			);

			if (Result.isSuccess(result)) {
				return noContent(reply);
			}

			return sendResult(reply, result);
		},
	);
}
