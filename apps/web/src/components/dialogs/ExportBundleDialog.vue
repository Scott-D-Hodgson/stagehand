<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { normalizePortableBundleFilename } from '../../portable-bundle/export';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  suggestedFilename: string;
}>();

const emit = defineEmits<{
  close: [];
  download: [filename: string];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const filenameInput = ref<HTMLInputElement>();
const filename = ref(props.suggestedFilename);
const filenameBlurred = ref(false);
const normalizedFilename = computed(() => normalizePortableBundleFilename(filename.value));
let modal: BootstrapModal | undefined;
let closing = false;
let pendingFilename: string | undefined;

/*
Closes the export dialog without requesting a browser download.
---
Inputs: A close or cancel interaction.
---
Output: A hidden dialog and close event.
*/
function cancel(): void {
  closing = true;
  modal?.hide();
}

/*
Marks the dialog as closing before a close-control interaction blurs the field.
---
Inputs: A close-button mouse-down interaction.
---
Output: Suppressed close-induced filename validation.
*/
function prepareToClose(): void {
  closing = true;
}

/*
Shows filename validation after the field loses focus while the dialog is open.
---
Inputs: A filename-input blur event.
---
Output: Visible filename feedback when the field is empty.
*/
function reportFilenameBlur(): void {
  if (!closing) {
    filenameBlurred.value = true;
  }
}

/*
Confirms a valid filename and closes the dialog before starting the download.
---
Inputs: The export-dialog form submission.
---
Output: A download event after the Bootstrap closing transition.
*/
function download(): void {
  if (normalizedFilename.value === undefined) {
    filenameBlurred.value = true;
    return;
  }
  pendingFilename = normalizedFilename.value;
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => filenameInput.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hide.bs.modal', () => { closing = true; }, { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => {
    if (pendingFilename === undefined) {
      emit('close');
      return;
    }
    emit('download', pendingFilename);
  }, { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="export-bundle-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" novalidate @submit.prevent="download">
        <div class="modal-header">
          <h2 id="export-bundle-heading" class="h5 modal-title">{{ t('editor.exportPlan') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="export-filename">{{ t('editor.filename') }}</label>
          <input id="export-filename" ref="filenameInput" v-model="filename" class="form-control" :class="{ 'is-invalid': filenameBlurred && normalizedFilename === undefined }" required @blur="reportFilenameBlur" />
          <div class="form-text">{{ t('editor.exportFilenameHelp') }}</div>
          <div v-if="filenameBlurred && normalizedFilename === undefined" class="invalid-feedback d-block">{{ t('editor.filenameRequired') }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @mousedown="prepareToClose" @click.prevent="cancel">{{ t('editor.cancel') }}</button>
          <button class="btn btn-secondary" type="submit">{{ t('editor.download') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
