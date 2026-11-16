<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

export interface LocaleOverrideItem {
  locale: string;
  value: string;
}

const props = defineProps<{ overrides: LocaleOverrideItem[] }>();
const emit = defineEmits<{
  add: [];
  edit: [override: LocaleOverrideItem];
  remove: [override: LocaleOverrideItem];
}>();
const { t } = useTranslation();
</script>

<template>
  <section aria-label="Locale overrides">
    <h2 class="h6 mb-3">{{ t('editor.localeOverrides') }}</h2>
    <button class="btn btn-outline-secondary btn-sm mb-3" type="button" @click="emit('add')">{{ t('editor.add') }}</button>
    <p v-if="props.overrides.length === 0" class="mb-0 text-body-secondary">{{ t('editor.noLocaleOverrides') }}</p>
    <ul v-else class="list-group">
      <li v-for="override in props.overrides" :key="override.locale" class="list-group-item d-flex align-items-center justify-content-between gap-3">
        <span class="text-break"><span class="font-monospace">{{ override.locale }}</span>: {{ override.value }}</span>
        <span class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-secondary" type="button" @click="emit('edit', override)">{{ t('editor.edit') }}</button>
          <button class="btn btn-outline-danger" type="button" @click="emit('remove', override)">{{ t('editor.remove') }}</button>
        </span>
      </li>
    </ul>
  </section>
</template>
