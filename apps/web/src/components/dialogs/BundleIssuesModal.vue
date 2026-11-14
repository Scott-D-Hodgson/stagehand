<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  closeLabel: string;
  issues: string[];
  message: string;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const modalElement = ref<HTMLElement>();
let modal: BootstrapModal | undefined;

/*
Closes the bundle-validation dialog after the author acknowledges its messages.
---
Inputs: The close button or dialog close control.
---
Output: The Bootstrap dialog begins its closing transition.
*/
function close(): void {
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('hidden.bs.modal', () => emit('close'), { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="bundle-issues-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="bundle-issues-heading" class="h5 modal-title">{{ props.title }}</h2>
          <button class="btn-close" type="button" :aria-label="props.closeLabel" @click="close"></button>
        </div>
        <div class="modal-body">
          <p>{{ props.message }}</p>
          <ul class="mb-0">
            <li v-for="issue in props.issues" :key="issue">{{ issue }}</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="button" @click="close">{{ props.closeLabel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
