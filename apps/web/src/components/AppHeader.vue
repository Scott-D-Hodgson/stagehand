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
function selectInterfaceLanguage(language: InterfaceLanguage): void {
  emit('update:interfaceLanguage', language);
}

/*
Emits a selected theme preference to the application shell.
---
Inputs: A theme-selector input event.
---
Output: The selected supported theme preference.
*/
function selectThemePreference(preference: ThemePreference): void {
  emit('update:themePreference', preference);
}
</script>

<template>
  <header class="app-header border-bottom bg-body-tertiary">
    <div class="container-fluid d-flex align-items-center justify-content-between gap-3 py-2">
      <div>
        <p class="h5 mb-0"><a class="link-body-emphasis text-decoration-none" href="https://getstagehand.ca">{{ t('editor.heading') }}</a></p>
        <p class="small mb-0 text-body-secondary">{{ t('editor.tagline') }}</p>
      </div>
      <ul class="nav">
        <li class="nav-item dropdown">
          <button id="language-preference" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" type="button" aria-expanded="false">{{ t('editor.language') }}</button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="language-preference">
            <li>
              <button :class="['dropdown-item', { active: interfaceLanguage === 'en-CA' }]" type="button" @click="selectInterfaceLanguage('en-CA')">{{ t('editor.englishCanada') }}</button>
            </li>
            <li>
              <button :class="['dropdown-item', { active: interfaceLanguage === 'fr-CA' }]" type="button" @click="selectInterfaceLanguage('fr-CA')">{{ t('editor.frenchCanada') }}</button>
            </li>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <button id="theme-preference" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" type="button" aria-expanded="false">{{ t('editor.theme') }}</button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="theme-preference">
            <li>
              <button :class="['dropdown-item', { active: themePreference === 'system' }]" type="button" @click="selectThemePreference('system')">{{ t('editor.systemTheme') }}</button>
            </li>
            <li>
              <button :class="['dropdown-item', { active: themePreference === 'light' }]" type="button" @click="selectThemePreference('light')">{{ t('editor.lightTheme') }}</button>
            </li>
            <li>
              <button :class="['dropdown-item', { active: themePreference === 'dark' }]" type="button" @click="selectThemePreference('dark')">{{ t('editor.darkTheme') }}</button>
            </li>
          </ul>
        </li>
      </ul>
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
