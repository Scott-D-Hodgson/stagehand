<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../IconOnlyButton.vue';

export interface LocaleOverrideItem {
  locale: string;
  value: string;
}

const props = defineProps<{ editing: boolean; overrides: LocaleOverrideItem[] }>();
const emit = defineEmits<{
  add: [];
  edit: [override: LocaleOverrideItem];
  remove: [override: LocaleOverrideItem];
}>();
const { t } = useTranslation();
</script>

<template>
  <section aria-label="Locale overrides">
    <h3 class="h5 mb-3">{{ t('editor.localeOverrides') }}</h3>
    <IconOnlyButton v-if="props.editing" class="btn btn-outline-secondary btn-sm mb-3" icon="fa-solid fa-plus" :label="t('editor.add')" @click="emit('add')" />
    <p v-if="props.overrides.length === 0" class="mb-0 text-body-secondary">{{ t('editor.noLocaleOverrides') }}</p>
    <ul v-else class="list-group">
      <li v-for="override in props.overrides" :key="override.locale" class="list-group-item d-flex align-items-center justify-content-between gap-3">
        <span class="text-break"><span class="font-monospace">{{ override.locale }}</span>: {{ override.value }}</span>
        <span v-if="props.editing" class="btn-group btn-group-sm" role="group">
          <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-pen" :label="t('editor.edit')" @click="emit('edit', override)" />
          <IconOnlyButton class="btn btn-outline-danger" icon="fa-solid fa-minus" :label="t('editor.remove')" @click="emit('remove', override)" />
        </span>
      </li>
    </ul>
  </section>
</template>
