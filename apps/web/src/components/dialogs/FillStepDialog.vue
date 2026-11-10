<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import LocatorFields from './LocatorFields.vue';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

const props = defineProps<{
  name: string;
  role: string;
  roleValidationMessage?: string;
  roleValidationVisible: boolean;
  value: string;
  valueValidationMessage?: string;
  valueValidationVisible: boolean;
}>();

const emit = defineEmits<{
  'blur:role': [];
  'blur:value': [];
  close: [];
  reset: [];
  save: [];
  validate: [];
  'update:name': [name: string];
  'update:role': [role: string];
  'update:value': [value: string];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const locatorFields = ref<InstanceType<typeof LocatorFields>>();
let modal: BootstrapModal | undefined;
let closing = false;

/*
Closes the Fill-step dialog without saving its fields.
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
Reports a Value-field blur while the dialog remains open.
---
Inputs: A Value input blur.
---
Output: Value validation feedback.
*/
function reportValueBlur(): void {
  if (!closing) {
    emit('blur:value');
  }
}

/*
Saves a valid Fill step before closing the Bootstrap modal.
---
Inputs: A Fill-step form submission.
---
Output: Validation feedback or a saved step followed by a hidden dialog.
*/
function save(): void {
  if (props.roleValidationMessage !== undefined || props.valueValidationMessage !== undefined) {
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
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="fill-step-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h2 id="fill-step-heading" class="h5 modal-title">{{ t('editor.fill') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <LocatorFields
            ref="locatorFields"
            :name="props.name"
            prefix="fill"
            :role="props.role"
            :validation-message="props.roleValidationMessage"
            :validation-visible="props.roleValidationVisible"
            @blur="reportRoleBlur"
            @update:name="emit('update:name', $event)"
            @update:role="emit('update:role', $event)"
          />
          <label class="form-label mt-3" for="fill-value">{{ t('editor.value') }}</label>
          <input
            id="fill-value"
            :value="props.value"
            class="form-control"
            :class="{ 'is-invalid': props.valueValidationVisible && props.valueValidationMessage !== undefined }"
            required
            @blur="reportValueBlur"
            @input="emit('update:value', ($event.target as HTMLInputElement).value)"
          />
          <div v-if="props.valueValidationVisible && props.valueValidationMessage" class="invalid-feedback d-block">{{ props.valueValidationMessage }}</div>
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
