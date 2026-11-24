<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { VariableKind } from './VariableDialog.vue';

interface BootstrapModal { dispose(): void; hide(): void; show(): void; }

const emit = defineEmits<{ choose: [kind: VariableKind]; close: []; }>();
const { t } = useTranslation();
const dialogElement = ref<HTMLElement>();
const textButton = ref<HTMLButtonElement>();
let modal: BootstrapModal | undefined;
let selectedKind: VariableKind | undefined;

/*
Closes the chooser after recording the selected variable type.
---
Inputs: The selected variable type.
---
Output: A hidden chooser followed by a selection event.
*/
function choose(kind: VariableKind): void {
  selectedKind = kind;
  modal?.hide();
}

/*
Closes the chooser without selecting a variable type.
---
Inputs: A close or cancel interaction.
---
Output: A hidden chooser and close event.
*/
function cancel(): void {
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(dialogElement.value!, { backdrop: 'static' });
  dialogElement.value?.addEventListener('shown.bs.modal', () => textButton.value?.focus(), { once: true });
  dialogElement.value?.addEventListener('hidden.bs.modal', () => selectedKind === undefined ? emit('close') : emit('choose', selectedKind), { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div
    ref="dialogElement"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="variable-chooser-heading"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered"
    >
      <div
        class="modal-content"
      >
        <div
          class="modal-header"
        >
          <h2
            id="variable-chooser-heading"
            class="h5 modal-title"
          >{{ t('editor.addVariable') }}</h2>
          <button
            class="btn-close"
            type="button"
            :aria-label="t('editor.close')"
            @click="cancel"
          ></button>
        </div>
        <div
          class="modal-body"
        >
          <div
            class="d-grid gap-2"
          >
            <button
              ref="textButton"
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('text')"
            >{{ t('editor.variableTypeText') }}</button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('number')"
            >{{ t('editor.variableTypeNumber') }}</button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('boolean')"
            >{{ t('editor.variableTypeBoolean') }}</button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('environment')"
            >{{ t('editor.variableTypeEnvironment') }}</button>
          </div>
        </div>
        <div
          class="modal-footer"
        >
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="cancel"
          >{{ t('editor.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
