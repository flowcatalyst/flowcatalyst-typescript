<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import {
	deletePasskey,
	listPasskeys,
	registerPasskey,
	type PasskeySummary,
} from "@/api/webauthn";

const passkeys = ref<PasskeySummary[]>([]);
const loading = ref(true);
const registering = ref(false);
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);
const newName = ref("");

const browserSupported = computed(() => browserSupportsWebAuthn());

async function load() {
	loading.value = true;
	try {
		passkeys.value = await listPasskeys();
	} catch (err) {
		errorMsg.value =
			err instanceof Error ? err.message : "failed to load passkeys";
	} finally {
		loading.value = false;
	}
}

async function onRegister() {
	errorMsg.value = null;
	successMsg.value = null;
	registering.value = true;
	try {
		await registerPasskey({ name: newName.value.trim() || undefined });
		successMsg.value = "Passkey added.";
		newName.value = "";
		await load();
	} catch (err) {
		errorMsg.value =
			err instanceof Error ? err.message : "passkey registration failed";
	} finally {
		registering.value = false;
	}
}

async function onRevoke(id: string) {
	errorMsg.value = null;
	successMsg.value = null;
	try {
		await deletePasskey(id);
		successMsg.value = "Passkey revoked.";
		await load();
	} catch (err) {
		errorMsg.value =
			err instanceof Error ? err.message : "failed to revoke passkey";
	}
}

function fmt(d: string | null): string {
	if (!d) return "—";
	return new Date(d).toLocaleString();
}

onMounted(load);
</script>

<template>
  <div class="fc-card">
    <h2 class="section-title">Passkeys</h2>
    <p class="section-help">
      Sign in with your device biometrics or a hardware security key. Passkeys
      are only available for accounts authenticated locally — federated
      accounts (e.g. Entra) sign in through your identity provider.
    </p>

    <div v-if="!browserSupported" class="banner banner-warn">
      Your browser does not support WebAuthn. Try a recent Chrome, Firefox,
      Safari, or Edge.
    </div>

    <div v-if="errorMsg" class="banner banner-error">{{ errorMsg }}</div>
    <div v-if="successMsg" class="banner banner-ok">{{ successMsg }}</div>

    <div v-if="loading" class="muted">Loading…</div>
    <div v-else-if="passkeys.length === 0" class="muted">
      No passkeys registered yet.
    </div>
    <ul v-else class="passkey-list">
      <li v-for="pk in passkeys" :key="pk.id" class="passkey-row">
        <div class="passkey-info">
          <div class="passkey-name">{{ pk.name || "Unnamed passkey" }}</div>
          <div class="passkey-meta">
            Added {{ fmt(pk.createdAt) }}
            <span v-if="pk.lastUsedAt"> • Last used {{ fmt(pk.lastUsedAt) }}</span>
          </div>
        </div>
        <Button
          label="Revoke"
          severity="danger"
          outlined
          size="small"
          :disabled="!browserSupported"
          @click="onRevoke(pk.id)"
        />
      </li>
    </ul>

    <div class="add-row" v-if="browserSupported">
      <InputText
        v-model="newName"
        placeholder="Name this passkey (e.g. iPhone, YubiKey)"
        class="add-input"
      />
      <Button
        label="Add passkey"
        icon="pi pi-key"
        :loading="registering"
        @click="onRegister"
      />
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #243b53;
  margin: 0 0 8px;
}
.section-help {
  font-size: 13px;
  color: #486581;
  margin: 0 0 16px;
}
.banner {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 12px;
}
.banner-warn {
  background: #fff8e1;
  color: #7c5e00;
}
.banner-error {
  background: #fde8e8;
  color: #9b1c1c;
}
.banner-ok {
  background: #e6f4ea;
  color: #1b5e20;
}
.muted {
  color: #829ab1;
  font-size: 14px;
  padding: 12px 0;
}
.passkey-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.passkey-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f4f8;
}
.passkey-row:last-child {
  border-bottom: none;
}
.passkey-info {
  flex: 1;
  min-width: 0;
}
.passkey-name {
  font-weight: 500;
  color: #243b53;
  font-size: 14px;
}
.passkey-meta {
  color: #829ab1;
  font-size: 12px;
}
.add-row {
  display: flex;
  gap: 8px;
}
.add-input {
  flex: 1;
}
</style>
