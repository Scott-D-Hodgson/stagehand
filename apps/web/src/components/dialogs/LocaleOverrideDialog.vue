<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import localeCatalogue from '../../localization/locale-catalogue.json';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  locale: string;
  multiline?: boolean;
  unavailableLocales: readonly string[];
  value: string;
  valueLabel: string;
  valueValidationMessage: string;
}>();

const emit = defineEmits<{
  close: [];
  reset: [];
  save: [];
  'update:locale': [locale: string];
  'update:value': [value: string];
}>();

const { t } = useTranslation();
const localeInput = ref<HTMLSelectElement>();
const modalElement = ref<HTMLElement>();
const valueInput = ref<HTMLInputElement | HTMLTextAreaElement>();
let modal: BootstrapModal | undefined;
let closing = false;
const localeValidationVisible = ref(false);
const valueValidationVisible = ref(false);

/*
Closes the locale-override dialog without saving its fields.
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
Marks the dialog as closing before a button press blurs an input.
---
Inputs: A close-button mouse-down interaction.
---
Output: Suppressed close-induced validation.
*/
function prepareToClose(): void {
  closing = true;
}

/*
Reveals locale feedback after the locale select loses focus.
---
Inputs: A locale-select blur interaction.
---
Output: Visible locale validation feedback when needed.
*/
function reportLocaleBlur(): void {
  if (!closing) {
    localeValidationVisible.value = true;
  }
}

/*
Reveals expected-text feedback after the value input loses focus.
---
Inputs: An expected-text input blur interaction.
---
Output: Visible expected-text validation feedback when needed.
*/
function reportValueBlur(): void {
  if (!closing) {
    valueValidationVisible.value = true;
  }
}

/*
Determines whether another override already uses a catalogue locale.
---
Inputs: One catalogue locale code.
---
Output: Whether the option must be unavailable.
*/
function isLocaleUnavailable(locale: string): boolean {
  return props.locale !== locale && props.unavailableLocales.includes(locale);
}

/*
Resets locale-override fields and their visible validation.
---
Inputs: A Reset action in the locale-override dialog.
---
Output: Empty fields with hidden locale feedback.
*/
function reset(): void {
  localeValidationVisible.value = false;
  valueValidationVisible.value = false;
  emit('reset');
}

/*
Saves a locale override after a locale has been selected.
---
Inputs: The current locale-override dialog state.
---
Output: A saved override followed by a hidden dialog, or visible field feedback.
*/
function save(): void {
  const localeIsInvalid = !props.locale;
  const valueIsInvalid = props.value.trim().length === 0;
  localeValidationVisible.value = localeIsInvalid;
  valueValidationVisible.value = valueIsInvalid;
  if (localeIsInvalid || valueIsInvalid) {
    if (localeIsInvalid) {
      localeInput.value?.focus();
      return;
    }
    valueInput.value?.focus();
    return;
  }
  emit('save');
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => localeInput.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hide.bs.modal', () => { closing = true; }, { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => emit('close'), { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="locale-override-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h2 id="locale-override-heading" class="h5 modal-title">{{ t('editor.localeOverride') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="locale-override-locale">{{ t('editor.locale') }}</label>
          <select
            id="locale-override-locale"
            ref="localeInput"
            :value="props.locale"
            :class="['form-select', { 'is-invalid': localeValidationVisible && !props.locale }]"
            @blur="reportLocaleBlur"
            @change="localeValidationVisible = false; emit('update:locale', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">{{ t('editor.selectLocale') }}</option>
            <option v-if="props.locale && !localeCatalogue.includes(props.locale)" :value="props.locale" disabled>{{ props.locale }}</option>
            <option v-for="locale in localeCatalogue" :key="locale" :value="locale" :disabled="isLocaleUnavailable(locale)">{{ locale }}</option>
          </select>
          <div v-if="localeValidationVisible && !props.locale" class="invalid-feedback d-block">{{ t('editor.invalidLocaleOverride') }}</div>
          <label class="form-label mt-3" for="locale-override-value">{{ props.valueLabel }}</label>
          <textarea
            v-if="props.multiline"
            id="locale-override-value"
            ref="valueInput"
            :value="props.value"
            :class="['form-control', { 'is-invalid': valueValidationVisible && !props.value.trim() }]"
            rows="4"
            @blur="reportValueBlur"
            @input="valueValidationVisible = false; emit('update:value', ($event.target as HTMLTextAreaElement).value)"
          ></textarea>
          <input
            v-else
            id="locale-override-value"
            ref="valueInput"
            :value="props.value"
            :class="['form-control', { 'is-invalid': valueValidationVisible && !props.value.trim() }]"
            @blur="reportValueBlur"
            @input="valueValidationVisible = false; emit('update:value', ($event.target as HTMLInputElement).value)"
          />
          <div v-if="valueValidationVisible && !props.value.trim()" class="invalid-feedback d-block">{{ props.valueValidationMessage }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="reset">{{ t('editor.reset') }}</button>
          <button class="btn btn-secondary" type="button" @mousedown="prepareToClose" @click.prevent="cancel">{{ t('editor.cancel') }}</button>
          <button class="btn btn-secondary" type="submit">{{ t('editor.save') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
