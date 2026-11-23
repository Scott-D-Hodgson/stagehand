<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{ idPrefix: string; inheritedTimeout: number; timeout: unknown }>();
const emit = defineEmits<{ 'update:timeout': [timeout: number | string] }>();
const wasBlurred = ref(false);
const { t } = useTranslation();

/*
Reads a timeout field without turning an empty value into zero.
---
Inputs: A timeout number-input event.
---
Output: A number or empty string for the shared draft updater.
*/
function readTimeout(event: Event): number | string {
  const input = event.target as HTMLInputElement;
  return input.value === '' ? Number.NaN : Number(input.value);
}

/*
Toggles this step's independent timeout override.
---
Inputs: Whether the author enabled the override checkbox.
---
Output: The inherited case value when enabled, or no step override when disabled.
*/
function changeOverride(enabled: boolean): void {
  wasBlurred.value = false;
  emit('update:timeout', enabled ? props.inheritedTimeout : '');
}
</script>

<template>
  <div
    class="form-check"
  >
    <input
      :id="`${props.idPrefix}-timeout-override`"
      class="form-check-input"
      type="checkbox"
      :checked="typeof props.timeout === 'number'"
      @change="changeOverride(($event.target as HTMLInputElement).checked)"
    />
    <label
      class="form-check-label"
      :for="`${props.idPrefix}-timeout-override`"
    >{{ t('editor.overrideCaseStepTimeout') }}</label>
  </div>
  <template
    v-if="typeof props.timeout === 'number'"
  >
    <label
      class="form-label mt-3"
      :for="`${props.idPrefix}-timeout`"
    >{{ t('editor.stepTimeout') }}</label>
    <input
      :id="`${props.idPrefix}-timeout`"
      :class="['form-control', { 'is-invalid': wasBlurred && (!Number.isInteger(props.timeout) || props.timeout < 1) }]"
      min="1"
      type="number"
      :value="props.timeout"
      @blur="wasBlurred = true"
      @input="emit('update:timeout', readTimeout($event))"
    />
    <div
      v-if="wasBlurred && (!Number.isInteger(props.timeout) || props.timeout < 1)"
      class="invalid-feedback d-block"
    >{{ t('editor.stepTimeoutInvalid') }}</div>
  </template>
  <p v-else class="mt-3 mb-0 text-body-secondary">{{ t('editor.inheritingCaseStepTimeout', { timeout: props.inheritedTimeout }) }}</p>
</template>
