import { ref, watch } from "vue";
import { useListState } from "./useListState";
import {
	eventTypesApi,
	type EventType,
	type EventTypeFilters,
	type EventTypeStatus,
} from "@/api/event-types";

export function useEventTypes() {
	const { filters, hasActiveFilters, clearFilters, syncToUrl, setSilent } =
		useListState({
			filters: {
				applications: { type: "string[]", queryKey: "app" },
				subdomains: { type: "string[]", queryKey: "sub" },
				aggregates: { type: "string[]", queryKey: "agg" },
				status: { type: "string", queryKey: "status" },
			},
			pagination: false,
			sort: false,
			search: false,
		});

	const eventTypes = ref<EventType[]>([]);
	const initialLoading = ref(true);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// Filter options
	const applicationOptions = ref<string[]>([]);
	const subdomainOptions = ref<string[]>([]);
	const aggregateOptions = ref<string[]>([]);

	const statusOptions = [
		{ label: "Current", value: "CURRENT" },
		{ label: "Archived", value: "ARCHIVED" },
	];

	// ---- Data loading ----

	async function loadEventTypes() {
		loading.value = true;
		error.value = null;

		try {
			const f: EventTypeFilters = {};
			if (filters.applications.value.length)
				f.applications = filters.applications.value;
			if (filters.subdomains.value.length)
				f.subdomains = filters.subdomains.value;
			if (filters.aggregates.value.length)
				f.aggregates = filters.aggregates.value;
			if (filters.status.value)
				f.status = filters.status.value as EventTypeStatus;

			const response = await eventTypesApi.list(f);
			eventTypes.value = response.items;
		} catch (e) {
			error.value =
				e instanceof Error ? e.message : "Failed to load event types";
		} finally {
			loading.value = false;
		}
	}

	async function loadApplications() {
		const response = await eventTypesApi.getApplications();
		applicationOptions.value = response.options;

		const valid = new Set(response.options);
		const pruned = filters.applications.value.filter((s) => valid.has(s));
		if (pruned.length !== filters.applications.value.length) {
			setSilent("applications", pruned);
		}
	}

	async function loadSubdomains() {
		const apps = filters.applications.value.length
			? filters.applications.value
			: undefined;
		const response = await eventTypesApi.getSubdomains(apps);
		subdomainOptions.value = response.options;

		const pruned = filters.subdomains.value.filter((s) =>
			response.options.includes(s),
		);
		if (pruned.length !== filters.subdomains.value.length) {
			setSilent("subdomains", pruned);
		}
	}

	async function loadAggregates() {
		const apps = filters.applications.value.length
			? filters.applications.value
			: undefined;
		const subs = filters.subdomains.value.length
			? filters.subdomains.value
			: undefined;
		const response = await eventTypesApi.getAggregates(apps, subs);
		aggregateOptions.value = response.options;

		const pruned = filters.aggregates.value.filter((a) =>
			response.options.includes(a),
		);
		if (pruned.length !== filters.aggregates.value.length) {
			setSilent("aggregates", pruned);
		}
	}

	// Watch for filter changes — sync URL + reload data
	watch(filters.applications, () => {
		syncToUrl();
		loadSubdomains();
		loadAggregates();
		loadEventTypes();
	});

	watch(filters.subdomains, () => {
		syncToUrl();
		loadAggregates();
		loadEventTypes();
	});

	watch(filters.aggregates, () => {
		syncToUrl();
		loadEventTypes();
	});

	watch(filters.status, () => {
		syncToUrl();
		loadEventTypes();
	});

	async function initialize() {
		await Promise.all([loadApplications(), loadSubdomains(), loadAggregates()]);
		syncToUrl();
		await loadEventTypes();
		initialLoading.value = false;
	}

	return {
		// State
		eventTypes,
		initialLoading,
		loading,
		error,

		// Filters — expose individual refs for template binding
		selectedApplications: filters.applications,
		selectedSubdomains: filters.subdomains,
		selectedAggregates: filters.aggregates,
		selectedStatus: filters.status,
		hasActiveFilters,

		// Options
		applicationOptions,
		subdomainOptions,
		aggregateOptions,
		statusOptions,

		// Actions
		loadEventTypes,
		clearFilters,
		initialize,
	};
}
