<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import LocatorFields from './LocatorFields.vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

type SelectionMode = 'label' | 'value';

const props = defineProps<{
  name: string;
  role: string;
  roleValidationMessage?: string;
  roleValidationVisible: boolean;
  selection: string;
  selectionMode: SelectionMode;
  selectionValidationMessage?: string;
  selectionValidationVisible: boolean;
}>();

const emit = defineEmits<{
  'blur:role': [];
  'blur:selection': [];
  close: [];
  reset: [];
  save: [];
  validate: [];
  'update:name': [name: string];
  'update:role': [role: string];
  'update:selection': [selection: string];
  'update:selection-mode': [mode: SelectionMode];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const locatorFields = ref<InstanceType<typeof LocatorFields>>();
let modal: BootstrapModal | undefined;
let closing = false;

/*
Closes the Select option dialog without saving its fields.
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
Reports a Role-field blur while the dialog remains open.
---
Inputs: A Role input blur.
---
Output: Role validation feedback.
*/
function reportRoleBlur(): void {
  if (!closing) {
    emit('blur:role');
  }
}

/*
Reports a selection-field blur while the dialog remains open.
---
Inputs: A Value or Label input blur.
---
Output: Selection validation feedback.
*/
function reportSelectionBlur(): void {
  if (!closing) {
    emit('blur:selection');
  }
}

/*
Saves a valid Select option step before closing the Bootstrap modal.
---
Inputs: A Select option form submission.
---
Output: Validation feedback or a saved step followed by a hidden dialog.
*/
function save(): void {
  if (props.roleValidationMessage !== undefined || props.selectionValidationMessage !== undefined) {
    emit('validate');
    return;
  }
  emit('save');
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => locatorFields.value?.focusRoleInput(), { once: true });
  modalElement.value?.addEventListener('hide.bs.modal', () => { closing = true; }, { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => emit('close'), { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="select-option-step-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h2 id="select-option-step-heading" class="h5 modal-title">{{ t('editor.selectOption') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <LocatorFields
            ref="locatorFields"
            :name="props.name"
            prefix="select-option"
            :role="props.role"
            :validation-message="props.roleValidationMessage"
            :validation-visible="props.roleValidationVisible"
            @blur="reportRoleBlur"
            @update:name="emit('update:name', $event)"
            @update:role="emit('update:role', $event)"
          />
          <fieldset class="mt-3">
            <legend class="fs-6">{{ t('editor.selectOptionBy') }}</legend>
            <div class="form-check">
              <input id="select-option-by-value" class="form-check-input" type="radio" name="select-option-mode" :checked="props.selectionMode === 'value'" @change="emit('update:selection-mode', 'value')" />
              <label class="form-check-label" for="select-option-by-value">{{ t('editor.byValue') }}</label>
            </div>
            <div class="form-check">
              <input id="select-option-by-label" class="form-check-input" type="radio" name="select-option-mode" :checked="props.selectionMode === 'label'" @change="emit('update:selection-mode', 'label')" />
              <label class="form-check-label" for="select-option-by-label">{{ t('editor.byLabel') }}</label>
            </div>
          </fieldset>
          <label class="form-label mt-3" for="select-option-selection">{{ props.selectionMode === 'value' ? t('editor.value') : t('editor.label') }}</label>
          <input
            id="select-option-selection"
            :value="props.selection"
            class="form-control"
            :class="{ 'is-invalid': props.selectionValidationVisible && props.selectionValidationMessage !== undefined }"
            required
            @blur="reportSelectionBlur"
            @input="emit('update:selection', ($event.target as HTMLInputElement).value)"
          />
          <div v-if="props.selectionValidationVisible && props.selectionValidationMessage" class="invalid-feedback d-block">{{ props.selectionValidationMessage }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" type="button" @click="emit('reset')">{{ t('editor.reset') }}</button>
          <button class="btn btn-secondary" type="button" @mousedown="prepareToClose" @click.prevent="cancel">{{ t('editor.cancel') }}</button>
          <button class="btn btn-primary" type="submit">{{ t('editor.save') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
