<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import type { InterfaceLanguage } from '../../localization/interfaceLanguageResources';
import type { ThemePreference } from '../../modules/preferences/themePreferenceService';
import IconOnlyButton from './IconOnlyButton.vue';

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
  <header
    class="navbar border-bottom navbar-expand-lg navbar-light bg-body-secondary"
  >
    <div
      class="container-fluid"
    >
      <a
        class="navbar-brand"
        href="https://getstagehand.ca"
      >{{ t('editor.heading') }}</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span
          class="navbar-toggler-icon"
        ></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <ul
          class="navbar-nav mb-2 mb-lg-0 ms-auto"
        >
          <li
            class="nav-item dropdown"
          >
            <IconOnlyButton
              id="language-preference"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              icon="fa-solid fa-language"
              :label="t('editor.language')"
            />
            <ul
              class="dropdown-menu"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <button
                  :class="['dropdown-item', { active: interfaceLanguage === 'en-CA' }]"
                  type="button"
                  @click="selectInterfaceLanguage('en-CA')"
                >{{ t('editor.englishCanada') }}</button>
              </li>
              <li>
                <button
                  :class="['dropdown-item', { active: interfaceLanguage === 'fr-CA' }]"
                  type="button"
                  @click="selectInterfaceLanguage('fr-CA')"
                >{{ t('editor.frenchCanada') }}</button>
              </li>
            </ul>
          </li>
        </ul>
        <ul
          class="navbar-nav mb-2 mb-lg-0"
        >
          <li
            class="nav-item dropdown"
          >
            <IconOnlyButton
              id="theme-preference"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              icon="fa-solid fa-palette"
              :label="t('editor.theme')"
            />
            <ul
              class="dropdown-menu"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <button
                  :class="['dropdown-item', { active: themePreference === 'system' }]"
                  type="button"
                  @click="selectThemePreference('system')"
                >{{ t('editor.systemTheme') }}</button>
              </li>
              <li>
                <button
                  :class="['dropdown-item', { active: themePreference === 'light' }]"
                  type="button"
                  @click="selectThemePreference('light')"
                >{{ t('editor.lightTheme') }}</button>
              </li>
              <li>
                <button
                  :class="['dropdown-item', { active: themePreference === 'dark' }]"
                  type="button"
                  @click="selectThemePreference('dark')"
                >{{ t('editor.darkTheme') }}</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
