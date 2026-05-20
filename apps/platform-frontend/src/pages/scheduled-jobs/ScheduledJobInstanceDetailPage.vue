<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
	scheduledJobsApi,
	type ScheduledJobInstance,
	type ScheduledJobInstanceLog,
} from "@/api/scheduled-jobs";

const route = useRoute();
const router = useRouter();

const instanceId = route.params["instanceId"] as string;
const instance = ref<ScheduledJobInstance | null>(null);
const logs = ref<ScheduledJobInstanceLog[]>([]);
const loading = ref(true);

onMounted(async () => {
	await Promise.all([loadInstance(), loadLogs()]);
});

async function loadInstance() {
	try {
		instance.value = await scheduledJobsApi.getInstance(instanceId);
	} catch {
		instance.value = null;
	} finally {
		loading.value = false;
	}
}

async function loadLogs() {
	try {
		const res = await scheduledJobsApi.listInstanceLogs(instanceId);
		logs.value = res.logs;
	} catch {
		logs.value = [];
	}
}

const formattedCompletionResult = computed(() => {
	if (!instance.value?.completionResult) return null;
	try {
		return JSON.stringify(instance.value.completionResult, null, 2);
	} catch {
		return String(instance.value.completionResult);
	}
});

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

function logSeverity(level: string): "secondary" | "info" | "warn" | "danger" {
	switch (level) {
		case "ERROR":
			return "danger";
		case "WARN":
			return "warn";
		case "INFO":
			return "info";
		default:
			return "secondary";
	}
}

function formatDate(s?: string | null): string {
	if (!s) return "—";
	return new Date(s).toLocaleString();
}
</script>

<template>
  <div class="page-container">
    <div v-if="loading" class="loading-container">
      <ProgressSpinner strokeWidth="3" />
    </div>

    <template v-else-if="instance">
      <header class="page-header">
        <Button
          icon="pi pi-arrow-left"
          text
          severity="secondary"
          @click="router.push(`/scheduled-jobs/${instance.scheduledJobId}`)"
          v-tooltip="'Back to job'"
        />
        <div class="header-text">
          <h1 class="page-title">Instance</h1>
          <code class="app-code">{{ instance.id }}</code>
        </div>
        <Tag
          :value="instance.status"
          :severity="statusSeverity(instance.status)"
        />
      </header>

      <div class="section-card">
        <div class="card-header"><h3>Instance Details</h3></div>
        <div class="card-content detail-grid">
          <div class="detail-item">
            <label>Job</label>
            <code>{{ instance.jobCode }}</code>
          </div>
          <div class="detail-item">
            <label>Trigger</label>
            <span>{{ instance.triggerKind }}</span>
          </div>
          <div class="detail-item">
            <label>Scheduled For</label>
            <span>{{ formatDate(instance.scheduledFor) }}</span>
          </div>
          <div class="detail-item">
            <label>Fired At</label>
            <span>{{ formatDate(instance.firedAt) }}</span>
          </div>
          <div class="detail-item">
            <label>Delivered At</label>
            <span>{{ formatDate(instance.deliveredAt) }}</span>
          </div>
          <div class="detail-item">
            <label>Completed At</label>
            <span>{{ formatDate(instance.completedAt) }}</span>
          </div>
          <div class="detail-item">
            <label>Delivery Attempts</label>
            <span>{{ instance.deliveryAttempts }}</span>
          </div>
          <div class="detail-item">
            <label>Completion Status</label>
            <span>{{ instance.completionStatus || "—" }}</span>
          </div>
          <div class="detail-item">
            <label>Correlation ID</label>
            <code v-if="instance.correlationId">{{ instance.correlationId }}</code>
            <span v-else class="text-muted">—</span>
          </div>
          <div class="detail-item">
            <label>Client</label>
            <span v-if="instance.clientId">{{ instance.clientId }}</span>
            <span v-else class="text-muted">Platform</span>
          </div>
          <div v-if="instance.deliveryError" class="detail-item full-width">
            <label>Delivery Error</label>
            <pre class="error-block">{{ instance.deliveryError }}</pre>
          </div>
          <div v-if="formattedCompletionResult" class="detail-item full-width">
            <label>Completion Result</label>
            <pre class="json-block">{{ formattedCompletionResult }}</pre>
          </div>
        </div>
      </div>

      <!-- Logs -->
      <div class="section-card">
        <div class="card-header">
          <h3>Logs</h3>
          <span class="text-muted text-sm">{{ logs.length }} entries</span>
        </div>
        <div class="card-content">
          <div v-if="logs.length === 0" class="empty">No log entries</div>
          <div v-else class="log-list">
            <div v-for="log in logs" :key="log.id" class="log-row">
              <Tag :value="log.level" :severity="logSeverity(log.level)" />
              <span class="log-time">{{ formatDate(log.createdAt) }}</span>
              <span class="log-msg">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <Message v-else severity="error">Instance not found</Message>
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

.header-text { flex: 1; }
.page-title { margin: 0; font-size: 24px; font-weight: 600; }
.app-code {
  display: inline-block;
  margin-top: 4px;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #475569;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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

.card-header h3 { margin: 0; font-size: 16px; font-weight: 600; }

.card-content { padding: 20px; }

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

.detail-item.full-width { grid-column: 1 / -1; }

.detail-item label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
}

.text-muted { color: #94a3b8; }
.text-sm { font-size: 0.875rem; }

.empty {
  text-align: center;
  padding: 32px;
  color: #94a3b8;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-row {
  display: grid;
  grid-template-columns: 70px 180px 1fr;
  gap: 8px;
  align-items: start;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 4px;
  font-size: 0.875rem;
}

.log-time {
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
}

.log-msg {
  white-space: pre-wrap;
  word-break: break-word;
}

.error-block,
.json-block {
  margin: 0;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-block { color: #dc2626; }
</style>
