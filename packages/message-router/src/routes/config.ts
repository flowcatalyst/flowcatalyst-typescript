import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { LocalConfigResponseSchema } from "../schemas/index.js";

const ConfigReloadRequestSchema = Type.Object({
	queues: Type.Optional(
		Type.Array(
			Type.Object({
				queueUri: Type.Optional(Type.String()),
				queueName: Type.Optional(Type.String()),
				connections: Type.Optional(Type.Number()),
			}),
		),
	),
	connections: Type.Optional(Type.Number()),
	processingPools: Type.Array(
		Type.Object({
			code: Type.String(),
			concurrency: Type.Number(),
			rateLimitPerMinute: Type.Optional(
				Type.Union([Type.Number(), Type.Null()]),
			),
		}),
	),
});

const ConfigReloadResponseSchema = Type.Object({
	success: Type.Boolean(),
	poolsCreated: Type.Number(),
	poolsRemoved: Type.Number(),
	totalActivePools: Type.Number(),
});

export const configRoutes: FastifyPluginAsync = async (fastify) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	f.get(
		"/",
		{
			schema: {
				tags: ["Configuration"],
				summary: "Get local configuration",
				response: { 200: LocalConfigResponseSchema },
			},
		},
		(request) => {
			return request.services.queueManager.getConfig();
		},
	);

	f.post(
		"/reload",
		{
			schema: {
				tags: ["Configuration"],
				summary: "Reload router configuration",
				body: ConfigReloadRequestSchema,
				response: { 200: ConfigReloadResponseSchema },
			},
		},
		async (request) => {
			const body = request.body as {
				queues?: Array<{
					queueUri?: string;
					queueName?: string;
					connections?: number;
				}>;
				connections?: number;
				processingPools: Array<{
					code: string;
					concurrency: number;
					rateLimitPerMinute?: number | null;
				}>;
			};
			const result = await request.services.queueManager.reloadConfig({
				queues: (body.queues ?? []).map((q) => ({
					queueUri: q.queueUri ?? q.queueName ?? "",
					queueName: q.queueName ?? null,
					connections: q.connections ?? 1,
				})),
				connections: body.connections ?? 1,
				processingPools: body.processingPools.map((p) => ({
					code: p.code,
					concurrency: p.concurrency,
					rateLimitPerMinute: p.rateLimitPerMinute ?? null,
				})),
			});
			return {
				success: true,
				poolsCreated: result.poolsCreated,
				poolsRemoved: result.poolsRemoved,
				totalActivePools: result.poolsAfter,
			};
		},
	);
};
