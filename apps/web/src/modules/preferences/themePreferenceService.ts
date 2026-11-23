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
Reads the locally remembered theme preference when browser storage is available.
---
Inputs: The browser local-storage preference value.
---
Output: A supported preference or the System default.
*/
export function readThemePreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(themePreferenceStorageKey));
  } catch {
    return 'system';
  }
}

/*
Stores an explicit theme preference or removes the System default override.
---
Inputs: The preference selected in the editor.
---
Output: A best-effort local preference update.
*/
export function saveThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(themePreferenceStorageKey);
      return;
    }
    window.localStorage.setItem(themePreferenceStorageKey, preference);
  } catch {
    // Theme preference is optional when browser storage is unavailable.
  }
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
