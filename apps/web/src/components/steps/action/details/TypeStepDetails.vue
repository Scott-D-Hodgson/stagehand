<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import { useTranslation } from 'i18next-vue';
import { resolveVariable, type VariableDefinition } from '@stagehand/plan-schema';
import type { CaseDraft, VariableDefinitionDraft } from '../../../../services/planDraftService';
import StepCard from '../../StepCard.vue';

const props = defineProps<{ actionLabel: string; editing: boolean; index: number; invalid: boolean; selectionLabel?: string; step: unknown; stepCount: number; timeout: unknown }>();
const emit = defineEmits<{ clone: []; edit: []; move: [direction: -1 | 1]; remove: []; 'update:timeout': [timeout: number | string] }>();
const { t } = useTranslation();
const variableContext = inject<ComputedRef<{ locale: string; planVariables: Record<string, VariableDefinitionDraft>; caseDraft: CaseDraft | undefined }>>('stagehandVariableContext');

/*
Determines the locator and text summary for the type step.
---
Inputs: The type step locator and text.
---
Output: A concise description of the configured typing action.
*/
const summary = computed(
  () => {
  const step = props.step as { locator?: { name?: string; role?: string }; text?: string | { var: string } };
  const locator = step.locator;
  const target = `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
  return target;
  }
);

/*
Resolves the displayed Type value using the configured variable scopes.
---
Inputs: The Type step, Plan locale, and available variable definitions.
---
Output: A safe value preview and its matching locale, if available.
*/
const preview = computed(
  () => {
    const step = props.step as { text?: string | { var: string }; variables?: Record<string, VariableDefinition> };
    if (typeof step.text !== 'object' || step.text === null) {
      return { value: step.text ?? '', locale: '', name: '' };
    }
    const name = step.text.var;
    const context = variableContext?.value;
    if (context === undefined) {
      return { value: t('editor.variableUnavailable', { name }), locale: '', name };
    }
    const caseData = context.caseDraft as (CaseDraft & { variables?: Record<string, VariableDefinition>; dataSets?: { default?: Record<string, VariableDefinition> } }) | undefined;
    const result = resolveVariable({ name, locale: context.locale, planVariables: context.planVariables as Record<string, VariableDefinition>, caseVariables: caseData?.variables, dataSetVariables: caseData?.dataSets?.default, stepVariables: step.variables });
    if (!result.resolved) {
      return { value: t('editor.variableUnavailable', { name }), locale: '', name };
    }
    const definition = result.source === 'step' ? step.variables?.[name] : result.source === 'dataSet' ? caseData?.dataSets?.default?.[name] : result.source === 'case' ? caseData?.variables?.[name] : context.planVariables[name];
    const locale = Object.keys(definition?.locales ?? {}).find((item) => item.toLowerCase() === context.locale.toLowerCase()) ?? '';
    const value = typeof result.value === 'object' && result.value !== null ? `$${result.value.env}` : String(result.value);
    return { value, locale, name };
  }
);
</script>

<template>
  <StepCard
    :action-label="props.actionLabel"
    :editing="props.editing"
    :index="props.index"
    :invalid="props.invalid"
    :step-count="props.stepCount"
    :timeout="props.timeout"
    @clone="emit('clone')"
    @edit="emit('edit')"
    @move="emit('move', $event)"
    @remove="emit('remove')"
    @update:timeout="emit('update:timeout', $event)"
  >
    <p
      class="mb-0 text-break"
    ><span
      class="text-body-secondary"
    >{{ summary }} → {{ props.selectionLabel ? `${props.selectionLabel}: ` : '' }}</span><span
      class="text-primary fw-bold"
    >{{ preview.value }}</span><span
      :class="['badge', 'rounded-pill', 'bg-body-secondary', 'border', 'ms-2', 'text-body', { invisible: !preview.locale }]"
    >{{ preview.locale }}</span><span
      v-if="preview.name"
      class="text-body-secondary"
    > ({{ t('editor.variable') }}: {{ preview.name }})</span></p>
  </StepCard>
</template>
