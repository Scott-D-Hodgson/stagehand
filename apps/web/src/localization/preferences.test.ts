import { describe, expect, it } from 'vitest'
import { parseInterfaceLanguage } from './preferences'

describe('parseInterfaceLanguage', () => {
  it('keeps supported Canadian interface languages', () => {
    expect(parseInterfaceLanguage('fr-CA')).toBe('fr-CA')
  })

  it('falls back to Canadian English for missing or unsupported values', () => {
    expect(parseInterfaceLanguage(null)).toBe('en-CA')
    expect(parseInterfaceLanguage('fr-FR')).toBe('en-CA')
  })
})
