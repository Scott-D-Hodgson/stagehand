<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

const props = defineProps<{
  actionLabel: string;
  editing: boolean;
  index: number;
  invalid: boolean;
  stepCount: number;
}>();

const emit = defineEmits<{
  clone: [];
  edit: [];
  move: [direction: -1 | 1];
  remove: [];
}>();

const { t } = useTranslation();
</script>

<template>
  <article :class="['card', 'mb-3', { 'border-danger': props.invalid }]">
    <div v-if="props.editing" class="card-header">
      <h4 class="h6 mb-2">{{ props.index + 1 }}. {{ props.actionLabel }}</h4>
      <template v-if="$slots.tabs">
        <slot name="tabs" />
      </template>
    </div>
    <div class="card-body">
      <h4 v-if="!props.editing" class="h6 mb-2">{{ props.index + 1 }}. {{ props.actionLabel }}</h4>
      <slot />
    </div>
    <div v-if="props.editing" class="card-footer">
      <div class="d-flex flex-wrap gap-2 justify-content-end">
        <button class="btn btn-secondary btn-sm" type="button" :disabled="props.index === 0" @click="emit('move', -1)">{{ t('editor.moveStepUp') }}</button>
        <button class="btn btn-secondary btn-sm" type="button" :disabled="props.index === props.stepCount - 1" @click="emit('move', 1)">{{ t('editor.moveStepDown') }}</button>
        <button class="btn btn-secondary btn-sm" type="button" @click="emit('edit')">{{ t('editor.edit') }}</button>
        <button class="btn btn-secondary btn-sm" type="button" @click="emit('clone')">{{ t('editor.clone') }}</button>
        <button class="btn btn-danger btn-sm" type="button" @click="emit('remove')">{{ t('editor.removeCaseReference') }}</button>
      </div>
      <div v-if="props.invalid" class="mt-2 text-danger">{{ t('editor.invalidStepMessage') }}</div>
    </div>
  </article>
</template>
