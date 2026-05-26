/**
 * order-service — runnable end-to-end example of a FlowCatalyst SDK
 * consumer app. Shows the transactional-outbox pattern that the package
 * docs describe one slice at a time:
 *
 *   HTTP request   ->  command DTO
 *                  ->  begin tx
 *                  ->  INSERT orders row
 *                  ->  OutboxManager.createEvent (same tx)
 *                  ->  commit          -> outbox row visible to processor
 *                  ->  201 / 400 / 500
 *
 * The outbox driver writes to `outbox_messages`, which the platform's
 * outbox processor forwards to /api/events/batch — so this service never
 * calls the platform itself during a transaction.
 *
 * # Schema
 *
 * Bring up Postgres and apply the SDK migration plus this demo table:
 *
 *   -- From clients/typescript-sdk/migrations/postgresql/001_create_outbox_messages.sql
 *   CREATE TABLE outbox_messages (...);
 *
 *   CREATE TABLE IF NOT EXISTS orders (
 *     id          TEXT PRIMARY KEY,
 *     customer_id TEXT NOT NULL,
 *     total_cents BIGINT NOT NULL,
 *     placed_at   TIMESTAMPTZ NOT NULL
 *   );
 *
 * # Run
 *
 *   FC_DATABASE_URL=postgres://localhost:5432/orders \
 *   FC_CLIENT_ID=cli_demo                            \
 *   pnpm tsx examples/order-service/main.ts
 *
 *   curl -XPOST http://localhost:8080/orders \
 *     -H 'X-Principal-ID: prn_demo'          \
 *     -H 'Content-Type: application/json'    \
 *     -d '{"customerId":"cus_42","totalCents":1500}'
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Pool, type PoolClient } from "pg";
import {
	CreateEventDto,
	OutboxManager,
	generateTsid,
	type OutboxDriver,
	type OutboxMessage,
} from "@flowcatalyst/sdk";

// ───────────────────────────────────────────────────────────────────
// Domain
// ───────────────────────────────────────────────────────────────────

interface Order {
	readonly id: string;
	readonly customerId: string;
	readonly totalCents: number;
	readonly placedAt: Date;
}

async function insertOrder(tx: PoolClient, order: Order): Promise<void> {
	await tx.query(
		`INSERT INTO orders (id, customer_id, total_cents, placed_at)
		 VALUES ($1, $2, $3, $4)`,
		[order.id, order.customerId, order.totalCents, order.placedAt],
	);
}

// ───────────────────────────────────────────────────────────────────
// Outbox driver — writes through whichever PG client is bound to it.
// Constructing a fresh driver per transaction is what lets the outbox
// insert participate in the same tx as insertOrder.
// ───────────────────────────────────────────────────────────────────

class TxBoundOutboxDriver implements OutboxDriver {
	constructor(private readonly tx: PoolClient) {}

	async insert(message: OutboxMessage): Promise<void> {
		await this.tx.query(
			`INSERT INTO outbox_messages
			   (id, type, message_group, payload, status,
			    created_at, updated_at,
			    client_id, payload_size, headers)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
			[
				message.id,
				message.type,
				message.message_group,
				message.payload,
				message.status,
				message.created_at,
				message.updated_at,
				message.client_id,
				message.payload_size,
				message.headers ? JSON.stringify(message.headers) : null,
			],
		);
	}

	async insertBatch(messages: OutboxMessage[]): Promise<void> {
		for (const m of messages) await this.insert(m);
	}
}

// ───────────────────────────────────────────────────────────────────
// Use case — write order + emit OrderPlaced in one transaction.
// ───────────────────────────────────────────────────────────────────

interface PlaceOrderCommand {
	readonly customerId: string;
	readonly totalCents: number;
	readonly principalId: string;
	readonly correlationId: string | null;
}

interface PlaceOrderResult {
	readonly orderId: string;
	readonly eventId: string;
}

async function placeOrder(
	pool: Pool,
	clientId: string,
	cmd: PlaceOrderCommand,
): Promise<PlaceOrderResult> {
	if (!cmd.customerId) throw badRequest("CUSTOMER_REQUIRED", "customerId is required");
	if (cmd.totalCents <= 0) throw badRequest("TOTAL_INVALID", "totalCents must be positive");
	if (!cmd.principalId) throw unauthorized("PRINCIPAL_REQUIRED", "no acting principal");

	const order: Order = {
		id: `ord_${generateTsid()}`,
		customerId: cmd.customerId,
		totalCents: cmd.totalCents,
		placedAt: new Date(),
	};

	const tx = await pool.connect();
	try {
		await tx.query("BEGIN");

		await insertOrder(tx, order);

		// OutboxManager + a tx-bound driver = outbox INSERT runs in this tx.
		const outbox = new OutboxManager(new TxBoundOutboxDriver(tx), clientId);
		const event = CreateEventDto
			.create("orders:sales:order:placed", {
				customerId: order.customerId,
				totalCents: order.totalCents,
			})
			.withSource("orders:sales")
			.withSubject(`orders.order.${order.id}`)
			.withMessageGroup(`orders.order.${order.id}`);
		const eventId = await outbox.createEvent(
			cmd.correlationId ? event.withCorrelationId(cmd.correlationId) : event,
		);

		await tx.query("COMMIT");
		return { orderId: order.id, eventId };
	} catch (err) {
		await tx.query("ROLLBACK").catch(() => undefined);
		throw err;
	} finally {
		tx.release();
	}
}

// ───────────────────────────────────────────────────────────────────
// HTTP layer
// ───────────────────────────────────────────────────────────────────

class HttpError extends Error {
	constructor(
		readonly status: number,
		readonly code: string,
		message: string,
	) {
		super(message);
	}
}

const badRequest = (code: string, msg: string): HttpError =>
	new HttpError(400, code, msg);
const unauthorized = (code: string, msg: string): HttpError =>
	new HttpError(401, code, msg);

interface PlaceOrderBody {
	readonly customerId?: string;
	readonly totalCents?: number;
}

async function handlePlaceOrder(
	req: IncomingMessage,
	res: ServerResponse,
	pool: Pool,
	clientId: string,
): Promise<void> {
	let body: PlaceOrderBody;
	try {
		body = JSON.parse(await readBody(req)) as PlaceOrderBody;
	} catch {
		return writeJson(res, 400, { code: "BAD_JSON", message: "invalid JSON body" });
	}

	try {
		const result = await placeOrder(pool, clientId, {
			customerId: body.customerId ?? "",
			totalCents: body.totalCents ?? 0,
			principalId: header(req, "x-principal-id") ?? "",
			correlationId: header(req, "x-correlation-id"),
		});
		writeJson(res, 201, result);
	} catch (err) {
		if (err instanceof HttpError) {
			writeJson(res, err.status, { code: err.code, message: err.message });
			return;
		}
		console.error("place-order: internal error", err);
		writeJson(res, 500, { code: "INTERNAL", message: "internal error" });
	}
}

function header(req: IncomingMessage, name: string): string | null {
	const v = req.headers[name];
	if (Array.isArray(v)) return v[0] ?? null;
	return v ?? null;
}

function readBody(req: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		req.on("data", (chunk: Buffer) => chunks.push(chunk));
		req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
		req.on("error", reject);
	});
}

function writeJson(res: ServerResponse, status: number, body: unknown): void {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
}

// ───────────────────────────────────────────────────────────────────
// main: wire everything
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
	const dsn = process.env["FC_DATABASE_URL"] ?? "postgres://localhost:5432/orders";
	const clientId = process.env["FC_CLIENT_ID"];
	if (!clientId) {
		console.error("FC_CLIENT_ID is required (TSID of the client this app acts as)");
		process.exit(1);
	}

	const pool = new Pool({ connectionString: dsn });
	await pool.query("SELECT 1"); // fail fast on bad DSN

	const server = createServer((req, res) => {
		if (req.method === "POST" && req.url === "/orders") {
			void handlePlaceOrder(req, res, pool, clientId);
			return;
		}
		writeJson(res, 404, { code: "NOT_FOUND", message: "not found" });
	});

	const port = 8080;
	server.listen(port, () => console.log(`order-service listening on :${port}`));

	const shutdown = async (): Promise<void> => {
		server.close();
		await pool.end();
		process.exit(0);
	};
	process.on("SIGINT", () => void shutdown());
	process.on("SIGTERM", () => void shutdown());
}

void main();
