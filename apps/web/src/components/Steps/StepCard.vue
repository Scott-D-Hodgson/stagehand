<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{
  actionLabel: string;
  editing: boolean;
  index: number;
  invalid: boolean;
  stepCount: number;
  timeout: unknown;
}>();

const emit = defineEmits<{
  clone: [];
  edit: [];
  move: [direction: -1 | 1];
  remove: [];
  'update:timeout': [timeout: number | string];
}>();

const { t } = useTranslation();
const timeoutWasBlurred = ref(false);
const timeoutIsInvalid = computed(() => props.timeout !== '' && props.timeout !== undefined && (typeof props.timeout !== 'number' || !Number.isInteger(props.timeout) || props.timeout < 1));

/*
Converts a timeout number-input into raw draft data.
---
Inputs: A timeout number-input event.
---
Output: A numeric value or raw empty text for shared validation.
*/
function readTimeout(event: Event): number | string {
  const input = event.target as HTMLInputElement;
  return input.value === '' ? '' : Number(input.value);
}
</script>

<template>
  <article :class="['card', 'mb-3', { 'border-danger': props.invalid }]">
    <div v-if="props.editing" class="card-header">
      <h4 class="h6 mb-2">{{ props.index + 1 }}. {{ props.actionLabel }}</h4>
      <template v-if="$slots.tabs">
        <slot name="tabs" />
      </template>
    </div>
    <div class="card-body">
      <h4 v-if="!props.editing" class="h6 mb-2">{{ props.index + 1 }}. {{ props.actionLabel }}</h4>
      <slot />
      <div v-if="props.editing" class="mt-3">
        <label class="form-label" :for="`step-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
        <input :id="`step-timeout-${props.index}`" :class="['form-control', { 'is-invalid': timeoutWasBlurred && timeoutIsInvalid }]" min="1" type="number" :value="props.timeout" @blur="timeoutWasBlurred = true" @input="emit('update:timeout', readTimeout($event))" />
        <div v-if="timeoutWasBlurred && timeoutIsInvalid" class="invalid-feedback d-block">{{ t('editor.stepTimeoutInvalid') }}</div>
      </div>
    </div>
    <div v-if="props.editing" class="card-footer">
      <div class="d-flex flex-wrap gap-2 justify-content-end">
        <button class="btn btn-secondary btn-sm" type="button" :disabled="props.index === 0" @click="emit('move', -1)">{{ t('editor.moveStepUp') }}</button>
        <button class="btn btn-secondary btn-sm" type="button" :disabled="props.index === props.stepCount - 1" @click="emit('move', 1)">{{ t('editor.moveStepDown') }}</button>
        <button class="btn btn-secondary btn-sm" type="button" @click="emit('edit')">{{ t('editor.edit') }}</button>
        <button class="btn btn-secondary btn-sm" type="button" @click="emit('clone')">{{ t('editor.clone') }}</button>
        <button class="btn btn-danger btn-sm" type="button" @click="emit('remove')">{{ t('editor.removeCaseReference') }}</button>
      </div>
      <div v-if="props.invalid" class="mt-2 text-danger">{{ t('editor.invalidStepMessage') }}</div>
    </div>
  </article>
</template>
