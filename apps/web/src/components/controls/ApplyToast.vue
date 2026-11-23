<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

interface BootstrapToast {
  dispose(): void;
  hide(): void;
  show(): void;
}

const emit = defineEmits<{ close: [] }>();
const { t } = useTranslation();
const toastElement = ref<HTMLElement>();
let toast: BootstrapToast | undefined;

/*
Closes the applied-changes toast before its automatic dismissal.
---
Inputs: A close-button interaction.
---
Output: A hidden toast and a close event for its owner.
*/
function close(): void {
  toast?.hide();
}

onMounted(() => {
  toast = new (window as unknown as Window & { bootstrap: { Toast: new (element: HTMLElement, options?: { autohide?: boolean; delay?: number }) => BootstrapToast } }).bootstrap.Toast(toastElement.value!, { autohide: true, delay: 3_000 });
  toastElement.value?.addEventListener('hidden.bs.toast', () => emit('close'), { once: true });
  toast.show();
});
onBeforeUnmount(() => toast?.dispose());
</script>

<template>
  <div
    class="toast-container position-fixed bottom-0 end-0 p-3"
  >
    <div
      ref="toastElement"
      class="toast align-items-center text-bg-success border-0"
      role="status"
      aria-atomic="true"
      aria-live="polite"
    >
      <div
        class="d-flex"
      >
        <div
          class="toast-body"
        >{{ t('editor.changesApplied') }}</div>
        <button
          class="btn-close btn-close-white me-2 m-auto"
          type="button"
          :aria-label="t('editor.close')"
          @click="close"
        ></button>
      </div>
    </div>
  </div>
</template>
