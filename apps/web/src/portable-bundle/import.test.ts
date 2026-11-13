import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { createBundledEditorDraft } from '../document/plan-draft';
import { readPortableBundleFile } from './import';

describe('portable bundle import', () => {
  it('reads a valid selected archive without changing the candidate data', async () => {
    const draft = createBundledEditorDraft();
    const archive = zipSync({
      'cases/landing-page.json': strToU8(JSON.stringify(draft.cases['cases/landing-page.json'])),
      'plan.json': strToU8(JSON.stringify(draft.plan)),
    });
    const result = await readPortableBundleFile({ arrayBuffer: async () => Uint8Array.from(archive).buffer as ArrayBuffer });
    expect(result).toEqual({ valid: true, draft });
  });

  it('reports a file-read failure without throwing', async () => {
    const result = await readPortableBundleFile({ arrayBuffer: async () => { throw new Error('unavailable'); } });
    expect(result).toEqual({
      valid: false,
      issues: [{ path: '/', keyword: 'readFailure', message: 'The selected file could not be read.' }],
    });
  });
});
