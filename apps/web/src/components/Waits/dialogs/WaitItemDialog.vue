<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { WaitDraft } from '../models/wait-draft';

interface BootstrapModal {
  dispose(): void;
  hide(): void;
  show(): void;
}

export type WaitType = 'delay' | 'locator' | 'state';

const props = defineProps<{ type: WaitType }>();
const emit = defineEmits<{ close: []; save: [item: WaitDraft] }>();
const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const firstInput = ref<HTMLElement>();
const blurred = ref(false);
const closing = ref(false);
const item = ref<WaitDraft>(createWait(props.type));
let modal: BootstrapModal | undefined;
let savedItem: WaitDraft | undefined;

/*
Determines whether the delay wait field is invalid.
---
Inputs: The local wait draft delay.
---
Output: Whether the delay is outside its supported range.
*/
const invalidDelay = computed(
  () => 'delay' in item.value && (!Number.isInteger(item.value.delay) || item.value.delay < 1 || item.value.delay > 30_000)
);

/*
Determines whether the locator wait role is missing.
---
Inputs: The local wait draft locator.
---
Output: Whether a locator role must be supplied.
*/
const invalidRole = computed(
  () => 'waitFor' in item.value && item.value.waitFor.role.trim() === ''
);

/*
Determines whether a non-delay wait timeout is invalid.
---
Inputs: The local wait draft timeout.
---
Output: Whether the timeout is not a positive integer.
*/
const invalidTimeout = computed(
  () => !('delay' in item.value) && item.value.timeout !== undefined && (!Number.isInteger(item.value.timeout) || item.value.timeout < 1)
);

/*
Determines whether the local wait draft has any validation issue.
---
Inputs: The individual local wait field validity states.
---
Output: Whether saving the wait must be blocked.
*/
const invalid = computed(
  () => invalidDelay.value || invalidRole.value || invalidTimeout.value
);

/*
Creates an empty, contract-shaped wait for the selected type.
---
Inputs: A supported wait type.
---
Output: A new editable wait draft.
*/
function createWait(type: WaitType): WaitDraft {
  if (type === 'delay') {
    return { delay: 1 };
  }
  if (type === 'state') {
    return { waitForState: 'domcontentloaded' };
  }
  return { waitFor: { role: '' } };
}

/*
Gets the localized heading for the selected wait type.
---
Inputs: The selected wait type.
---
Output: The appropriate wait-dialog heading.
*/
function getHeading(type: WaitType): string {
  if (type === 'delay') {
    return t('editor.waitForDelay');
  }
  if (type === 'state') {
    return t('editor.waitForState');
  }
  return t('editor.waitForLocator');
}

/*
Reads an optional positive number input.
---
Inputs: A numeric input event.
---
Output: An undefined value for blank input or its numeric value.
*/
function readOptionalNumber(event: Event): number | undefined {
  const value = (event.target as HTMLInputElement).value;
  return value === '' ? undefined : Number(value);
}

/*
Reads a required number input while retaining an invalid blank value.
---
Inputs: A numeric input event.
---
Output: A numeric value or zero when input is blank.
*/
function readRequiredNumber(event: Event): number {
  const value = (event.target as HTMLInputElement).value;
  return value === '' ? 0 : Number(value);
}

/*
Updates the Role or Accessible name for a Locator wait.
---
Inputs: A locator field name and its replacement text.
---
Output: A replacement Locator-wait draft.
*/
function updateLocator(field: 'name' | 'role', value: string): void {
  if (!('waitFor' in item.value)) {
    return;
  }
  const locator = { ...item.value.waitFor, [field]: value };
  if (field === 'name' && value === '') {
    delete locator.name;
  }
  item.value = { ...item.value, waitFor: locator };
}

/*
Updates the selected page state for a Page-state wait.
---
Inputs: A supported page-state value.
---
Output: A replacement Page-state wait draft.
*/
function updatePageState(value: 'domcontentloaded' | 'networkidle'): void {
  if (!('waitForState' in item.value)) {
    return;
  }
  item.value = { ...item.value, waitForState: value };
}

/*
Updates the required delay for a Delay wait.
---
Inputs: A raw numeric input event.
---
Output: A replacement Delay-wait draft.
*/
function updateDelay(event: Event): void {
  if (!('delay' in item.value)) {
    return;
  }
  item.value = { ...item.value, delay: readRequiredNumber(event) };
}

/*
Updates or removes the independent timeout for a non-Delay wait.
---
Inputs: A raw optional-timeout input event.
---
Output: A replacement wait draft without an empty timeout property.
*/
function updateTimeout(event: Event): void {
  if ('delay' in item.value) {
    return;
  }
  const timeout = readOptionalNumber(event);
  const next = { ...item.value };
  if (timeout === undefined) {
    delete next.timeout;
  } else {
    next.timeout = timeout;
  }
  item.value = next;
}

/*
Marks the dialog fields as eligible to show validation feedback.
---
Inputs: A field blur interaction.
---
Output: Visible feedback for invalid dialog fields.
*/
function showValidation(): void {
  if (!closing.value) {
    blurred.value = true;
  }
}

/*
Prevents close-button blur from showing transient validation feedback.
---
Inputs: A close-button mouse-down interaction.
---
Output: A pending closing state.
*/
function prepareToClose(): void {
  closing.value = true;
}

/*
Closes the dialog without adding a wait.
---
Inputs: A close or cancel interaction.
---
Output: A hidden dialog followed by a close event.
*/
function cancel(): void {
  closing.value = true;
  modal?.hide();
}

/*
Restores the selected wait type's initial fields and validation state.
---
Inputs: A reset interaction.
---
Output: A new starter wait draft.
*/
function reset(): void {
  item.value = createWait(props.type);
  blurred.value = false;
}

/*
Adds a valid wait after all required fields have been completed.
---
Inputs: A form submission.
---
Output: A saved wait event followed by a hidden dialog, or validation feedback.
*/
function save(): void {
  if (invalid.value) {
    blurred.value = true;
    return;
  }
  savedItem = item.value;
  modal?.hide();
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => firstInput.value?.focus(), { once: true });
  modalElement.value?.addEventListener('hide.bs.modal', () => { closing.value = true; }, { once: true });
  modalElement.value?.addEventListener('hidden.bs.modal', () => {
    if (savedItem !== undefined) {
      emit('save', savedItem);
      return;
    }
    emit('close');
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
    aria-labelledby="wait-item-heading"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered"
    >
      <form
        class="modal-content"
        novalidate
        @submit.prevent="save"
      >
        <div
          class="modal-header"
        >
          <h2
            id="wait-item-heading"
            class="h5 modal-title"
          >{{ getHeading(props.type) }}</h2>
          <button
            class="btn-close"
            type="button"
            :aria-label="t('editor.close')"
            @mousedown="prepareToClose"
            @click.prevent="cancel"
          ></button>
        </div>
        <div
          class="modal-body"
        >
          <template
            v-if="'waitFor' in item"
          >
            <label
              class="form-label"
              for="wait-locator-role"
            >{{ t('editor.role') }}</label>
            <input
              id="wait-locator-role"
              ref="firstInput"
              class="form-control"
              :class="{ 'is-invalid': blurred && invalidRole }"
              :value="item.waitFor.role"
              required
              @blur="showValidation"
              @input="updateLocator('role', ($event.target as HTMLInputElement).value)"
            />
            <div
              v-if="blurred && invalidRole"
              class="invalid-feedback"
            >{{ t('editor.roleRequired') }}</div>
            <label
              class="form-label mt-3"
              for="wait-locator-name"
            >{{ t('editor.accessibleName') }}</label>
            <input
              id="wait-locator-name"
              class="form-control"
              :value="item.waitFor.name"
              @blur="showValidation"
              @input="updateLocator('name', ($event.target as HTMLInputElement).value)"
            />
          </template>
          <template v-else-if="'waitForState' in item">
            <label class="form-label" for="wait-state">{{ t('editor.waitForState') }}</label>
            <select id="wait-state" ref="firstInput" class="form-select" :value="item.waitForState" @change="updatePageState(($event.target as HTMLSelectElement).value as 'domcontentloaded' | 'networkidle')">
              <option value="domcontentloaded">domcontentloaded</option>
              <option value="networkidle">networkidle</option>
            </select>
          </template>
          <template v-else>
            <label class="form-label" for="wait-delay">{{ t('editor.delayMilliseconds') }}</label>
            <input id="wait-delay" ref="firstInput" class="form-control" :class="{ 'is-invalid': blurred && invalidDelay }" min="1" max="30000" type="number" :value="item.delay" required @blur="showValidation" @input="updateDelay" />
            <div class="form-text">{{ t('editor.delayInvalid') }}</div>
            <div v-if="blurred && invalidDelay" class="invalid-feedback d-block">{{ t('editor.delayInvalid') }}</div>
          </template>
          <template v-if="!('delay' in item)">
            <label class="form-label mt-3" for="wait-timeout">{{ t('editor.stepTimeout') }}</label>
            <input id="wait-timeout" class="form-control" :class="{ 'is-invalid': blurred && invalidTimeout }" min="1" type="number" :value="item.timeout" @blur="showValidation" @input="updateTimeout" />
            <div v-if="blurred && invalidTimeout" class="invalid-feedback">{{ t('editor.stepTimeoutInvalid') }}</div>
          </template>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" type="button" @click="reset">{{ t('editor.reset') }}</button>
          <button class="btn btn-outline-secondary" type="button" @mousedown="prepareToClose" @click.prevent="cancel">{{ t('editor.cancel') }}</button>
          <button class="btn btn-primary" type="submit">{{ t('editor.add') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
