<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
	scheduledJobsApi,
	type ScheduledJob,
	type ScheduledJobStatus,
} from "@/api/scheduled-jobs";
import { useListState } from "@/composables/useListState";

const router = useRouter();

const { filters, searchQuery } = useListState({
	filters: {
		statusFilter: { type: "string", queryKey: "status" },
	},
	pagination: false,
	sort: false,
	search: { queryKey: "q" },
});

const statusFilter = filters.statusFilter;

const jobs = ref<ScheduledJob[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const statusOptions = [
	{ label: "All Statuses", value: null },
	{ label: "Active", value: "ACTIVE" },
	{ label: "Paused", value: "PAUSED" },
	{ label: "Archived", value: "ARCHIVED" },
];

async function load() {
	loading.value = true;
	error.value = null;
	try {
		const params: { status?: string; search?: string } = {};
		if (statusFilter.value) params.status = statusFilter.value;
		if (searchQuery.value) params.search = searchQuery.value;
		const result = await scheduledJobsApi.list(params);
		jobs.value = result.scheduledJobs;
	} catch (e) {
		error.value =
			e instanceof Error ? e.message : "Failed to load scheduled jobs";
	} finally {
		loading.value = false;
	}
}

onMounted(load);

function viewJob(job: ScheduledJob) {
	router.push(`/scheduled-jobs/${job.id}`);
}

function onRowClick(event: { data: ScheduledJob }) {
	viewJob(event.data);
}

function statusSeverity(
	status: ScheduledJobStatus,
): "success" | "warn" | "secondary" {
	switch (status) {
		case "ACTIVE":
			return "success";
		case "PAUSED":
			return "warn";
		case "ARCHIVED":
		default:
			return "secondary";
	}
}

function formatCrons(crons: string[]): string {
	if (crons.length === 0) return "—";
	if (crons.length === 1) return crons[0] ?? "";
	return `${crons[0]} (+${crons.length - 1})`;
}

function formatDate(s?: string | null): string {
	if (!s) return "—";
	return new Date(s).toLocaleString();
}
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <div>
        <h1 class="page-title">Scheduled Jobs</h1>
        <p class="page-subtitle">Cron-triggered webhook jobs</p>
      </div>
      <Button
        label="New Scheduled Job"
        icon="pi pi-plus"
        @click="router.push('/scheduled-jobs/new')"
      />
    </header>

    <div class="section-card">
      <div class="toolbar">
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All statuses"
          class="filter-select"
          showClear
          @change="load"
        />
        <IconField class="search-field">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Code or name…"
            @keyup.enter="load"
          />
        </IconField>
        <Button label="Apply" outlined @click="load" />
      </div>

      <Message v-if="error" severity="error">{{ error }}</Message>

      <DataTable
        :value="jobs"
        :loading="loading"
        data-key="id"
        row-hover
        striped-rows
        emptyMessage="No scheduled jobs found"
        @row-click="onRowClick"
      >
        <Column header="Code" field="code" style="width: 22%">
          <template #body="{ data }">
            <code class="font-mono">{{ data.code }}</code>
            <div v-if="data.hasActiveInstance" class="active-flag">
              <i class="pi pi-spinner pi-spin" /> running
            </div>
          </template>
        </Column>
        <Column header="Name" field="name" style="width: 22%" />
        <Column header="Scope" style="width: 14%">
          <template #body="{ data }">
            <span v-if="data.clientId">{{ data.clientId }}</span>
            <span v-else class="scope-platform">Platform</span>
          </template>
        </Column>
        <Column header="Crons" style="width: 18%">
          <template #body="{ data }">
            <code class="font-mono">{{ formatCrons(data.crons) }}</code>
            <div class="text-muted text-xs">{{ data.timezone }}</div>
          </template>
        </Column>
        <Column header="Status" style="width: 8rem">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="statusSeverity(data.status)" />
          </template>
        </Column>
        <Column header="Last Fired" style="width: 14%">
          <template #body="{ data }">
            <span class="text-sm">{{ formatDate(data.lastFiredAt) }}</span>
          </template>
        </Column>
        <Column header="" style="width: 4rem">
          <template #body="{ data }">
            <Button
              icon="pi pi-arrow-right"
              severity="secondary"
              text
              rounded
              @click.stop="viewJob(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.page-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.section-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-select {
  min-width: 200px;
}

.search-field {
  flex: 1 1 240px;
}

.search-field :deep(.p-inputtext) {
  width: 100%;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-muted { color: #94a3b8; }

.active-flag {
  font-size: 0.75rem;
  color: #f97316;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.scope-platform {
  color: #94a3b8;
  font-style: italic;
}
</style>
