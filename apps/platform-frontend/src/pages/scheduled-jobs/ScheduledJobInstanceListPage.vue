<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
	scheduledJobsApi,
	type ScheduledJob,
	type ScheduledJobInstance,
} from "@/api/scheduled-jobs";

const route = useRoute();
const router = useRouter();

const jobId = route.params["id"] as string;
const job = ref<ScheduledJob | null>(null);
const instances = ref<ScheduledJobInstance[]>([]);
const total = ref(0);
const loading = ref(true);

const statusFilter = ref<string | null>(null);
const triggerFilter = ref<string | null>(null);

const statusOptions = [
	{ label: "All", value: null },
	{ label: "Queued", value: "QUEUED" },
	{ label: "In Flight", value: "IN_FLIGHT" },
	{ label: "Delivered", value: "DELIVERED" },
	{ label: "Completed", value: "COMPLETED" },
	{ label: "Failed", value: "FAILED" },
	{ label: "Delivery Failed", value: "DELIVERY_FAILED" },
];

const triggerOptions = [
	{ label: "All", value: null },
	{ label: "CRON", value: "CRON" },
	{ label: "MANUAL", value: "MANUAL" },
];

onMounted(async () => {
	await Promise.all([loadJob(), load()]);
});

async function loadJob() {
	try {
		job.value = await scheduledJobsApi.get(jobId);
	} catch {
		job.value = null;
	}
}

async function load() {
	loading.value = true;
	try {
		const res = await scheduledJobsApi.listInstances({
			scheduledJobId: jobId,
			...(statusFilter.value ? { status: statusFilter.value } : {}),
			...(triggerFilter.value ? { triggerKind: triggerFilter.value } : {}),
			limit: 100,
		});
		instances.value = res.instances;
		total.value = res.total;
	} finally {
		loading.value = false;
	}
}

function statusSeverity(
	status: string,
): "success" | "warn" | "secondary" | "danger" | "info" {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "QUEUED":
		case "IN_FLIGHT":
			return "info";
		case "DELIVERED":
			return "warn";
		case "FAILED":
		case "DELIVERY_FAILED":
			return "danger";
		default:
			return "secondary";
	}
}

function formatDate(s?: string | null): string {
	if (!s) return "—";
	return new Date(s).toLocaleString();
}

function viewInstance(instance: ScheduledJobInstance) {
	router.push(`/scheduled-jobs/instances/${instance.id}`);
}

function onRowClick(event: { data: ScheduledJobInstance }) {
	viewInstance(event.data);
}
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <Button
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        @click="router.push(`/scheduled-jobs/${jobId}`)"
        v-tooltip="'Back to job'"
      />
      <div class="header-text">
        <h1 class="page-title">Instances</h1>
        <code v-if="job" class="app-code">{{ job.code }}</code>
      </div>
    </header>

    <div class="section-card">
      <div class="toolbar">
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Status"
          class="filter-select"
          showClear
          @change="load"
        />
        <Select
          v-model="triggerFilter"
          :options="triggerOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Trigger"
          class="filter-select"
          showClear
          @change="load"
        />
        <span class="total-count">{{ total }} total</span>
      </div>

      <DataTable
        :value="instances"
        :loading="loading"
        data-key="id"
        row-hover
        striped-rows
        emptyMessage="No instances found"
        @row-click="onRowClick"
      >
        <Column header="Fired At" field="firedAt" style="width: 22%">
          <template #body="{ data }">
            <span class="text-sm">{{ formatDate(data.firedAt) }}</span>
          </template>
        </Column>
        <Column header="Trigger" field="triggerKind" style="width: 10%" />
        <Column header="Status" style="width: 14%">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="statusSeverity(data.status)" />
          </template>
        </Column>
        <Column header="Attempts" field="deliveryAttempts" style="width: 8%" />
        <Column header="Delivered At" style="width: 18%">
          <template #body="{ data }">
            <span class="text-sm">{{ formatDate(data.deliveredAt) }}</span>
          </template>
        </Column>
        <Column header="Completed At" style="width: 18%">
          <template #body="{ data }">
            <span class="text-sm">{{ formatDate(data.completedAt) }}</span>
          </template>
        </Column>
        <Column header="" style="width: 4rem">
          <template #body="{ data }">
            <Button
              icon="pi pi-arrow-right"
              severity="secondary"
              text
              rounded
              @click.stop="viewInstance(data)"
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
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.header-text { flex: 1; }
.page-title { margin: 0; font-size: 24px; font-weight: 600; }
.app-code {
  display: inline-block;
  margin-top: 4px;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: #475569;
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
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-select { min-width: 180px; }
.text-sm { font-size: 0.875rem; }
.total-count {
  margin-left: auto;
  color: #64748b;
  font-size: 0.875rem;
}
</style>
