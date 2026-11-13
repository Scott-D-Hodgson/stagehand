import type { ValidationIssue } from '@stagehand/plan-schema';
import type { EditorBundleDraft } from '../document/plan-draft';
import { decodePortableBundle } from './codec';

export interface PortableBundleFile {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export type PortableBundleImportResult =
  | { valid: true; draft: EditorBundleDraft }
  | { valid: false; issues: ValidationIssue[] };

/*
Reads and validates a browser-selected portable bundle without changing editor state.
---
Inputs: A file-like browser object that supplies its contents as an ArrayBuffer.
---
Output: A detached valid editor bundle or structured read and archive issues.
*/
export async function readPortableBundleFile(file: PortableBundleFile): Promise<PortableBundleImportResult> {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return decodePortableBundle(bytes);
  } catch {
    return {
      valid: false,
      issues: [{ path: '/', keyword: 'readFailure', message: 'The selected file could not be read.' }],
    };
  }
}
