import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { HealthCheckResponseSchema } from "../schemas/index.js";

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	f.get(
		"/live",
		{
			schema: {
				tags: ["Health"],
				summary: "Liveness probe",
				response: {
					200: HealthCheckResponseSchema,
					503: HealthCheckResponseSchema,
				},
			},
		},
		(request, reply) => {
			const health = request.services.health.getLiveness();
			reply.code(health.healthy ? 200 : 503);
			return {
				status: health.healthy ? "ALIVE" : "NOT_ALIVE",
				timestamp: new Date().toISOString(),
				issues: health.issues,
			};
		},
	);

	f.get(
		"/ready",
		{
			schema: {
				tags: ["Health"],
				summary: "Readiness probe",
				response: {
					200: HealthCheckResponseSchema,
					503: HealthCheckResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const health = await request.services.health.getReadiness();
			reply.code(health.healthy ? 200 : 503);
			return {
				status: health.healthy ? "READY" : "NOT_READY",
				timestamp: new Date().toISOString(),
				issues: health.issues,
			};
		},
	);

	f.get(
		"/startup",
		{
			schema: {
				tags: ["Health"],
				summary: "Startup probe",
				response: {
					200: HealthCheckResponseSchema,
					503: HealthCheckResponseSchema,
				},
			},
		},
		(request, reply) => {
			const health = request.services.health.getStartup();
			reply.code(health.healthy ? 200 : 503);
			return {
				status: health.healthy ? "READY" : "NOT_READY",
				timestamp: new Date().toISOString(),
				issues: health.issues,
			};
		},
	);
};
