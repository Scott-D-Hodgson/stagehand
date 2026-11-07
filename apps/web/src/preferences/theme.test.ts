import { describe, expect, it } from 'vitest'
import { parseThemePreference, resolveTheme } from './theme'

describe('parseThemePreference', () => {
  it('keeps supported explicit preferences', () => {
    expect(parseThemePreference('dark')).toBe('dark')
  })

  it('falls back to system for missing or unsupported values', () => {
    expect(parseThemePreference(null)).toBe('system')
    expect(parseThemePreference('sepia')).toBe('system')
  })
})

describe('resolveTheme', () => {
  it('follows the browser preference for system mode', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('uses an explicit preference over the browser preference', () => {
    expect(resolveTheme('light', true)).toBe('light')
  })
})
