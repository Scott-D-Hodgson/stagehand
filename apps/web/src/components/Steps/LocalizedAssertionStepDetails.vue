<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import StepCard from './StepCard.vue';

interface LocaleOverride { active: boolean; locale: string; value: string }

const props = defineProps<{
  actionLabel: string;
  editing: boolean;
  effectiveLocale: string;
  effectiveValue: string;
  hasLocaleOverride: boolean;
  index: number;
  invalid: boolean;
  localeOverrides: LocaleOverride[];
  step: unknown;
  stepCount: number;
}>();
const emit = defineEmits<{
  'add-locale-override': [];
  'edit-locale-override': [override: LocaleOverride];
  'remove-locale-override': [override: LocaleOverride];
  clone: [];
  edit: [];
  move: [direction: -1 | 1];
  remove: [];
}>();
const { t } = useTranslation();
const localeOverridesSelected = ref(false);
const target = computed(() => {
  const locator = (props.step as { locator?: { name?: string; role?: string } }).locator;
  return `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
});
</script>

<template>
  <StepCard :action-label="props.actionLabel" :editing="props.editing" :index="props.index" :invalid="props.invalid" :step-count="props.stepCount" @clone="emit('clone')" @edit="emit('edit')" @move="emit('move', $event)" @remove="emit('remove')">
    <template v-if="props.editing" #tabs>
      <ul class="nav nav-tabs card-header-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button :id="`step-default-tab-${props.index}`" :class="['nav-link', { active: !localeOverridesSelected }]" type="button" role="tab" :aria-controls="`step-default-panel-${props.index}`" :aria-selected="!localeOverridesSelected" @click="localeOverridesSelected = false">{{ t('editor.defaultTab') }}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button :id="`step-locale-overrides-tab-${props.index}`" :class="['nav-link', { active: localeOverridesSelected }]" type="button" role="tab" :aria-controls="`step-locale-overrides-panel-${props.index}`" :aria-selected="localeOverridesSelected" @click="localeOverridesSelected = true">{{ t('editor.localeOverrides') }}</button>
        </li>
      </ul>
    </template>
    <section v-if="!props.editing || !localeOverridesSelected" :id="props.editing ? `step-default-panel-${props.index}` : undefined" :aria-labelledby="props.editing ? `step-default-tab-${props.index}` : undefined" :role="props.editing ? 'tabpanel' : undefined">
      <p class="mb-0 text-break">
        <span class="text-body-secondary">{{ target }} → </span>
        <span class="text-primary fw-bold">{{ props.effectiveValue }}</span>
        <span :class="['badge', 'rounded-pill', 'bg-body-secondary', 'border', 'ms-2', 'text-body', { invisible: !props.hasLocaleOverride }]">{{ props.effectiveLocale }}</span>
      </p>
    </section>
    <section v-else :id="`step-locale-overrides-panel-${props.index}`" role="tabpanel" :aria-labelledby="`step-locale-overrides-tab-${props.index}`">
      <div class="d-flex align-items-center justify-content-between gap-3 mb-3">
        <h5 class="h6 mb-0">{{ t('editor.localeOverrides') }}</h5>
        <button v-if="props.editing" class="btn btn-secondary btn-sm" type="button" @click="emit('add-locale-override')">{{ t('editor.add') }}</button>
      </div>
      <p v-if="props.localeOverrides.length === 0" class="mb-0 text-body-secondary">{{ t('editor.noLocaleOverrides') }}</p>
      <ul v-else class="list-group">
        <li v-for="override in props.localeOverrides" :key="override.locale" :class="['list-group-item', 'd-flex', 'align-items-center', 'justify-content-between', 'gap-3', { 'border-primary': override.active, 'locale-override-active': override.active }]">
          <span class="text-break"><span class="font-monospace">{{ override.locale }}</span>: {{ override.value }}</span>
          <span v-if="props.editing" class="d-flex gap-2">
            <button class="btn btn-secondary btn-sm" type="button" @click="emit('edit-locale-override', override)">{{ t('editor.edit') }}</button>
            <button class="btn btn-danger btn-sm" type="button" @click="emit('remove-locale-override', override)">{{ t('editor.remove') }}</button>
          </span>
        </li>
      </ul>
    </section>
  </StepCard>
</template>

<style scoped>
.locale-override-active {
  border-top-width: var(--bs-border-width) !important;
  position: relative;
  z-index: 1;
}
</style>
