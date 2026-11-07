import {
  defaultInterfaceLanguage,
  supportedInterfaceLanguages,
  type InterfaceLanguage,
} from './resources'

export const interfaceLanguageStorageKey = 'stagehand.interface-language'

/*
Converts a stored value into a supported interface language.
---
Inputs: A value read from local storage.
---
Output: A supported interface language or the Canadian English default.
*/
export function parseInterfaceLanguage(value: string | null): InterfaceLanguage {
  return supportedInterfaceLanguages.includes(value as InterfaceLanguage)
    ? value as InterfaceLanguage
    : defaultInterfaceLanguage
}

/*
Reads the locally remembered interface language when browser storage is available.
---
Inputs: The browser local-storage preference value.
---
Output: A supported interface language or the Canadian English default.
*/
export function readInterfaceLanguage(): InterfaceLanguage {
  try {
    return parseInterfaceLanguage(window.localStorage.getItem(interfaceLanguageStorageKey))
  } catch {
    return defaultInterfaceLanguage
  }
}

/*
Stores a selected interface language without making browser storage mandatory.
---
Inputs: A supported interface language.
---
Output: A best-effort local preference update.
*/
export function saveInterfaceLanguage(language: InterfaceLanguage): void {
  try {
    window.localStorage.setItem(interfaceLanguageStorageKey, language)
  } catch {
    // Interface language remains available for the current session.
  }
}
