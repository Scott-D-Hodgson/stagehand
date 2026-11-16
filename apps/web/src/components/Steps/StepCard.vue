<script setup lang="ts">
import { computed, inject, ref, type ComputedRef } from 'vue';
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../IconOnlyButton.vue';

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
const isSummary = inject<ComputedRef<boolean>>('stagehandStepSummary', computed(() => false));
const isStepPage = inject<ComputedRef<boolean>>('stagehandStepPage', computed(() => false));
const caseIndex = inject<number>('stagehandCaseIndex');
const selectedDetailsTab = ref<'default' | 'overrides'>('default');

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
    <div v-if="props.editing && $slots.tabs" class="card-header">
      <ul v-if="isStepPage" class="nav nav-tabs card-header-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button :class="['nav-link', { active: selectedDetailsTab === 'default' }]" type="button" @click="selectedDetailsTab = 'default'">{{ t('editor.defaultTab') }}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button :class="['nav-link', { active: selectedDetailsTab === 'overrides' }]" type="button" @click="selectedDetailsTab = 'overrides'">{{ t('editor.overridesTab') }}</button>
        </li>
      </ul>
      <template v-else-if="$slots.tabs">
        <slot name="tabs" />
      </template>
    </div>
    <div class="card-body">
      <h3 class="h6 mb-2">
        <RouterLink v-if="caseIndex !== undefined" :to="{ name: 'step', params: { cardIndex: caseIndex, stepIndex: props.index } }" class="text-decoration-none">{{ props.index + 1 }}. {{ props.actionLabel }}</RouterLink>
        <span v-else>{{ props.index + 1 }}. {{ props.actionLabel }}</span>
      </h3>
      <slot v-if="!isStepPage || selectedDetailsTab === 'default'" />
      <div v-if="props.editing && !isSummary && (!isStepPage || selectedDetailsTab === 'overrides')" :class="{ 'mt-3': !isStepPage }">
        <label class="form-label" :for="`step-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
        <input :id="`step-timeout-${props.index}`" :class="['form-control', { 'is-invalid': timeoutWasBlurred && timeoutIsInvalid }]" min="1" type="number" :value="props.timeout" @blur="timeoutWasBlurred = true" @input="emit('update:timeout', readTimeout($event))" />
        <div v-if="timeoutWasBlurred && timeoutIsInvalid" class="invalid-feedback d-block">{{ t('editor.stepTimeoutInvalid') }}</div>
      </div>
    </div>
    <div v-if="props.editing" class="card-footer">
      <div class="d-flex justify-content-end">
        <div class="btn-group btn-group-sm" role="group">
          <IconOnlyButton class="btn btn-outline-secondary" :disabled="props.index === 0" icon="fa-solid fa-arrow-up" :label="t('editor.moveStepUp')" @click="emit('move', -1)" />
          <IconOnlyButton class="btn btn-outline-secondary" :disabled="props.index === props.stepCount - 1" icon="fa-solid fa-arrow-down" :label="t('editor.moveStepDown')" @click="emit('move', 1)" />
          <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-pen" :label="t('editor.edit')" @click="emit('edit')" />
          <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-clone" :label="t('editor.clone')" @click="emit('clone')" />
          <IconOnlyButton class="btn btn-outline-danger" icon="fa-solid fa-minus" :label="t('editor.removeCaseReference')" @click="emit('remove')" />
        </div>
      </div>
      <div v-if="props.invalid" class="mt-2 text-danger">{{ t('editor.invalidStepMessage') }}</div>
    </div>
  </article>
</template>
