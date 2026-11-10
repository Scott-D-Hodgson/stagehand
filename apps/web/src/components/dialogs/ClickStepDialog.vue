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
  validationMessage?: string;
  validationVisible: boolean;
}>();

const emit = defineEmits<{
  blur: [];
  close: [];
  reset: [];
  save: [];
  'update:name': [name: string];
  'update:role': [role: string];
}>();

const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const locatorFields = ref<InstanceType<typeof LocatorFields>>();
let modal: BootstrapModal | undefined;
let closing = false;

/*
Closes the Click-step dialog without saving its fields.
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
Marks the dialog as closing before a button press blurs the Role field.
---
Inputs: A close-button mouse-down interaction.
---
Output: Suppressed close-induced Role validation.
*/
function prepareToClose(): void {
  closing = true;
}

/*
Reports a Role-field blur unless the dialog is currently closing.
---
Inputs: A Role input blur.
---
Output: Validation feedback only while the dialog remains open.
*/
function reportRoleBlur(): void {
  if (!closing) {
    emit('blur');
  }
}

/*
Saves a valid Click step before closing the Bootstrap modal.
---
Inputs: A Click-step form submission.
---
Output: Validation feedback or a saved step followed by a hidden dialog.
*/
function save(): void {
  if (props.validationMessage !== undefined) {
    emit('blur');
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
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="click-step-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h2 id="click-step-heading" class="h5 modal-title">{{ t('editor.click') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @mousedown="prepareToClose" @click.prevent="cancel"></button>
        </div>
        <div class="modal-body">
          <LocatorFields
            ref="locatorFields"
            :name="props.name"
            prefix="click"
            :role="props.role"
            :validation-message="props.validationMessage"
            :validation-visible="props.validationVisible"
            @blur="reportRoleBlur"
            @update:name="emit('update:name', $event)"
            @update:role="emit('update:role', $event)"
          />
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
