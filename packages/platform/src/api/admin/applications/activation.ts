/**
 * Applications admin API — activate / deactivate routes.
 *
 *   POST /applications/:id/activate
 *   POST /applications/:id/deactivate
 */

import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { Static } from "@sinclair/typebox";
import {
	ErrorResponseSchema,
	jsonSuccess,
	sendResult,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";

import type {
	ActivateApplicationCommand,
	DeactivateApplicationCommand,
} from "../../../application/index.js";
import { requirePermission } from "../../../authorization/index.js";
import { APPLICATION_PERMISSIONS } from "../../../authorization/permissions/platform-admin.js";

import type { ApplicationsRoutesDeps } from "./index.js";
import { toApplicationResponse } from "./mappers.js";
import { ApplicationResponseSchema, IdParam } from "./schemas.js";

export async function registerActivationRoutes(
	fastify: FastifyInstance,
	deps: ApplicationsRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		applicationRepository,
		activateApplicationUseCase,
		deactivateApplicationUseCase,
	} = deps;

	// POST /api/applications/:id/activate
	f.post(
		"/applications/:id/activate",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.ACTIVATE),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			const command: ActivateApplicationCommand = {
				applicationId: id,
			};

			const result = await activateApplicationUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const application = await applicationRepository.findById(id);
				if (application) {
					return jsonSuccess(reply, toApplicationResponse(application));
				}
			}

			return sendResult(reply, result);
		},
	);

	// POST /api/applications/:id/deactivate
	f.post(
		"/applications/:id/deactivate",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.DEACTIVATE),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			const command: DeactivateApplicationCommand = {
				applicationId: id,
			};

			const result = await deactivateApplicationUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const application = await applicationRepository.findById(id);
				if (application) {
					return jsonSuccess(reply, toApplicationResponse(application));
				}
			}

			return sendResult(reply, result);
		},
	);
}
