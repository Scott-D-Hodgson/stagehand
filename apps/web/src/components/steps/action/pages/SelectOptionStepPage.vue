<script setup lang="ts">
import { computed } from 'vue';
import type { VariableDefinitionDraft } from '../../../../services/planDraftService';
import InteractionTextPage from './InteractionTextPage.vue';

type SelectionValue = string | { var: string };
const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; inheritedTimeout: number; label: SelectionValue | undefined; name: string; planLocale: string; role: string; scrollIntoView: boolean; timeout: unknown; value: SelectionValue | undefined; variables: Record<string, VariableDefinitionDraft> }>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:locator': [locator: { name?: string; role: string }]; 'update:scroll-into-view': [enabled: boolean]; 'update:selection': [selection: { label?: SelectionValue; value?: SelectionValue }]; 'update:timeout': [timeout: number | string]; save: [] }>();

/*
Determines which mutually exclusive option-selection field is active.
---
Inputs: The current Value and Label fields.
---
Output: The selected mode.
*/
const selectionMode = computed(
  () => props.value === undefined ? 'label' : 'value'
);

/*
Changes the selection mode while retaining the current literal or reference.
---
Inputs: A Value or Label mode.
---
Output: A local selection update containing exactly one field.
*/
function changeMode(mode: 'label' | 'value'): void {
  const selection = props.value ?? props.label ?? '';
  emit('update:selection', mode === 'value' ? { value: selection } : { label: selection });
}

/*
Changes the literal or variable reference in the active selection field.
---
Inputs: A text value or Plan-variable reference.
---
Output: A local selection update for the active mode.
*/
function changeSelection(selection: SelectionValue): void {
  emit('update:selection', selectionMode.value === 'value' ? { value: selection } : { label: selection });
}
</script>

<template>
  <InteractionTextPage
    :after="props.after"
    :before="props.before"
    :editing="props.editing"
    :index="props.index"
    :inherited-timeout="props.inheritedTimeout"
    kind="selectOption"
    :name="props.name"
    :plan-locale="props.planLocale"
    :role="props.role"
    :scroll-into-view="props.scrollIntoView"
    :selection-mode="selectionMode"
    :text="props.value ?? props.label ?? ''"
    :timeout="props.timeout"
    :variables="props.variables"
    @save="emit('save')"
    @update:after="emit('update:after', $event)"
    @update:before="emit('update:before', $event)"
    @update:locator="emit('update:locator', $event)"
    @update:scroll-into-view="emit('update:scroll-into-view', $event)"
    @update:selection-mode="changeMode"
    @update:text="changeSelection"
    @update:timeout="emit('update:timeout', $event)"
  />
</template>
