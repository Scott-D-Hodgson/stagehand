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
  expected: string;
  expectedValidationMessage?: string;
  expectedValidationVisible: boolean;
  name: string;
  role: string;
  roleValidationMessage?: string;
  roleValidationVisible: boolean;
}>();

const emit = defineEmits<{
  'blur:expected': [];
  'blur:role': [];
  close: [];
  reset: [];
  save: [];
  validate: [];
  'update:expected': [expected: string];
  'update:name': [name: string];
  'update:role': [role: string];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const locatorFields = ref<InstanceType<typeof LocatorFields>>();
let modal: BootstrapModal | undefined;
let closing = false;

/*
Closes the Assert value dialog without saving its fields.
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
Reports an expected-value field blur while the dialog remains open.
---
Inputs: An expected-value input blur.
---
Output: Expected-value validation feedback.
*/
function reportExpectedBlur(): void {
  if (!closing) {
    emit('blur:expected');
  }
}

/*
Saves a valid Assert value step before closing the Bootstrap modal.
---
Inputs: An Assert value form submission.
---
Output: Validation feedback or a saved step followed by a hidden dialog.
*/
function save(): void {
  if (props.roleValidationMessage !== undefined || props.expectedValidationMessage !== undefined) {
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
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="assert-value-step-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h2 id="assert-value-step-heading" class="h5 modal-title">{{ t('editor.assertValue') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <LocatorFields
            ref="locatorFields"
            :name="props.name"
            prefix="assert-value"
            :role="props.role"
            :validation-message="props.roleValidationMessage"
            :validation-visible="props.roleValidationVisible"
            @blur="reportRoleBlur"
            @update:name="emit('update:name', $event)"
            @update:role="emit('update:role', $event)"
          />
          <label class="form-label mt-3" for="assert-value-expected">{{ t('editor.expectedValue') }}</label>
          <input
            id="assert-value-expected"
            :value="props.expected"
            class="form-control"
            :class="{ 'is-invalid': props.expectedValidationVisible && props.expectedValidationMessage !== undefined }"
            required
            @blur="reportExpectedBlur"
            @input="emit('update:expected', ($event.target as HTMLInputElement).value)"
          />
          <div v-if="props.expectedValidationVisible && props.expectedValidationMessage" class="invalid-feedback d-block">{{ props.expectedValidationMessage }}</div>
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
