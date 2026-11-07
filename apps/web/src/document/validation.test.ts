import { describe, expect, it } from 'vitest'
import { validateEditorPlan } from './validation'

describe('validateEditorPlan', () => {
  it('accepts a minimal valid plan', () => {
    expect(validateEditorPlan({ version: 1, id: 'sample', cases: [] }).valid).toBe(true)
  })

  it('reports a missing required cases property', () => {
    expect(validateEditorPlan({ version: 1, id: 'sample' }).valid).toBe(false)
  })
})
