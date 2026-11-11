import { describe, expect, it } from 'vitest';
import { getInvalidCaseStepIndexes, validateEditorPlan } from './validation';

describe('validateEditorPlan', () => {
  it('accepts a minimal valid plan', () => {
    expect(validateEditorPlan({ version: 1, id: 'sample', cases: [] }).valid).toBe(true)
  })

  it('reports a missing required cases property', () => {
    expect(validateEditorPlan({ version: 1, id: 'sample' }).valid).toBe(false)
  })

  it('returns each invalid case-step index once', () => {
    expect(getInvalidCaseStepIndexes({ id: 'sample', steps: [{ action: 'navigate' }, { action: 'navigate', url: 'https://example.com' }], version: 1 })).toEqual([0]);
  })
})
