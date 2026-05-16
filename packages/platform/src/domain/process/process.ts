/**
 * Process Entity
 *
 * Free-form workflow documentation (typically Mermaid diagrams). The `body`
 * holds the diagram source verbatim; the platform renders it client-side.
 *
 * Process codes follow the format: {application}:{subdomain}:{process-name}.
 */

import { generate } from "@flowcatalyst/tsid";
import type { ProcessStatus } from "./process-status.js";
import type { ProcessSource } from "./process-source.js";

export interface Process {
	readonly id: string;
	readonly code: string;
	readonly name: string;
	readonly description: string | null;
	readonly status: ProcessStatus;
	readonly source: ProcessSource;
	readonly application: string;
	readonly subdomain: string;
	readonly processName: string;
	readonly body: string;
	readonly diagramType: string;
	readonly tags: string[];
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export type NewProcess = Omit<Process, "createdAt" | "updatedAt"> & {
	createdAt?: Date;
	updatedAt?: Date;
};

export interface ParsedProcessCode {
	application: string;
	subdomain: string;
	processName: string;
}

/**
 * Parse code segments from a process code: {application}:{subdomain}:{process-name}.
 * Returns null if the segment count is wrong or any segment is empty.
 */
export function parseProcessCode(code: string): ParsedProcessCode | null {
	const parts = code.split(":");
	if (parts.length !== 3) return null;
	for (const p of parts) {
		if (p.trim() === "") return null;
	}
	return {
		application: parts[0]!,
		subdomain: parts[1]!,
		processName: parts[2]!,
	};
}

/**
 * Build a process code from its three segments.
 */
export function buildProcessCode(
	application: string,
	subdomain: string,
	processName: string,
): string {
	return `${application}:${subdomain}:${processName}`;
}

interface CreateProcessParams {
	application: string;
	subdomain: string;
	processName: string;
	name: string;
	description?: string | null;
	body?: string;
	diagramType?: string;
	tags?: string[];
	source?: ProcessSource;
}

/**
 * Create a new process from UI (default source).
 */
export function createProcess(params: CreateProcessParams): NewProcess {
	return {
		id: generate("PROCESS"),
		code: buildProcessCode(
			params.application,
			params.subdomain,
			params.processName,
		),
		name: params.name,
		description: params.description ?? null,
		status: "CURRENT",
		source: params.source ?? "UI",
		application: params.application,
		subdomain: params.subdomain,
		processName: params.processName,
		body: params.body ?? "",
		diagramType: params.diagramType ?? "mermaid",
		tags: params.tags ?? [],
	};
}

/**
 * Create a process from API/SDK sync.
 */
export function createProcessFromApi(
	params: Omit<CreateProcessParams, "source">,
): NewProcess {
	return createProcess({ ...params, source: "API" });
}

/**
 * Apply field updates to a process.
 */
export function updateProcess(
	process: Process,
	updates: Partial<
		Pick<Process, "name" | "description" | "body" | "diagramType" | "tags">
	>,
): Process {
	return {
		...process,
		...updates,
		updatedAt: new Date(),
	};
}

/**
 * Archive a process.
 */
export function archiveProcess(process: Process): Process {
	return {
		...process,
		status: "ARCHIVED",
		updatedAt: new Date(),
	};
}
