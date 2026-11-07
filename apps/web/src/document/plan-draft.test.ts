import { describe, expect, it } from 'vitest'
import { createBundledPlanDraft, updatePlanLocale } from './plan-draft'

describe('plan draft', () => {
  it('creates a fresh bundled plan with its case reference', () => {
    expect(createBundledPlanDraft()).toEqual({
      version: 1,
      id: 'editor-foundation',
      defaults: { locale: 'en-CA' },
      cases: [{ path: 'cases/landing-page.json' }],
    })
  })

  it('preserves unrelated plan data and raw invalid locale input', () => {
    const draft = createBundledPlanDraft()
    const updated = updatePlanLocale(draft, 'not a locale')
    expect(updated.defaults.locale).toBe('not a locale')
    expect(updated.id).toBe(draft.id)
    expect(updated.cases).toEqual(draft.cases)
    expect(draft.defaults.locale).toBe('en-CA')
  })
})
