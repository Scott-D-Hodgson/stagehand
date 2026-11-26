<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../controls/IconOnlyButton.vue';
import { stepActionIcons } from './step-icons';
import StepWatermark from './StepWatermark.vue';

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

/*
Determines the visual icon for this step action.
---
Inputs: The localized action label.
---
Output: The matching Font Awesome icon class, when one is available.
*/
const actionIcon = computed(
  () => ({
    [t('editor.assertHtml')]: stepActionIcons.assertHtml,
    [t('editor.assertText')]: stepActionIcons.assertText,
    [t('editor.assertValue')]: stepActionIcons.assertValue,
    [t('editor.click')]: stepActionIcons.click,
    [t('editor.fill')]: stepActionIcons.fill,
    [t('editor.navigate')]: stepActionIcons.navigate,
    [t('editor.selectOption')]: stepActionIcons.selectOption,
    [t('editor.type')]: stepActionIcons.type,
  })[props.actionLabel]
);

</script>

<template>
  <article
    :class="['card', 'bg-body-tertiary', 'shadow-sm', 'h-100', 'overflow-hidden', { 'border-danger': props.invalid }]"
  >
    <div
      class="card-body position-relative pb-5"
    >
      <StepWatermark
        v-if="actionIcon"
        :icon="actionIcon"
      />
      <h4
        class="position-relative z-1 d-flex align-items-center justify-content-between gap-3"
      >
        <RouterLink
          v-if="caseIndex !== undefined"
          :to="{ name: 'step', params: { cardIndex: caseIndex, stepIndex: props.index } }"
          class="text-decoration-none"
        >{{ props.index + 1 }}. {{ props.actionLabel }}</RouterLink>
        <span
          v-else
        >{{ props.index + 1 }}. {{ props.actionLabel }}</span>
        <i
          v-if="actionIcon"
          :class="['step-card-action-icon', 'flex-shrink-0', actionIcon]"
          aria-hidden="true"
        ></i>
      </h4>
      <div
        v-if="!isStepPage"
        class="position-relative z-1"
      ><slot /></div>
      <div
        v-if="props.editing"
        class="position-absolute bottom-0 end-0 z-1"
        style="bottom: 1rem !important; right: 1rem !important;"
      >
        <div
          class="btn-group btn-group-sm"
          role="group"
        >
          <IconOnlyButton
            v-if="props.index !== 0"
            class="btn btn-outline-secondary bg-body"
            icon="fa-solid fa-arrow-up"
            :label="t('editor.moveStepUp')"
            @click="emit('move', -1)"
          />
          <IconOnlyButton
            v-if="props.index !== props.stepCount - 1"
            class="btn btn-outline-secondary bg-body"
            icon="fa-solid fa-arrow-down"
            :label="t('editor.moveStepDown')"
            @click="emit('move', 1)"
          />
          <IconOnlyButton
            class="btn btn-outline-secondary bg-body"
            icon="fa-solid fa-pen"
            :label="t('editor.edit')"
            @click="emit('edit')"
          />
          <IconOnlyButton
            class="btn btn-outline-secondary bg-body"
            icon="fa-solid fa-clone"
            :label="t('editor.clone')"
            @click="emit('clone')"
          />
          <IconOnlyButton
            class="btn btn-outline-danger bg-body"
            icon="fa-solid fa-minus"
            :label="t('editor.removeCaseReference')"
            @click="emit('remove')"
          />
        </div>
      </div>
      <div
        v-if="props.invalid"
        class="position-relative z-1 mt-2 text-danger"
      >{{ t('editor.invalidStepMessage') }}</div>
    </div>
  </article>
</template>

<style scoped>
:deep(.step-card-action-icon) {
  color: var(--bs-secondary-color);
  font-size: 1.25em;
}
</style>
