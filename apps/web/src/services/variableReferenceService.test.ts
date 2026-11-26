import { describe, expect, it } from 'vitest';
import { createEmptyEditorDraft } from './planDraftService';
import { findVariableReferences, findVariableRenameConflicts, findVariableStepUsages, renameVariableReferences } from './variableReferenceService';

describe('plan variable reference protection', () => {
  it('counts each matching Case step once and retains its navigation indexes', () => {
    const bundle = createEmptyEditorDraft('sample');
    bundle.plan.cases = [{ path: 'case.json' }];
    bundle.plan.sharedSteps = { shared: [{ action: 'type', text: { var: 'input' } }] };
    bundle.cases['case.json'] = { id: 'example', version: 1, steps: [{ action: 'assertText', expected: { default: { var: 'input' }, locales: { 'fr-CA': { var: 'input' } } } }, { action: 'type', text: { var: 'other' } }] };
    expect(findVariableStepUsages(bundle, 'input')).toEqual([{ action: 'assertText', caseIndex: 0, caseName: 'example', stepIndex: 0 }]);
    expect(findVariableStepUsages(bundle, 'missing')).toEqual([]);
  });

  it('finds and independently rewrites case and shared-step references', () => {
    const bundle = createEmptyEditorDraft('sample');
    bundle.plan.sharedSteps = { shared: [{ action: 'type', text: { var: 'input' } }] };
    bundle.cases['cases/example.json'] = { id: 'example', version: 1, steps: [{ action: 'assertText', expected: { default: { var: 'input' }, locales: { 'fr-CA': { var: 'input' } } } }] };
    expect(findVariableReferences(bundle, 'input')).toEqual([
      { document: 'plan.json', path: '/sharedSteps/shared/0/text' },
      { document: 'cases/example.json', path: '/steps/0/expected/default' },
      { document: 'cases/example.json', path: '/steps/0/expected/locales/fr-CA' },
    ]);
    const rewritten = renameVariableReferences(bundle, 'input', 'renamed') as typeof bundle;
    expect(findVariableReferences(rewritten, 'input')).toEqual([]);
    expect(findVariableReferences(rewritten, 'renamed')).toHaveLength(3);
    expect(findVariableReferences(bundle, 'input')).toHaveLength(3);
  });

  it('detects narrower variables that could alter resolution on rename', () => {
    const bundle = createEmptyEditorDraft('sample');
    bundle.cases['case.json'] = { id: 'case', version: 1, variables: { renamed: { default: 'other' } }, steps: [{ action: 'type', variables: { input: { default: 'local' } }, text: { var: 'input' } }] } as typeof bundle.cases[string];
    expect(findVariableRenameConflicts(bundle, 'input', 'renamed')).toEqual([
      { document: 'case.json', path: '/variables' },
      { document: 'case.json', path: '/steps/0/variables' },
    ]);
  });
});
