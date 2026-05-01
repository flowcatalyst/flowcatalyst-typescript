/**
 * HTTP client configuration for Hey API generated SDK.
 * This sets up the base URL and any default headers.
 */

import { toast } from "@/utils/errorBus";

export const API_BASE_URL = "/api";
export const BFF_BASE_URL = "/bff";

/**
 * Custom error class for API errors that includes status code
 */
export class ApiError extends Error {
	status: number;
	code?: string;

	constructor(
		message: string,
		status: number,
		code?: string,
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}

/**
 * Event emitter for API errors (401/403)
 */
type ApiErrorListener = (status: number, message: string) => void;
const errorListeners: ApiErrorListener[] = [];

export function onApiError(listener: ApiErrorListener): () => void {
	errorListeners.push(listener);
	return () => {
		const index = errorListeners.indexOf(listener);
		if (index > -1) {
			errorListeners.splice(index, 1);
		}
	};
}

function emitApiError(status: number, message: string) {
	errorListeners.forEach((listener) => listener(status, message));
}

export interface FetchOptions extends RequestInit {
	/**
	 * If true, the global error banner is not shown for non-2xx responses.
	 * Use when the page wants to render the error inline (e.g. form-level).
	 */
	suppressGlobalErrorToast?: boolean;
}

/**
 * Map an HTTP status to a short, human-friendly summary used as the toast title.
 */
export function summaryForStatus(status: number): string {
	switch (status) {
		case 400:
			return "Bad Request";
		case 401:
			return "Unauthorized";
		case 403:
			return "Forbidden";
		case 404:
			return "Not Found";
		case 409:
			return "Conflict";
		case 422:
			return "Validation Failed";
		case 429:
			return "Too Many Requests";
		case 500:
		case 502:
		case 503:
		case 504:
			return "Server Error";
		default:
			return "Request Failed";
	}
}

/**
 * Fetch from the main API endpoints.
 */
export async function apiFetch<T>(
	path: string,
	options: FetchOptions = {},
): Promise<T> {
	return baseFetch<T>(`${API_BASE_URL}${path}`, options);
}

/**
 * Fetch from BFF (Backend For Frontend) endpoints.
 * BFF endpoints return IDs as strings to preserve precision for JavaScript.
 */
export async function bffFetch<T>(
	path: string,
	options: FetchOptions = {},
): Promise<T> {
	return baseFetch<T>(`${BFF_BASE_URL}${path}`, options);
}

async function baseFetch<T>(
	url: string,
	options: FetchOptions = {},
): Promise<T> {
	const { suppressGlobalErrorToast = false, ...fetchOptions } = options;
	const headers: Record<string, string> = {
		...(fetchOptions.headers as Record<string, string>),
	};
	if (fetchOptions.body) {
		headers["Content-Type"] = "application/json";
	}

	let response: Response;
	try {
		response = await fetch(url, {
			...fetchOptions,
			credentials: "include",
			headers,
		});
	} catch (err) {
		if (!suppressGlobalErrorToast) {
			toast.error(
				"Network Error",
				err instanceof Error ? err.message : "Failed to reach server",
			);
		}
		throw err;
	}

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ message: "Request failed" }));
		// Platform error shape is `{ code, message }` — prefer the human message.
		const message = error.message || error.code || "Request failed";

		// Emit error event for 401/403
		if (response.status === 401 || response.status === 403) {
			emitApiError(response.status, message);
		}

		// Show error toast for non-auth errors unless caller opts out.
		if (response.status !== 401 && !suppressGlobalErrorToast) {
			toast.error(summaryForStatus(response.status), message);
		}

		throw new ApiError(message, response.status, error.code);
	}

	// Handle 204 No Content
	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}
