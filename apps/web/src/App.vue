<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTranslation } from 'i18next-vue'
import { validateEditorPlan } from './document/validation'
import { saveInterfaceLanguage } from './localization/preferences'
import { type InterfaceLanguage } from './localization/resources'
import {
  parseThemePreference,
  resolveTheme,
  themePreferenceStorageKey,
  type ResolvedTheme,
  type ThemePreference,
} from './preferences/theme'

const bundledPlan = {
  version: 1,
  id: 'editor-foundation',
  cases: [],
}

const validation = validateEditorPlan(bundledPlan)
const { i18next, t } = useTranslation()
const interfaceLanguage = ref<InterfaceLanguage>(i18next.language as InterfaceLanguage)

/*
Reads a saved theme preference without making storage availability mandatory.
---
Inputs: The browser local-storage preference value.
---
Output: A supported preference or the System default.
*/
function readThemePreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(themePreferenceStorageKey))
  } catch {
    return 'system'
  }
}

/*
Reads the browser's current colour-scheme preference.
---
Inputs: The browser colour-scheme media query.
---
Output: The matching light or dark theme.
*/
function readSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const themePreference = ref<ThemePreference>(readThemePreference())
const systemTheme = ref<ResolvedTheme>(readSystemTheme())
const resolvedTheme = computed(() => resolveTheme(themePreference.value, systemTheme.value === 'dark'))
let colourSchemeQuery: MediaQueryList | undefined

/*
Applies a changed browser colour-scheme preference when System is selected.
---
Inputs: A browser media-query change event.
---
Output: Updates the reactive system theme.
*/
function updateSystemTheme(event: MediaQueryListEvent): void {
  systemTheme.value = event.matches ? 'dark' : 'light'
}

/*
Stores an explicit theme preference or removes the System default override.
---
Inputs: The preference selected in the editor.
---
Output: A best-effort local preference update.
*/
function saveThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(themePreferenceStorageKey)
      return
    }
    window.localStorage.setItem(themePreferenceStorageKey, preference)
  } catch {
    // Theme preference is optional when browser storage is unavailable.
  }
}

onMounted(() => {
  colourSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.value = colourSchemeQuery.matches ? 'dark' : 'light'
  colourSchemeQuery.addEventListener('change', updateSystemTheme)
})

onBeforeUnmount(() => {
  colourSchemeQuery?.removeEventListener('change', updateSystemTheme)
})

watch(themePreference, saveThemePreference)
watch(interfaceLanguage, (language) => {
  saveInterfaceLanguage(language)
  document.documentElement.lang = language
  void i18next.changeLanguage(language)
}, { immediate: true })
watch(resolvedTheme, (theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme)
}, { immediate: true })
</script>

<template>
  <div class="min-vh-100 bg-body">
    <header class="border-bottom bg-body-tertiary">
      <div class="container d-flex align-items-center justify-content-between gap-3 py-3">
        <p class="mb-0 fw-semibold">{{ t('editor.heading') }}</p>
        <label class="d-flex align-items-center gap-2 small" for="interface-language">
          {{ t('editor.language') }}
          <select id="interface-language" v-model="interfaceLanguage" class="form-select form-select-sm">
            <option value="en-CA">{{ t('editor.englishCanada') }}</option>
            <option value="fr-CA">{{ t('editor.frenchCanada') }}</option>
          </select>
        </label>
        <label class="d-flex align-items-center gap-2 small" for="theme-preference">
          {{ t('editor.theme') }}
          <select id="theme-preference" v-model="themePreference" class="form-select form-select-sm">
            <option value="system">{{ t('editor.systemTheme') }}</option>
            <option value="light">{{ t('editor.lightTheme') }}</option>
            <option value="dark">{{ t('editor.darkTheme') }}</option>
          </select>
        </label>
      </div>
    </header>
    <main class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-3">{{ t('editor.title') }}</h1>
          <p class="lead">
            {{ t('editor.introduction') }}
          </p>
          <section class="card shadow-sm" aria-labelledby="contract-status-heading">
            <div class="card-body">
              <h2 id="contract-status-heading" class="h5">{{ t('editor.sharedContract') }}</h2>
              <p class="mb-0" aria-live="polite">{{ validation.valid ? t('editor.validPlan') : t('editor.invalidPlan', { count: validation.issues.length }) }}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
