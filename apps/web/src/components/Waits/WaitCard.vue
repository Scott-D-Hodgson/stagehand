<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../controls/IconOnlyButton.vue';
import type { WaitDraft } from './models/wait-draft';

const props = defineProps<{ editing: boolean; index: number; item: WaitDraft; position: 'after' | 'before'; waitCount: number }>();
const emit = defineEmits<{ move: [direction: -1 | 1]; remove: [] }>();
const route = useRoute();
const { t } = useTranslation();

/*
Gets the readable action label for a contract-supported wait.
---
Inputs: A wait draft from an interaction boundary list.
---
Output: A concise wait-type label.
*/
function getWaitTypeLabel(item: WaitDraft): string {
  if ('delay' in item) {
    return t('editor.waitForDelay');
  }
  if ('waitFor' in item) {
    return t('editor.waitForLocator');
  }
  return t('editor.waitForState');
}
</script>

<template>
  <article
    class="card shadow-sm h-100 bg-body"
  >
    <div
      class="card-body position-relative pb-5"
    >
      <h3
        class="h5"
      >
        <RouterLink
          :to="{ name: 'wait', params: { cardIndex: route.params.cardIndex, position: props.position, stepIndex: route.params.stepIndex, waitIndex: props.index } }"
          class="stretched-link text-decoration-none"
        >{{ props.index + 1 }}. {{ getWaitTypeLabel(props.item) }}</RouterLink>
      </h3>
      <dl
        class="mb-0"
      >
        <template
          v-if="'delay' in props.item"
        >
          <dt>{{ t('editor.delayMilliseconds') }}</dt>
          <dd
            class="mb-0"
          >{{ props.item.delay }}</dd>
        </template>
        <template v-else-if="'waitFor' in props.item">
          <dt>{{ t('editor.role') }}</dt>
          <dd>{{ props.item.waitFor.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd class="mb-0"><template v-if="props.item.waitFor.name">{{ props.item.waitFor.name }}</template><template v-else>&mdash;</template></dd>
        </template>
        <template v-else>
          <dt>{{ t('editor.waitForState') }}</dt>
          <dd class="mb-0">{{ props.item.waitForState }}</dd>
        </template>
      </dl>
      <dl v-if="props.item.timeout !== undefined" class="mb-0 mt-3">
        <dt>{{ t('editor.stepTimeout') }}</dt>
        <dd class="mb-0">{{ props.item.timeout }}</dd>
      </dl>
      <div v-if="props.editing" class="position-absolute bottom-0 end-0 z-1" style="bottom: 1rem !important; right: 1rem !important;">
        <div class="btn-group btn-group-sm" role="group">
          <IconOnlyButton v-if="props.index > 0" class="btn btn-outline-secondary bg-body-tertiary" icon="fa-solid fa-arrow-up" :label="t('editor.moveStepUp')" @click.stop="emit('move', -1)" />
          <IconOnlyButton v-if="props.index < props.waitCount - 1" class="btn btn-outline-secondary bg-body-tertiary" icon="fa-solid fa-arrow-down" :label="t('editor.moveStepDown')" @click.stop="emit('move', 1)" />
          <RouterLink :to="{ name: 'wait', params: { cardIndex: route.params.cardIndex, position: props.position, stepIndex: route.params.stepIndex, waitIndex: props.index } }" class="btn btn-outline-secondary bg-body-tertiary"><i class="fa-solid fa-pen" aria-hidden="true"></i><span class="visually-hidden">{{ t('editor.edit') }}</span></RouterLink>
          <IconOnlyButton class="btn btn-outline-danger bg-body-tertiary" icon="fa-solid fa-minus" :label="t('editor.remove')" @click.stop="emit('remove')" />
        </div>
      </div>
    </div>
  </article>
</template>
