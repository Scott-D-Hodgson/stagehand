import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { createBundledEditorDraft } from '../document/plan-draft';
import { decodePortableBundle, encodePortableBundle } from './codec';

describe('portable bundle codec', () => {
  it('round-trips a valid plan and its referenced case at the exact relative path', () => {
    const draft = createBundledEditorDraft();
    draft.plan.id = 'portable-plan';
    draft.plan.cases = [{ path: 'cases/nested/checkout.json' }];
    draft.cases = { 'cases/nested/checkout.json': { id: 'checkout', steps: [], version: 1 } };
    const encoded = encodePortableBundle(draft);
    expect(encoded.valid).toBe(true);
    if (!encoded.valid) {
      return;
    }
    const decoded = decodePortableBundle(encoded.bytes);
    expect(decoded).toEqual({ valid: true, draft });
  });

  it('rejects export when a plan reference has no case document', () => {
    const draft = createBundledEditorDraft();
    draft.cases = {};
    const result = encodePortableBundle(draft);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'missingReference', path: '/cases/0/path' }));
  });

  it('rejects an archive with a missing referenced case entry', () => {
    const draft = createBundledEditorDraft();
    const archive = zipSync({ 'plan.json': strToU8(JSON.stringify(draft.plan)) });
    const result = decodePortableBundle(archive);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'missingReference', path: '/cases/0/path' }));
  });

  it('reports invalid JSON in the root plan entry', () => {
    const archive = zipSync({ 'plan.json': strToU8('{') });
    const result = decodePortableBundle(archive);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'invalidJson', path: '/plan.json' }));
  });

  it('rejects bytes that do not describe a ZIP archive', () => {
    const result = decodePortableBundle(strToU8('not a ZIP archive'));
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'invalidArchive', path: '/' }));
  });

  it('rejects an archive entry that traverses outside the portable bundle', () => {
    const draft = createBundledEditorDraft();
    const archive = zipSync({ '../outside.json': strToU8('{}'), 'plan.json': strToU8(JSON.stringify(draft.plan)), 'cases/landing-page.json': strToU8(JSON.stringify(draft.cases['cases/landing-page.json'])) });
    const result = decodePortableBundle(archive);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'unsafeArchivePath', path: '/../outside.json' }));
  });

  it('rejects unreferenced case entries instead of silently exporting extra data', () => {
    const draft = createBundledEditorDraft();
    const archive = zipSync({ 'plan.json': strToU8(JSON.stringify(draft.plan)), 'cases/extra.json': strToU8(JSON.stringify({ id: 'extra', steps: [], version: 1 })), 'cases/landing-page.json': strToU8(JSON.stringify(draft.cases['cases/landing-page.json'])) });
    const result = decodePortableBundle(archive);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }
    expect(result.issues).toContainEqual(expect.objectContaining({ keyword: 'unexpectedEntry', path: '/cases/extra.json' }));
  });
});
