<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { VariableDefinitionDraft } from '../../../services/planDraftService';

export type VariableKind = 'boolean' | 'environment' | 'number' | 'text';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  definition?: VariableDefinitionDraft;
  existingNames: readonly string[];
  kind: VariableKind;
  name?: string;
}>();

const emit = defineEmits<{
  close: [];
  save: [name: string, definition: VariableDefinitionDraft, previousName: string | undefined];
}>();

const { t } = useTranslation();
const dialogElement = ref<HTMLElement>();
const nameInput = ref<HTMLInputElement>();
const nameWasBlurred = ref(false);
const valueWasBlurred = ref(false);
const name = ref(props.name ?? '');
const textValue = ref(readTextValue(props.definition));
const numberValue = ref(readNumberValue(props.definition));
const booleanValue = ref(readBooleanValue(props.definition));
const environmentName = ref(readEnvironmentName(props.definition));
let modal: BootstrapModal | undefined;

/*
Determines whether the entered variable name already belongs to another variable.
---
Inputs: The entered name, original name, and existing variable names.
---
Output: Whether saving would create a duplicate name.
*/
const hasDuplicateName = computed(
  () => name.value !== props.name && props.existingNames.includes(name.value)
);

/*
Determines whether the current variable name is valid.
---
Inputs: The entered name and duplicate-name state.
---
Output: Whether the name is non-empty and unique.
*/
const isNameValid = computed(
  () => name.value.trim().length > 0 && !hasDuplicateName.value
);

/*
Determines whether the selected default value can be saved.
---
Inputs: The selected variable kind and local default fields.
---
Output: Whether the variable has a valid default value.
*/
const isValueValid = computed(
  () => props.kind === 'boolean' || (props.kind === 'number' ? Number.isFinite(numberValue.value) : (props.kind === 'environment' ? environmentName.value.trim().length > 0 : textValue.value.length > 0))
);

/*
Determines whether the complete variable form can be saved.
---
Inputs: Name and default-value validity.
---
Output: Whether Save should be available.
*/
const isFormValid = computed(
  () => isNameValid.value && isValueValid.value
);

/*
Reads an editable text default from a stored variable definition.
---
Inputs: An optional variable definition.
---
Output: Its literal text default or empty text.
*/
function readTextValue(definition: VariableDefinitionDraft | undefined): string {
  return typeof definition?.default === 'string' ? definition.default : '';
}

/*
Reads an editable number default from a stored variable definition.
---
Inputs: An optional variable definition.
---
Output: Its number default or an invalid empty value.
*/
function readNumberValue(definition: VariableDefinitionDraft | undefined): number {
  return typeof definition?.default === 'number' ? definition.default : Number.NaN;
}

/*
Reads an editable boolean default from a stored variable definition.
---
Inputs: An optional variable definition.
---
Output: Its boolean default or false.
*/
function readBooleanValue(definition: VariableDefinitionDraft | undefined): boolean {
  return typeof definition?.default === 'boolean' ? definition.default : false;
}

/*
Reads an environment-variable name from a stored protected default.
---
Inputs: An optional variable definition.
---
Output: The environment-variable name or empty text.
*/
function readEnvironmentName(definition: VariableDefinitionDraft | undefined): string {
  const value = definition?.default;
  return typeof value === 'object' && value !== null && typeof value.env === 'string' ? value.env : '';
}

/*
Marks the variable name field as ready to show validation feedback.
---
Inputs: A name-field blur interaction.
---
Output: Visible name feedback when the value is invalid.
*/
function validateName(): void {
  nameWasBlurred.value = true;
}

/*
Marks the variable default field as ready to show validation feedback.
---
Inputs: A default-field blur interaction.
---
Output: Visible default feedback when the value is invalid.
*/
function validateValue(): void {
  valueWasBlurred.value = true;
}

/*
Updates the active text or environment default field.
---
Inputs: A text-input event.
---
Output: The corresponding local default value.
*/
function changeTextValue(event: Event): void {
  if (props.kind === 'environment') {
    environmentName.value = (event.target as HTMLInputElement).value;
    return;
  }
  textValue.value = (event.target as HTMLInputElement).value;
}

/*
Updates the numeric variable default from its number-input control.
---
Inputs: A number-input event.
---
Output: A number or invalid empty numeric value for local validation.
*/
function changeNumberValue(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  numberValue.value = value === '' ? Number.NaN : Number(value);
}

/*
Updates the Boolean variable default from its select control.
---
Inputs: A Boolean-value select event.
---
Output: A true or false local default value.
*/
function changeBooleanValue(event: Event): void {
  booleanValue.value = (event.target as HTMLSelectElement).value === 'true';
}

/*
Builds a detached variable definition from the valid local form.
---
Inputs: The current local fields.
---
Output: A supported plan-variable definition.
*/
function createDefinition(): VariableDefinitionDraft {
  if (props.kind === 'boolean') {
    return { default: booleanValue.value };
  }
  if (props.kind === 'number') {
    return { default: numberValue.value };
  }
  return { default: props.kind === 'environment' ? { env: environmentName.value.trim() } : textValue.value };
}

/*
Saves the variable after exposing any incomplete field feedback.
---
Inputs: A Save action.
---
Output: A saved variable event and hidden dialog, or visible validation feedback.
*/
function save(): void {
  nameWasBlurred.value = true;
  valueWasBlurred.value = true;
  if (!isFormValid.value) {
    return;
  }
  emit('save', name.value.trim(), createDefinition(), props.name);
  modal?.hide();
}

/*
Closes the dialog without changing the plan.
---
Inputs: A Cancel interaction.
---
Output: A hidden dialog and close event.
*/
function cancel(): void {
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(dialogElement.value!, { backdrop: 'static' });
  dialogElement.value?.addEventListener('shown.bs.modal', () => nameInput.value?.focus(), { once: true });
  dialogElement.value?.addEventListener('hidden.bs.modal', () => emit('close'), { once: true });
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div
    ref="dialogElement"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="variable-dialog-heading"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered"
    >
      <form
        class="modal-content"
        @submit.prevent="save"
      >
        <div
          class="modal-header"
        >
          <h2
            id="variable-dialog-heading"
            class="h5 modal-title"
          >{{ t('editor.variable') }}</h2>
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
          <label
            class="form-label"
            for="variable-name"
          >{{ t('editor.name') }}</label>
          <input
            id="variable-name"
            ref="nameInput"
            v-model="name"
            :class="['form-control', { 'is-invalid': nameWasBlurred && !isNameValid }]"
            @blur="validateName"
          />
          <div
            v-if="nameWasBlurred && !isNameValid"
            class="invalid-feedback d-block"
          >{{ hasDuplicateName ? t('editor.variableNameDuplicate') : t('editor.variableNameRequired') }}</div>
          <template
            v-if="props.kind === 'text' || props.kind === 'environment'"
          >
            <label
              class="form-label mt-3"
              for="variable-default-text"
            >{{ props.kind === 'environment' ? t('editor.environmentVariableName') : t('editor.value') }}</label>
            <input
              id="variable-default-text"
              :value="props.kind === 'environment' ? environmentName : textValue"
              :class="['form-control', { 'is-invalid': valueWasBlurred && !isValueValid }]"
              @blur="validateValue"
              @input="changeTextValue"
            />
          </template>
          <template
            v-else-if="props.kind === 'number'"
          >
            <label
              class="form-label mt-3"
              for="variable-default-number"
            >{{ t('editor.value') }}</label>
            <input
              id="variable-default-number"
              :value="Number.isFinite(numberValue) ? numberValue : ''"
              :class="['form-control', { 'is-invalid': valueWasBlurred && !isValueValid }]"
              type="number"
              @blur="validateValue"
              @input="changeNumberValue"
            />
          </template>
          <template
            v-else
          >
            <label
              class="form-label mt-3"
              for="variable-default-boolean"
            >{{ t('editor.value') }}</label>
            <select
              id="variable-default-boolean"
              :value="String(booleanValue)"
              class="form-select"
              @change="changeBooleanValue"
            >
              <option value="true">{{ t('editor.booleanTrue') }}</option>
              <option value="false">{{ t('editor.booleanFalse') }}</option>
            </select>
          </template>
          <div
            v-if="props.kind !== 'boolean' && valueWasBlurred && !isValueValid"
            class="invalid-feedback d-block"
          >{{ t('editor.variableValueRequired') }}</div>
        </div>
        <div
          class="modal-footer"
        >
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="cancel"
          >{{ t('editor.cancel') }}</button>
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="!isFormValid"
          >{{ t('editor.save') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
