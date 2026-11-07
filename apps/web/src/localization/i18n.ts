import i18next from 'i18next'
import { interfaceResources } from './resources'
import { readInterfaceLanguage } from './preferences'

export const i18nInitialized = i18next.init({
  fallbackLng: 'en-CA',
  interpolation: {
    escapeValue: false,
  },
  lng: readInterfaceLanguage(),
  resources: interfaceResources,
})

export { i18next }
