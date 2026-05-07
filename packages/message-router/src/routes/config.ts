import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { LocalConfigResponseSchema } from "../schemas/index.js";

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
};
