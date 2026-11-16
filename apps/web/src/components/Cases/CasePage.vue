<script setup lang="ts">
import type { AccessibilitySettingsDraft, CaseBrowserSettingsDraft, CaseDraft, PlanBrowserSettingsDraft } from '../../document/plan-draft';
import CaseDetails from './CaseDetails.vue';

const props = defineProps<{
  caseCount: number;
  caseDrafts: Record<string, CaseDraft>;
  caseIndex: number;
  casePath: string;
  editing: boolean;
  planAccessibility: AccessibilitySettingsDraft | undefined;
  planBrowser: PlanBrowserSettingsDraft | undefined;
  planLocale: string;
  planTimeout: unknown;
}>();
const emit = defineEmits<{
  move: [index: number, direction: -1 | 1];
  remove: [index: number];
  'remove:step': [path: string, index: number];
  select: [path: string];
  'update:accessibility': [path: string, accessibility: AccessibilitySettingsDraft | undefined];
  'update:browser': [path: string, browser: CaseBrowserSettingsDraft | undefined];
  'update:case-id': [path: string, id: string];
  'update:steps': [path: string, steps: unknown[]];
  'update:timeout': [path: string, timeout: unknown | undefined];
}>();
</script>

<template>
  <CaseDetails :case-count="props.caseCount" :case-drafts="props.caseDrafts" :case-index="props.caseIndex" :case-path="props.casePath" :editing="props.editing" :expanded="true" :framed="false" :plan-accessibility="props.planAccessibility" :plan-browser="props.planBrowser" :plan-locale="props.planLocale" :plan-timeout="props.planTimeout" @edit-reference="() => undefined" @move-reference="({ index, direction }) => emit('move', index, direction)" @remove-reference="emit('remove', $event)" @remove:step="(path, index) => emit('remove:step', path, index)" @select-reference="emit('select', $event)" @update:accessibility="(path, accessibility) => emit('update:accessibility', path, accessibility)" @update:browser="(path, browser) => emit('update:browser', path, browser)" @update:case-id="(path, id) => emit('update:case-id', path, id)" @update:steps="(path, steps) => emit('update:steps', path, steps)" @update:timeout="(path, timeout) => emit('update:timeout', path, timeout)" />
</template>
