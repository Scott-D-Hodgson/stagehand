import type { ValidationIssue } from '@stagehand/plan-schema';
import type { EditorBundleDraft } from '../document/plan-draft';
import { encodePortableBundle } from './codec';

export interface PreparedPortableBundleExport {
  bytes: Uint8Array;
  filename: string;
}

export type PortableBundleExportPreparation =
  | { valid: true; bundle: PreparedPortableBundleExport }
  | { valid: false; issues: ValidationIssue[] };

/*
Normalizes an author-selected browser-download filename.
---
Inputs: A raw filename entered in the export dialog.
---
Output: A trimmed ZIP filename or undefined when no filename was supplied.
*/
export function normalizePortableBundleFilename(filename: string): string | undefined {
  const trimmed = filename.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  return trimmed.toLowerCase().endsWith('.zip') ? trimmed : `${trimmed}.zip`;
}

/*
Prepares a fully validated editor bundle for a browser ZIP download.
---
Inputs: The current in-memory plan and case-document draft bundle.
---
Output: Portable ZIP bytes and a plan-derived filename, or validation issues.
*/
export function preparePortableBundleExport(draft: EditorBundleDraft): PortableBundleExportPreparation {
  const encoded = encodePortableBundle(draft);
  if (!encoded.valid) {
    return encoded;
  }
  return {
    valid: true,
    bundle: {
      bytes: encoded.bytes,
      filename: `${draft.plan.id}.stagehand.zip`,
    },
  };
}
