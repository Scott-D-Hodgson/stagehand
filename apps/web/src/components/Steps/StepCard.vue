<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../IconOnlyButton.vue';

const props = defineProps<{
  actionLabel: string;
  editing: boolean;
  index: number;
  invalid: boolean;
  stepCount: number;
  timeout: unknown;
}>();

const emit = defineEmits<{
  clone: [];
  edit: [];
  move: [direction: -1 | 1];
  remove: [];
  'update:timeout': [timeout: number | string];
}>();

const { t } = useTranslation();
const isStepPage = inject<ComputedRef<boolean>>('stagehandStepPage', computed(() => false));
const caseIndex = inject<number>('stagehandCaseIndex');

</script>

<template>
  <article :class="['card', 'bg-body-tertiary', 'shadow-sm', 'h-100', { 'border-danger': props.invalid }]">
    <div class="card-body position-relative pb-5">
      <h4>
        <RouterLink v-if="caseIndex !== undefined" :to="{ name: 'step', params: { cardIndex: caseIndex, stepIndex: props.index } }" class="text-decoration-none">{{ props.index + 1 }}. {{ props.actionLabel }}</RouterLink>
        <span v-else>{{ props.index + 1 }}. {{ props.actionLabel }}</span>
      </h4>
      <slot v-if="!isStepPage" />
      <div v-if="props.editing" class="position-absolute bottom-0 end-0" style="bottom: 1rem !important; right: 1rem !important;">
        <div class="btn-group btn-group-sm" role="group">
          <IconOnlyButton v-if="props.index !== 0" class="btn btn-outline-secondary bg-body" icon="fa-solid fa-arrow-up" :label="t('editor.moveStepUp')" @click="emit('move', -1)" />
          <IconOnlyButton v-if="props.index !== props.stepCount - 1" class="btn btn-outline-secondary bg-body" icon="fa-solid fa-arrow-down" :label="t('editor.moveStepDown')" @click="emit('move', 1)" />
          <IconOnlyButton class="btn btn-outline-secondary bg-body" icon="fa-solid fa-pen" :label="t('editor.edit')" @click="emit('edit')" />
          <IconOnlyButton class="btn btn-outline-secondary bg-body" icon="fa-solid fa-clone" :label="t('editor.clone')" @click="emit('clone')" />
          <IconOnlyButton class="btn btn-outline-danger bg-body" icon="fa-solid fa-minus" :label="t('editor.removeCaseReference')" @click="emit('remove')" />
        </div>
      </div>
      <div v-if="props.invalid" class="mt-2 text-danger">{{ t('editor.invalidStepMessage') }}</div>
    </div>
  </article>
</template>
