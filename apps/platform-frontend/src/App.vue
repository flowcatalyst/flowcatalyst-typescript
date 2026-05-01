<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { onApiError } from "@/api/client";
import { usePermissionsStore } from "@/stores/permissions";
import NotificationBannerStack from "@/components/NotificationBannerStack.vue";

const permissionsStore = usePermissionsStore();

let unsubscribe: (() => void) | null = null;

onMounted(() => {
	// Listen for 401/403 API errors globally
	unsubscribe = onApiError((status, message) => {
		permissionsStore.handleApiError(status, message);
	});
});

onUnmounted(() => {
	if (unsubscribe) {
		unsubscribe();
	}
});
</script>

<template>
  <RouterView />
  <ConfirmDialog />
  <NotificationBannerStack />
  <PermissionDeniedModal />
</template>
