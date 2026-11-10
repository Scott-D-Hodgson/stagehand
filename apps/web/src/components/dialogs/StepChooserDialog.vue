<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const emit = defineEmits<{
  choose: [action: 'click' | 'navigate'];
  close: [];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const navigateButton = ref<HTMLButtonElement>();
let modal: BootstrapModal | undefined;
let selectedAction: 'click' | 'navigate' | undefined;

/*
Closes the chooser after recording the selected step action.
---
Inputs: The selected action type.
---
Output: A hidden chooser followed by a selection event.
*/
function choose(action: 'click' | 'navigate'): void {
  selectedAction = action;
  modal?.hide();
}

/*
Closes the chooser without selecting a step action.
---
Inputs: A close or cancel interaction.
---
Output: A hidden chooser and close event.
*/
function cancel(): void {
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => navigateButton.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => {
    if (selectedAction === undefined) {
      emit('close');
      return;
    }
    emit('choose', selectedAction);
  }, { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="step-chooser-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="step-chooser-heading" class="h5 modal-title">{{ t('editor.addStep') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @click="cancel"></button>
        </div>
        <div class="modal-body">
          <div class="d-grid gap-2">
            <button ref="navigateButton" class="btn btn-outline-primary" type="button" @click="choose('navigate')">{{ t('editor.navigate') }}</button>
            <button class="btn btn-outline-primary" type="button" @click="choose('click')">{{ t('editor.click') }}</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="cancel">{{ t('editor.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
