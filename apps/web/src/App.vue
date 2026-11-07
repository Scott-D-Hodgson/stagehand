<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTranslation } from 'i18next-vue'
import AppHeader from './components/AppHeader.vue'
import PlanBundle from './components/PlanBundle.vue'
import { createBundledPlanDraft } from './document/plan-draft'
import { saveInterfaceLanguage } from './localization/preferences'
import { type InterfaceLanguage } from './localization/resources'
import {
  parseThemePreference,
  resolveTheme,
  themePreferenceStorageKey,
  type ResolvedTheme,
  type ThemePreference,
} from './preferences/theme'

const { i18next, t } = useTranslation()
const interfaceLanguage = ref<InterfaceLanguage>(i18next.language as InterfaceLanguage)
const planDraft = ref(createBundledPlanDraft())

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
    <AppHeader v-model:interface-language="interfaceLanguage" v-model:theme-preference="themePreference" />
    <main class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-3">{{ t('editor.title') }}</h1>
          <p class="lead">
            {{ t('editor.introduction') }}
          </p>
          <PlanBundle v-model:plan="planDraft" />
        </div>
      </div>
    </main>
  </div>
</template>
