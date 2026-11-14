<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { ValidationIssue } from '@stagehand/plan-schema';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  url: string;
  validationIssues: ValidationIssue[];
  validationVisible: boolean;
}>();

const emit = defineEmits<{
  blur: [];
  close: [];
  reset: [];
  save: [];
  'update:url': [url: string];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const urlInput = ref<HTMLInputElement>();
let modal: BootstrapModal | undefined;
let closing = false;

/*
Closes the Navigate-step dialog without saving its fields.
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
Marks the dialog as closing before a button press blurs the URL field.
---
Inputs: A close-button mouse-down interaction.
---
Output: Suppressed close-induced URL validation.
*/
function prepareToClose(): void {
  closing = true;
}

/*
Reports a URL-field blur unless the dialog is currently closing.
---
Inputs: A URL input blur.
---
Output: Validation feedback only while the dialog remains open.
*/
function reportUrlBlur(): void {
  if (!closing) {
    emit('blur');
  }
}

/*
Saves a valid Navigate step before closing the Bootstrap modal.
---
Inputs: A Navigate-step form submission.
---
Output: Validation feedback or a saved step followed by a hidden dialog.
*/
function save(): void {
  if (props.validationIssues.length > 0) {
    emit('blur');
    return;
  }
  emit('save');
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => urlInput.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hide.bs.modal', () => { closing = true; }, { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => emit('close'), { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="navigate-step-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h2 id="navigate-step-heading" class="h5 modal-title">{{ t('editor.navigate') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="navigate-url">{{ t('editor.navigateUrl') }}</label>
          <input
            id="navigate-url"
            ref="urlInput"
            :value="props.url"
            class="form-control"
            :class="{ 'is-invalid': props.validationVisible && props.validationIssues.length > 0 }"
            placeholder="https://example.com"
            required
            @blur="reportUrlBlur"
            @input="emit('update:url', ($event.target as HTMLInputElement).value)"
          />
          <div class="form-text">{{ t('editor.navigateUrlHelp') }}</div>
          <div v-if="props.validationVisible" class="invalid-feedback d-block">
            <div v-for="issue in props.validationIssues" :key="issue.path + issue.message">{{ issue.message }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="emit('reset')">{{ t('editor.reset') }}</button>
          <button class="btn btn-secondary" type="button" @mousedown="prepareToClose" @click.prevent="cancel">{{ t('editor.cancel') }}</button>
          <button class="btn btn-secondary" type="submit">{{ t('editor.save') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
