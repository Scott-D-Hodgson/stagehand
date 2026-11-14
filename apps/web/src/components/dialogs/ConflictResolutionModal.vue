<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  discardLabel: string;
  message: string;
  replaceLabel: string;
  title: string;
}>();

const emit = defineEmits<{
  discard: [];
  replace: [];
}>();

const discardButton = ref<HTMLButtonElement>();
const modalElement = ref<HTMLElement>();
let modal: BootstrapModal | undefined;
let pendingAction: 'discard' | 'replace' | undefined;

/*
Records a discard choice and closes the conflict-resolution modal.
---
Inputs: A request to discard the current tab's paused edits.
---
Output: A hidden modal followed by a discard event.
*/
function discard(): void {
  pendingAction = 'discard';
  modal?.hide();
}

/*
Records a replacement choice and closes the conflict-resolution modal.
---
Inputs: A request to replace the newer saved draft with paused local edits.
---
Output: A hidden modal followed by a replace event.
*/
function replace(): void {
  pendingAction = 'replace';
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static'; keyboard?: false }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static', keyboard: false });
  modalElement.value?.addEventListener('shown.bs.modal', () => discardButton.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => {
    if (pendingAction === 'discard') {
      emit('discard');
      return;
    }
    if (pendingAction === 'replace') {
      emit('replace');
    }
  }, { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="conflict-resolution-heading" aria-describedby="conflict-resolution-message" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="conflict-resolution-heading" class="h5 modal-title">{{ props.title }}</h2>
        </div>
        <div class="modal-body">
          <p id="conflict-resolution-message" class="mb-0">{{ props.message }}</p>
        </div>
        <div class="modal-footer">
          <button ref="discardButton" class="btn btn-secondary" type="button" @click="discard">{{ props.discardLabel }}</button>
          <button class="btn btn-warning" type="button" @click="replace">{{ props.replaceLabel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
