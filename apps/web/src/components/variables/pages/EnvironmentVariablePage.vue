<script setup lang="ts">
import type { CaseDraft, PlanDraft, VariableDefinitionDraft } from '../../../services/planDraftService';
import VariablePage from './VariablePage.vue';

const props = defineProps<{ caseDrafts: Record<string, CaseDraft>; definition: VariableDefinitionDraft; editing: boolean; name: string; plan: PlanDraft; }>();
const emit = defineEmits<{ update: [definition: VariableDefinitionDraft]; }>();
</script>

<template>
  <VariablePage
    :case-drafts="props.caseDrafts"
    :definition="props.definition"
    :editing="props.editing"
    :name="props.name"
    :plan="props.plan"
    @update="emit('update', $event)"
  />
</template>
