<script setup lang="ts">
import type { VariableDefinitionDraft } from '../../../services/planDraftService';
import VariablePage from './VariablePage.vue';

const props = defineProps<{ definition: VariableDefinitionDraft; editing: boolean; name: string; }>();
const emit = defineEmits<{ update: [definition: VariableDefinitionDraft]; }>();
</script>

<template>
  <VariablePage
    :definition="props.definition"
    :editing="props.editing"
    :name="props.name"
    @update="emit('update', $event)"
  />
</template>
