import { describe, expect, it } from 'vitest';
import { createBundledEditorDraft } from '../document/plan-draft';
import { resolveRecoveryRoute } from './recovery-route';

/*
Creates a recovered bundle with one step and one Before wait.
---
Inputs: None.
---
Output: A small valid route hierarchy for recovery-navigation checks.
*/
function createRouteDraft() {
  const draft = createBundledEditorDraft();
  draft.cases['cases/landing-page.json']!.steps = [{
    action: 'navigate',
    before: [{ delay: 100 }],
    url: 'https://example.test',
  }];
  return draft;
}

describe('recovery route resolution', () => {
  it('keeps a valid Wait route after restoration', () => {
    expect(resolveRecoveryRoute({ cardIndex: '0', draft: createRouteDraft(), position: 'before', routeName: 'wait', stepIndex: '0', waitIndex: '0' })).toEqual({ cardIndex: 0, name: 'wait', position: 'before', stepIndex: 0, waitIndex: 0 });
  });

  it('falls back from an invalid Wait to its valid Step', () => {
    expect(resolveRecoveryRoute({ cardIndex: '0', draft: createRouteDraft(), position: 'after', routeName: 'wait', stepIndex: '0', waitIndex: '0' })).toEqual({ cardIndex: 0, name: 'step', stepIndex: 0 });
  });

  it('falls back from an invalid Step to its valid Case', () => {
    expect(resolveRecoveryRoute({ cardIndex: '0', draft: createRouteDraft(), position: undefined, routeName: 'step', stepIndex: '1', waitIndex: undefined })).toEqual({ cardIndex: 0, name: 'case' });
  });

  it('falls back from an invalid Case or Home route to the Plan', () => {
    const draft = createRouteDraft();
    expect(resolveRecoveryRoute({ cardIndex: '1', draft, position: undefined, routeName: 'case', stepIndex: undefined, waitIndex: undefined })).toEqual({ name: 'plan' });
    expect(resolveRecoveryRoute({ cardIndex: undefined, draft, position: undefined, routeName: 'home', stepIndex: undefined, waitIndex: undefined })).toEqual({ name: 'plan' });
  });
});
