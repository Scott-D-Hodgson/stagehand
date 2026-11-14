import { describe, expect, it } from 'vitest';
import { createBundledEditorDraft } from '../document/plan-draft';
import { normalizePortableBundleFilename, preparePortableBundleExport } from './export';

describe('portable bundle export preparation', () => {
  it('prepares a validated plan using its identifier as the download filename', () => {
    const draft = createBundledEditorDraft();
    draft.plan.id = 'checkout-smoke';
    const result = preparePortableBundleExport(draft);
    expect(result.valid).toBe(true);
    if (!result.valid) {
      return;
    }
    expect(result.bundle.filename).toBe('checkout-smoke.stagehand.zip');
    expect(result.bundle.bytes).toBeInstanceOf(Uint8Array);
  });

  it('refuses to prepare an export when a referenced case is absent', () => {
    const draft = createBundledEditorDraft();
    draft.cases = {};
    const result = preparePortableBundleExport(draft);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'missingReference' }));
  });

  it('adds a ZIP extension to a non-empty filename but retains an existing one', () => {
    expect(normalizePortableBundleFilename(' checkout ')).toBe('checkout.zip');
    expect(normalizePortableBundleFilename('checkout.stagehand.zip')).toBe('checkout.stagehand.zip');
    expect(normalizePortableBundleFilename('   ')).toBeUndefined();
  });
});
