<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

export type WaitType = 'delay' | 'locator' | 'state';

const emit = defineEmits<{ choose: [type: WaitType]; close: [] }>();
const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const locatorButton = ref<HTMLButtonElement>();
let modal: BootstrapModal | undefined;
let selectedType: WaitType | undefined;

/*
Closes the chooser after recording the selected wait type.
---
Inputs: A contract-supported wait type.
---
Output: A hidden chooser followed by a type-selection event.
*/
function choose(type: WaitType): void {
  selectedType = type;
  modal?.hide();
}

/*
Closes the chooser without selecting a wait type.
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
  modalElement.value?.addEventListener('shown.bs.modal', () => locatorButton.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => {
    if (selectedType === undefined) {
      emit('close');
      return;
    }
    emit('choose', selectedType);
  }, { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div
    ref="modalElement"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="wait-chooser-heading"
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
            id="wait-chooser-heading"
            class="h5 modal-title"
          >{{ t('editor.addWait') }}</h2>
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
              ref="locatorButton"
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('locator')"
            >{{ t('editor.waitForLocator') }}</button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('state')"
            >{{ t('editor.waitForState') }}</button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="choose('delay')"
            >{{ t('editor.waitForDelay') }}</button>
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
