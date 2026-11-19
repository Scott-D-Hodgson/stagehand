<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import WaitDetails from './WaitDetails.vue';
import { isWaitDraft, type WaitDraft } from './wait-draft';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean }>();
const emit = defineEmits<{ 'update:after': [items: WaitDraft[]]; 'update:before': [items: WaitDraft[]] }>();
const route = useRoute();
const { t } = useTranslation();
const position = computed(() => route.params.position === 'before' ? 'before' : 'after');
const waitIndex = computed(() => Number(route.params.waitIndex));
const items = computed(() => (position.value === 'before' ? props.before : props.after).filter(isWaitDraft));
const selectedWait = computed(() => items.value[waitIndex.value]);

/*
Gets the readable action label for the selected wait page.
---
Inputs: The selected contract-supported wait draft.
---
Output: A concise wait-type label.
*/
function getWaitTypeLabel(item: WaitDraft | undefined): string {
  if (item === undefined) {
    return t('editor.wait');
  }
  if ('delay' in item) {
    return t('editor.waitForDelay');
  }
  if ('waitFor' in item) {
    return t('editor.waitForLocator');
  }
  return t('editor.waitForState');
}

/*
Replaces the selected wait within its current interaction boundary list.
---
Inputs: A replacement wait draft from the dedicated Wait page.
---
Output: An immutable Before-or-After list update.
*/
function updateWait(item: WaitDraft): void {
  const next = [...items.value];
  next[waitIndex.value] = item;
  if (position.value === 'before') {
    emit('update:before', next);
    return;
  }
  emit('update:after', next);
}
</script>

<template>
  <section v-if="selectedWait" aria-labelledby="wait-page-heading">
    <h1 id="wait-page-heading" class="h2">{{ waitIndex + 1 }}. {{ getWaitTypeLabel(selectedWait) }}</h1>
    <WaitDetails :actions="false" :editing="props.editing" :id-prefix="`${position}-wait-${waitIndex}`" :index="waitIndex" :item="selectedWait" :wait-count="items.length" @update="updateWait" />
    <div class="mt-4">
      <RouterLink :to="{ name: 'step', params: { cardIndex: route.params.cardIndex, stepIndex: route.params.stepIndex } }" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-turn-down-left" aria-hidden="true"></i> {{ t('editor.return') }}</RouterLink>
    </div>
  </section>
</template>
