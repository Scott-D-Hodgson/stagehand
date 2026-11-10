<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  cancelLabel: string;
  confirmLabel: string;
  message: string;
  title: string;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const modalElement = ref<HTMLElement>();
let modal: BootstrapModal | undefined;
let pendingAction: 'cancel' | 'confirm' = 'cancel';

/*
Closes the modal and records that its action was cancelled.
---
Inputs: A close, backdrop, or cancel-button interaction.
---
Output: A cancellation event for the owning component.
*/
function cancel(): void {
  pendingAction = 'cancel';
  modal?.hide();
}

/*
Closes the modal and records that its action was confirmed.
---
Inputs: A confirmation-button interaction.
---
Output: A confirmation event for the owning component.
*/
function confirm(): void {
  pendingAction = 'confirm';
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('hidden.bs.modal', () => {
    if (pendingAction === 'confirm') {
      emit('confirm');
      return;
    }
    emit('cancel');
  }, { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="confirmation-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="confirmation-heading" class="h5 modal-title">{{ props.title }}</h2>
          <button class="btn-close" type="button" :aria-label="props.cancelLabel" @click="cancel"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ props.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="cancel">{{ props.cancelLabel }}</button>
          <button class="btn btn-danger" type="button" @click="confirm">{{ props.confirmLabel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
