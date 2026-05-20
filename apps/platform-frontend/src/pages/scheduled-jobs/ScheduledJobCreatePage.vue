<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/utils/errorBus";
import { scheduledJobsApi } from "@/api/scheduled-jobs";

const router = useRouter();

const code = ref("");
const name = ref("");
const description = ref("");
const timezone = ref("UTC");
const cronInput = ref("");
const crons = ref<string[]>([]);
const concurrent = ref(false);
const tracksCompletion = ref(false);
const timeoutSeconds = ref<number | null>(null);
const deliveryMaxAttempts = ref<number | null>(null);
const targetUrl = ref("");
const payloadText = ref("");
const submitting = ref(false);

function addCron() {
	const cron = cronInput.value.trim();
	if (!cron) return;
	if (crons.value.includes(cron)) return;
	crons.value.push(cron);
	cronInput.value = "";
}

function removeCron(cron: string) {
	crons.value = crons.value.filter((c) => c !== cron);
}

async function submit() {
	if (!code.value.trim() || !name.value.trim()) {
		toast.error("Validation", "Code and name are required");
		return;
	}
	if (crons.value.length === 0) {
		toast.error("Validation", "At least one cron expression is required");
		return;
	}

	let payload: unknown;
	if (payloadText.value.trim()) {
		try {
			payload = JSON.parse(payloadText.value);
		} catch {
			toast.error("Validation", "Payload must be valid JSON");
			return;
		}
	}

	submitting.value = true;
	try {
		const result = await scheduledJobsApi.create({
			code: code.value.trim(),
			name: name.value.trim(),
			description: description.value.trim() || undefined,
			crons: [...crons.value],
			timezone: timezone.value.trim() || undefined,
			...(payload !== undefined ? { payload } : {}),
			concurrent: concurrent.value,
			tracksCompletion: tracksCompletion.value,
			...(timeoutSeconds.value ? { timeoutSeconds: timeoutSeconds.value } : {}),
			...(deliveryMaxAttempts.value
				? { deliveryMaxAttempts: deliveryMaxAttempts.value }
				: {}),
			...(targetUrl.value.trim() ? { targetUrl: targetUrl.value.trim() } : {}),
		});
		toast.success("Created", "Scheduled job created");
		router.push(`/scheduled-jobs/${result.id}`);
	} catch {
		// Global banner shown by apiFetch
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <Button
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        @click="router.push('/scheduled-jobs')"
        v-tooltip="'Back to list'"
      />
      <h1 class="page-title">New Scheduled Job</h1>
    </header>

    <div class="section-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Code <span class="required">*</span></label>
          <InputText v-model="code" placeholder="my-job-code" class="full-width" />
        </div>
        <div class="form-field">
          <label>Name <span class="required">*</span></label>
          <InputText v-model="name" placeholder="My scheduled job" class="full-width" />
        </div>
        <div class="form-field full-width">
          <label>Description</label>
          <Textarea v-model="description" :rows="2" class="full-width" />
        </div>

        <div class="form-field full-width">
          <label>Cron Expressions <span class="required">*</span></label>
          <div class="cron-row">
            <InputText
              v-model="cronInput"
              placeholder="0 */15 * * * *  (e.g. every 15 min)"
              class="full-width"
              @keyup.enter="addCron"
            />
            <Button
              icon="pi pi-plus"
              severity="secondary"
              @click="addCron"
              :disabled="!cronInput.trim()"
            />
          </div>
          <div v-if="crons.length > 0" class="chip-list">
            <Chip
              v-for="cron in crons"
              :key="cron"
              :label="cron"
              removable
              @remove="removeCron(cron)"
            />
          </div>
        </div>

        <div class="form-field">
          <label>Timezone</label>
          <InputText v-model="timezone" placeholder="UTC" class="full-width" />
        </div>
        <div class="form-field">
          <label>Target URL</label>
          <InputText
            v-model="targetUrl"
            placeholder="https://app.example.com/jobs/handler"
            class="full-width"
          />
        </div>

        <div class="form-field">
          <label>Timeout (seconds)</label>
          <InputNumber v-model="timeoutSeconds" :min="1" class="full-width" />
        </div>
        <div class="form-field">
          <label>Delivery Max Attempts</label>
          <InputNumber v-model="deliveryMaxAttempts" :min="1" class="full-width" />
        </div>

        <div class="form-field">
          <label class="checkbox-row">
            <Checkbox v-model="concurrent" :binary="true" />
            <span>Allow concurrent fires</span>
          </label>
          <p class="help-text">
            Permit a new fire even if a previous instance is still running.
          </p>
        </div>
        <div class="form-field">
          <label class="checkbox-row">
            <Checkbox v-model="tracksCompletion" :binary="true" />
            <span>Track completion</span>
          </label>
          <p class="help-text">
            Wait for the handler to mark instances complete (vs fire-and-forget).
          </p>
        </div>

        <div class="form-field full-width">
          <label>Payload (JSON, optional)</label>
          <Textarea
            v-model="payloadText"
            :rows="4"
            class="full-width font-mono"
            placeholder='{"some": "data"}'
          />
        </div>
      </div>

      <div class="form-actions">
        <Button
          label="Cancel"
          severity="secondary"
          outlined
          @click="router.push('/scheduled-jobs')"
        />
        <Button label="Create" :loading="submitting" @click="submit" />
      </div>
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

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.section-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  max-width: 900px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field.full-width,
.form-grid > .full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 500;
  font-size: 13px;
}

.required {
  color: #dc2626;
}

.full-width {
  width: 100%;
}

.cron-row {
  display: flex;
  gap: 8px;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-text {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.font-mono :deep(textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}
</style>
