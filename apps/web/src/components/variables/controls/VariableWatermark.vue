<script setup lang="ts">
import { computed } from 'vue';
import type { VariableDefinitionDraft } from '../../../services/planDraftService';

const props = defineProps<{ definition: VariableDefinitionDraft }>();

/*
Selects the decorative icon for the variable's default type.
---
Inputs: A variable definition.
---
Output: Its Font Awesome icon class.
*/
const icon = computed(
  () => typeof props.definition.default === 'boolean' ? 'fa-solid fa-toggle-on'
    : typeof props.definition.default === 'number' ? 'fa-solid fa-hashtag'
      : typeof props.definition.default === 'object' ? 'fa-solid fa-computer' : 'fa-solid fa-font'
);
</script>

<template>
  <div
    class="variable-card-pattern position-absolute top-0 start-0 w-100 h-100"
    aria-hidden="true"
  >
    <i
      v-for="index in 12"
      :key="index"
      :class="icon"
    ></i>
  </div>
</template>

<style scoped>
.variable-card-pattern {
  align-content: center;
  color: var(--bs-secondary-color);
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(6, minmax(0, 0.2fr));
  opacity: 0.05;
  pointer-events: none;
  transform: rotate(-12deg) scale(1.5);
}
.variable-card-pattern :deep(svg) {
  font-size: 2.75rem;
  justify-self: center;
}
</style>
