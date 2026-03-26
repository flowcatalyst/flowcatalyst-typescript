/**
 * Cancellable sleep utility.
 * Resolves after `ms` milliseconds, or immediately if the AbortSignal is already aborted.
 * When the signal fires, the timer is cleared and the promise resolves (does not reject).
 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		if (signal?.aborted) {
			resolve();
			return;
		}
		const timer = setTimeout(resolve, ms);
		signal?.addEventListener(
			"abort",
			() => {
				clearTimeout(timer);
				resolve();
			},
			{ once: true },
		);
	});
}
