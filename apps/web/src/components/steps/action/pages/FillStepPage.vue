<script setup lang="ts">
import type { VariableDefinitionDraft } from '../../../../services/planDraftService';
import InteractionTextPage from './InteractionTextPage.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; inheritedTimeout: number; name: string; planLocale: string; role: string; scrollIntoView: boolean; timeout: unknown; value: string | { var: string }; variables: Record<string, VariableDefinitionDraft> }>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:locator': [locator: { name?: string; role: string }]; 'update:scroll-into-view': [enabled: boolean]; 'update:timeout': [timeout: number | string]; 'update:value': [value: string | { var: string }]; save: [] }>();
</script>

<template>
  <InteractionTextPage
    :after="props.after"
    :before="props.before"
    :editing="props.editing"
    :index="props.index"
    :inherited-timeout="props.inheritedTimeout"
    kind="fill"
    :name="props.name"
    :plan-locale="props.planLocale"
    :role="props.role"
    :scroll-into-view="props.scrollIntoView"
    :text="props.value"
    :timeout="props.timeout"
    :variables="props.variables"
    @save="emit('save')"
    @update:after="emit('update:after', $event)"
    @update:before="emit('update:before', $event)"
    @update:locator="emit('update:locator', $event)"
    @update:scroll-into-view="emit('update:scroll-into-view', $event)"
    @update:text="emit('update:value', $event)"
    @update:timeout="emit('update:timeout', $event)"
  />
</template>
