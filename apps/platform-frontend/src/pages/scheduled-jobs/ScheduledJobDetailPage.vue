<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { toast } from "@/utils/errorBus";
import {
	scheduledJobsApi,
	type ScheduledJob,
	type ScheduledJobInstance,
} from "@/api/scheduled-jobs";

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();

const loading = ref(true);
const job = ref<ScheduledJob | null>(null);
const instances = ref<ScheduledJobInstance[]>([]);
const instancesLoading = ref(false);
const acting = ref(false);

onMounted(async () => {
	const id = route.params["id"] as string;
	if (id) {
		await load(id);
	}
});

async function load(id: string) {
	loading.value = true;
	try {
		job.value = await scheduledJobsApi.get(id);
		await loadInstances(id);
	} catch {
		job.value = null;
	} finally {
		loading.value = false;
	}
}

async function loadInstances(jobId: string) {
	instancesLoading.value = true;
	try {
		const res = await scheduledJobsApi.listInstances({
			scheduledJobId: jobId,
			limit: 20,
		});
		instances.value = res.instances;
	} catch {
		instances.value = [];
	} finally {
		instancesLoading.value = false;
	}
}

async function fireNow() {
	if (!job.value) return;
	acting.value = true;
	try {
		await scheduledJobsApi.fire(job.value.id);
		toast.success("Fired", "Scheduled job fired");
		await loadInstances(job.value.id);
	} catch {
		// Global banner shown by apiFetch
	} finally {
		acting.value = false;
	}
}

async function pause() {
	if (!job.value) return;
	acting.value = true;
	try {
		job.value = await scheduledJobsApi.pause(job.value.id);
		toast.success("Paused", "Scheduled job paused");
	} catch {
		// Global banner shown by apiFetch
	} finally {
		acting.value = false;
	}
}

async function resume() {
	if (!job.value) return;
	acting.value = true;
	try {
		job.value = await scheduledJobsApi.resume(job.value.id);
		toast.success("Resumed", "Scheduled job resumed");
	} catch {
		// Global banner shown by apiFetch
	} finally {
		acting.value = false;
	}
}

function confirmArchive() {
	if (!job.value) return;
	confirm.require({
		message: "Archive this scheduled job? It can be restored later.",
		header: "Archive Scheduled Job",
		icon: "pi pi-exclamation-triangle",
		acceptLabel: "Archive",
		acceptClass: "p-button-warning",
		accept: archive,
	});
}

async function archive() {
	if (!job.value) return;
	acting.value = true;
	try {
		job.value = await scheduledJobsApi.archive(job.value.id);
		toast.success("Archived", "Scheduled job archived");
	} catch {
		// Global banner shown by apiFetch
	} finally {
		acting.value = false;
	}
}

function confirmDelete() {
	confirm.require({
		message: "Permanently delete this scheduled job? This cannot be undone.",
		header: "Delete Scheduled Job",
		icon: "pi pi-exclamation-triangle",
		acceptLabel: "Delete",
		acceptClass: "p-button-danger",
		accept: doDelete,
	});
}

async function doDelete() {
	if (!job.value) return;
	try {
		await scheduledJobsApi.delete(job.value.id);
		toast.success("Deleted", "Scheduled job deleted");
		router.push("/scheduled-jobs");
	} catch {
		// Global banner shown by apiFetch
	}
}

function statusSeverity(status: string): "success" | "warn" | "secondary" {
	switch (status) {
		case "ACTIVE":
			return "success";
		case "PAUSED":
			return "warn";
		default:
			return "secondary";
	}
}

function instanceStatusSeverity(
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

function onInstanceRowClick(event: { data: ScheduledJobInstance }) {
	viewInstance(event.data);
}
</script>

<template>
  <div class="page-container">
    <div v-if="loading" class="loading-container">
      <ProgressSpinner strokeWidth="3" />
    </div>

    <template v-else-if="job">
      <header class="page-header">
        <Button
          icon="pi pi-arrow-left"
          text
          severity="secondary"
          @click="router.push('/scheduled-jobs')"
          v-tooltip="'Back to list'"
        />
        <div class="header-text">
          <h1 class="page-title">{{ job.name }}</h1>
          <code class="app-code">{{ job.code }}</code>
        </div>
        <Tag :value="job.status" :severity="statusSeverity(job.status)" />
      </header>

      <!-- Details -->
      <div class="section-card">
        <div class="card-header">
          <h3>Job Details</h3>
        </div>
        <div class="card-content detail-grid">
          <div class="detail-item">
            <label>Code</label>
            <code>{{ job.code }}</code>
          </div>
          <div class="detail-item">
            <label>Scope</label>
            <span v-if="job.clientId">{{ job.clientId }}</span>
            <span v-else class="text-muted">Platform</span>
          </div>
          <div class="detail-item">
            <label>Crons</label>
            <code v-for="c in job.crons" :key="c" class="cron-pill">{{ c }}</code>
          </div>
          <div class="detail-item">
            <label>Timezone</label>
            <span>{{ job.timezone }}</span>
          </div>
          <div class="detail-item">
            <label>Concurrent</label>
            <span>{{ job.concurrent ? "Yes" : "No" }}</span>
          </div>
          <div class="detail-item">
            <label>Tracks Completion</label>
            <span>{{ job.tracksCompletion ? "Yes" : "No" }}</span>
          </div>
          <div class="detail-item">
            <label>Timeout</label>
            <span>{{ job.timeoutSeconds ? `${job.timeoutSeconds}s` : "—" }}</span>
          </div>
          <div class="detail-item">
            <label>Delivery Max Attempts</label>
            <span>{{ job.deliveryMaxAttempts }}</span>
          </div>
          <div class="detail-item full-width">
            <label>Target URL</label>
            <code v-if="job.targetUrl">{{ job.targetUrl }}</code>
            <span v-else class="text-muted">—</span>
          </div>
          <div class="detail-item full-width">
            <label>Description</label>
            <span>{{ job.description || "—" }}</span>
          </div>
          <div class="detail-item">
            <label>Last Fired</label>
            <span>{{ formatDate(job.lastFiredAt) }}</span>
          </div>
          <div class="detail-item">
            <label>Created</label>
            <span>{{ formatDate(job.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="section-card">
        <div class="card-header">
          <h3>Actions</h3>
        </div>
        <div class="card-content actions-row">
          <Button
            label="Fire Now"
            icon="pi pi-bolt"
            :loading="acting"
            :disabled="job.status === 'ARCHIVED'"
            @click="fireNow"
          />
          <Button
            v-if="job.status === 'ACTIVE'"
            label="Pause"
            icon="pi pi-pause"
            severity="warn"
            outlined
            :loading="acting"
            @click="pause"
          />
          <Button
            v-else-if="job.status === 'PAUSED'"
            label="Resume"
            icon="pi pi-play"
            severity="success"
            outlined
            :loading="acting"
            @click="resume"
          />
          <Button
            v-if="job.status !== 'ARCHIVED'"
            label="Archive"
            icon="pi pi-box"
            severity="warn"
            outlined
            :loading="acting"
            @click="confirmArchive"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDelete"
          />
        </div>
      </div>

      <!-- Recent Instances -->
      <div class="section-card">
        <div class="card-header">
          <h3>Recent Instances</h3>
          <Button
            label="View All"
            icon="pi pi-list"
            text
            @click="router.push(`/scheduled-jobs/${job!.id}/instances`)"
          />
        </div>
        <div class="card-content">
          <DataTable
            :value="instances"
            :loading="instancesLoading"
            data-key="id"
            row-hover
            striped-rows
            emptyMessage="No instances yet"
            @row-click="onInstanceRowClick"
          >
            <Column header="Fired At" field="firedAt" style="width: 30%">
              <template #body="{ data }">
                <span class="text-sm">{{ formatDate(data.firedAt) }}</span>
              </template>
            </Column>
            <Column header="Trigger" field="triggerKind" style="width: 12%" />
            <Column header="Status" style="width: 14%">
              <template #body="{ data }">
                <Tag
                  :value="data.status"
                  :severity="instanceStatusSeverity(data.status)"
                />
              </template>
            </Column>
            <Column header="Attempts" field="deliveryAttempts" style="width: 10%" />
            <Column header="Completed At" style="width: 24%">
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

    <Message v-else severity="error">Scheduled job not found</Message>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.header-text {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

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
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  padding: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
}

.cron-pill {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 4px;
}

.actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.text-muted { color: #94a3b8; }
.text-sm { font-size: 0.875rem; }
</style>
