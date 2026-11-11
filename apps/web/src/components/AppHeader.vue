<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import type { InterfaceLanguage } from '../localization/resources';
import type { ThemePreference } from '../preferences/theme';

defineProps<{
  interfaceLanguage: InterfaceLanguage;
  themePreference: ThemePreference;
}>();

const emit = defineEmits<{
  'update:interfaceLanguage': [language: InterfaceLanguage];
  'update:themePreference': [preference: ThemePreference];
}>();

const { t } = useTranslation();

/*
Emits a selected interface language to the application shell.
---
Inputs: A language-selector input event.
---
Output: The selected supported interface language.
*/
function changeInterfaceLanguage(event: Event): void {
  emit('update:interfaceLanguage', (event.target as HTMLSelectElement).value as InterfaceLanguage);
}

/*
Emits a selected theme preference to the application shell.
---
Inputs: A theme-selector input event.
---
Output: The selected supported theme preference.
*/
function changeThemePreference(event: Event): void {
  emit('update:themePreference', (event.target as HTMLSelectElement).value as ThemePreference);
}
</script>

<template>
  <header class="app-header border-bottom bg-body-tertiary">
    <div class="container-fluid d-flex align-items-center justify-content-between gap-3 py-2">
      <div>
        <h1 class="h5 mb-0">{{ t('editor.heading') }}</h1>
        <p class="small mb-0 text-body-secondary">{{ t('editor.tagline') }}</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <label class="d-flex align-items-center gap-2 small" for="interface-language">
          {{ t('editor.language') }}
          <select id="interface-language" :value="interfaceLanguage" class="form-select form-select-sm" @input="changeInterfaceLanguage">
            <option value="en-CA">{{ t('editor.englishCanada') }}</option>
            <option value="fr-CA">{{ t('editor.frenchCanada') }}</option>
          </select>
        </label>
        <label class="d-flex align-items-center gap-2 small" for="theme-preference">
          {{ t('editor.theme') }}
          <select id="theme-preference" :value="themePreference" class="form-select form-select-sm" @input="changeThemePreference">
            <option value="system">{{ t('editor.systemTheme') }}</option>
            <option value="light">{{ t('editor.lightTheme') }}</option>
            <option value="dark">{{ t('editor.darkTheme') }}</option>
          </select>
        </label>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1030;
}
</style>
