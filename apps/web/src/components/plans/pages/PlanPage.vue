<script setup lang="ts">
import type { ValidationIssue } from '@stagehand/plan-schema';
import type { AccessibilitySettingsDraft, CaseBrowserSettingsDraft, CaseDraft, PlanBrowserSettingsDraft, PlanDraft, VariableDefinitionDraft } from '../../../services/planDraftService';
import CaseReferences from '../../cases/CaseReferences.vue';
import VariableReferences from '../../variables/VariableReferences.vue';
import PlanDetails from '../details/PlanDetails.vue';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  editing: boolean;
  plan: PlanDraft;
  selectedCasePath: string;
  validationIssues: ValidationIssue[];
  validationRequested: boolean;
}>();
const emit = defineEmits<{
  add: [path: string];
  move: [index: number, direction: -1 | 1];
  remove: [index: number];
  'remove:step': [path: string, index: number];
  select: [path: string];
  update: [index: number, path: string];
  'update:accessibility': [path: string, accessibility: AccessibilitySettingsDraft | undefined];
  'update:browser': [path: string, browser: CaseBrowserSettingsDraft | undefined];
  'update:case-id': [path: string, id: string];
  'update:plan-accessibility': [accessibility: AccessibilitySettingsDraft];
  'update:plan-browser': [browser: PlanBrowserSettingsDraft];
  'update:plan-locale': [locale: string];
  'update:plan-timeout': [timeout: number | string | undefined];
  'update:plan-variable': [name: string, definition: VariableDefinitionDraft, previousName: string | undefined];
  'remove:plan-variable': [name: string];
  'update:steps': [path: string, steps: unknown[]];
  'update:timeout': [path: string, timeout: unknown | undefined];
  validate: [];
}>();
</script>

<template>
  <PlanDetails
    :editing="props.editing"
    :framed="true"
    :plan="props.plan"
    :validation-issues="props.validationIssues"
    :validation-requested="props.validationRequested"
    @update:accessibility="emit('update:plan-accessibility', $event)"
    @update:browser="emit('update:plan-browser', $event)"
    @update:locale="emit('update:plan-locale', $event)"
    @update:timeout="emit('update:plan-timeout', $event)"
    @validate="emit('validate')"
  />
  <VariableReferences
    :editing="props.editing"
    :plan="props.plan"
    @remove="emit('remove:plan-variable', $event)"
    @save="(name, definition, previousName) => emit('update:plan-variable', name, definition, previousName)"
  />
  <CaseReferences
    :case-drafts="props.caseDrafts"
    :cases="props.plan.cases"
    :editing="props.editing"
    :overview="true"
    :plan-accessibility="props.plan.defaults.accessibility"
    :plan-browser="props.plan.defaults.browser"
    :plan-locale="props.plan.defaults.locale"
    :plan-timeout="props.plan.defaults.timeout"
    :selected-path="props.selectedCasePath"
    @add="emit('add', $event)"
    @move="(index, direction) => emit('move', index, direction)"
    @remove="emit('remove', $event)"
    @remove:step="(path, index) => emit('remove:step', path, index)"
    @select="emit('select', $event)"
    @update="(index, path) => emit('update', index, path)"
    @update:accessibility="(path, accessibility) => emit('update:accessibility', path, accessibility)"
    @update:browser="(path, browser) => emit('update:browser', path, browser)"
    @update:case-id="(path, id) => emit('update:case-id', path, id)"
    @update:steps="(path, steps) => emit('update:steps', path, steps)"
    @update:timeout="(path, timeout) => emit('update:timeout', path, timeout)"
  />
</template>
