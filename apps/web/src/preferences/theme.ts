export type ResolvedTheme = 'light' | 'dark'
export type ThemePreference = 'system' | ResolvedTheme

export const themePreferenceStorageKey = 'stagehand.theme-preference'

/*
Converts a stored value into a supported theme preference.
---
Inputs: A value read from local storage.
---
Output: A supported preference, defaulting to system.
*/
export function parseThemePreference(value: string | null): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system'
}

/*
Resolves a user preference against the browser colour-scheme preference.
---
Inputs: A stored preference and whether the browser prefers dark mode.
---
Output: The light or dark mode to apply to the document.
*/
export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  return preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference
}
