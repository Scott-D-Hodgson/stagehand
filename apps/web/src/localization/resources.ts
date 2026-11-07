import englishCanada from './locales/en-CA.json'
import frenchCanada from './locales/fr-CA.json'

export const defaultInterfaceLanguage = 'en-CA'

export const supportedInterfaceLanguages = ['en-CA', 'fr-CA'] as const

export type InterfaceLanguage = typeof supportedInterfaceLanguages[number]

export const interfaceResources = {
  'en-CA': { translation: englishCanada },
  'fr-CA': { translation: frenchCanada },
} as const
