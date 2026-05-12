/**
 * Cron evaluation helpers.
 *
 * Mirrors the Rust scheduler's `latest_slot_in_window`:
 *
 *   Compute the LATEST cron slot in the half-open window (after, upTo] across
 *   all `crons` evaluated in the given IANA timezone. Returns null if no slot
 *   fits the window.
 *
 * "Skip-missed" semantics: if multiple slots fall in the window (e.g. after a
 * long downtime), only the latest fires. Older missed slots are dropped.
 *
 * Uses `cron-parser` which supports up to 6-field cron expressions (with
 * seconds) and IANA timezone names.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import parser from "cron-parser";

export class CronEvaluationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CronEvaluationError";
	}
}

/**
 * Compute the latest cron slot in `(after, upTo]` across all `crons`
 * evaluated in the given timezone.
 *
 * @returns The latest slot as a UTC Date, or null if no slot fits.
 * @throws CronEvaluationError if any cron expression or the timezone is invalid.
 */
export function latestSlotInWindow(
	crons: readonly string[],
	tz: string,
	after: Date,
	upTo: Date,
): Date | null {
	if (after.getTime() >= upTo.getTime()) {
		return null;
	}

	let best: Date | null = null;

	for (const expr of crons) {
		let it: ReturnType<typeof parser.parseExpression>;
		try {
			it = parser.parseExpression(expr, {
				currentDate: after,
				endDate: upTo,
				tz,
			});
		} catch (err) {
			throw new CronEvaluationError(
				`Invalid cron '${expr}' or timezone '${tz}': ${(err as Error).message}`,
			);
		}

		// Walk forward from `after`; cron-parser's endDate option ensures we stop
		// at upTo. Each .next() yields the next slot in ascending order. The
		// iterator throws "Out of the timespan range" once exhausted.
		while (true) {
			let slot: Date;
			try {
				// cron-parser's .next() returns a CronDate; the typings include the
				// IteratorResult overload but the runtime always returns CronDate.
				const result = it.next() as unknown as { toDate(): Date };
				slot = result.toDate();
			} catch {
				break;
			}
			if (slot.getTime() > upTo.getTime()) break;
			if (!best || slot.getTime() > best.getTime()) {
				best = slot;
			}
		}
	}

	return best;
}

/**
 * Validate that all entries parse as valid cron expressions in the given tz.
 * Throws CronEvaluationError on the first failure.
 */
export function validateCrons(
	crons: readonly string[],
	tz: string,
): void {
	for (const expr of crons) {
		try {
			parser.parseExpression(expr, { tz });
		} catch (err) {
			throw new CronEvaluationError(
				`Invalid cron '${expr}' or timezone '${tz}': ${(err as Error).message}`,
			);
		}
	}
}
