import { createApp } from 'vue'
import I18NextVue from 'i18next-vue'
import App from './App.vue'
import { i18nInitialized, i18next } from './localization/i18n'

/*
Initializes translations before mounting the editor.
---
Inputs: The configured i18next instance and Vue application.
---
Output: A mounted editor with translation support.
*/
async function startEditor(): Promise<void> {
  await i18nInitialized
  createApp(App).use(I18NextVue, { i18next }).mount('#app')
}

void startEditor()
