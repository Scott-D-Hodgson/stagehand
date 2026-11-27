<script setup lang="ts">
import type { VariableDefinitionDraft } from '../../../../services/planDraftService';
import InteractionTextPage from './InteractionTextPage.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; inheritedTimeout: number; planLocale: string; protocol: 'http://' | 'https://'; timeout: unknown; url: string | { var: string }; variables: Record<string, VariableDefinitionDraft> }>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:protocol': [protocol: 'http://' | 'https://']; 'update:timeout': [timeout: number | string]; 'update:url': [url: string | { var: string }]; save: [] }>();
</script>

<template>
  <InteractionTextPage
    :after="props.after"
    :before="props.before"
    :editing="props.editing"
    :index="props.index"
    :inherited-timeout="props.inheritedTimeout"
    kind="navigate"
    name=""
    :plan-locale="props.planLocale"
    :protocol="props.protocol"
    role=""
    :scroll-into-view="true"
    :text="props.url"
    :timeout="props.timeout"
    :variables="props.variables"
    @save="emit('save')"
    @update:after="emit('update:after', $event)"
    @update:before="emit('update:before', $event)"
    @update:text="emit('update:url', $event)"
    @update:protocol="emit('update:protocol', $event)"
    @update:timeout="emit('update:timeout', $event)"
  />
</template>
