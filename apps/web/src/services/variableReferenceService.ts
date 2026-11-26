import type { EditorBundleDraft } from './planDraftService';

export interface VariableReferenceLocation {
  document: string;
  path: string;
}

/*
Finds exact variable-reference objects throughout the preserved bundle.
---
Inputs: An editor bundle and a case-sensitive variable name.
---
Output: Document names and JSON paths containing matching references.
*/
export function findVariableReferences(bundle: EditorBundleDraft, name: string): VariableReferenceLocation[] {
  const locations: VariableReferenceLocation[] = [];

  /*
  Collects matching reference paths from one nested document value.
  ---
  Inputs: A value, document name, and JSON path.
  ---
  Output: Matching locations appended to the result.
  */
  function visit(value: unknown, document: string, path: string): void {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, document, `${path}/${index}`));
      return;
    }
    if (value === null || typeof value !== 'object') {
      return;
    }
    const object = value as Record<string, unknown>;
    if (Object.keys(object).length === 1 && object.var === name) {
      locations.push({ document, path });
      return;
    }
    for (const [key, nested] of Object.entries(object)) {
      visit(nested, document, `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`);
    }
  }
  visit(bundle.plan.sharedSteps, 'plan.json', '/sharedSteps');
  for (const [path, caseDraft] of Object.entries(bundle.cases)) {
    visit(caseDraft, path, '');
  }
  return locations;
}

/*
Finds narrower definitions that make an automatic Plan rename ambiguous.
---
Inputs: An editor bundle and the old and new variable names.
---
Output: Case and step paths containing potentially conflicting definitions.
*/
export function findVariableRenameConflicts(bundle: EditorBundleDraft, oldName: string, newName: string): VariableReferenceLocation[] {
  const locations: VariableReferenceLocation[] = [];

  /*
  Collects potentially conflicting narrower variable definitions.
  ---
  Inputs: A value, document name, and JSON path.
  ---
  Output: Conflicting definition locations appended to the result.
  */
  function visit(value: unknown, document: string, path: string): void {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, document, `${path}/${index}`));
      return;
    }
    if (value === null || typeof value !== 'object') {
      return;
    }
    const object = value as Record<string, unknown>;
    for (const [key, nested] of Object.entries(object)) {
      const nextPath = `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`;
      if ((key === 'variables' || path.endsWith('/dataSets')) && nested !== null && typeof nested === 'object' && !Array.isArray(nested)) {
        if (Object.hasOwn(nested, oldName) || Object.hasOwn(nested, newName)) {
          locations.push({ document, path: nextPath });
        }
      }
      visit(nested, document, nextPath);
    }
  }
  for (const [path, caseDraft] of Object.entries(bundle.cases)) {
    visit(caseDraft, path, '');
  }
  return locations;
}

/*
Rewrites exact matching reference objects without mutating the source value.
---
Inputs: A JSON-like value and the old and new variable names.
---
Output: A detached value containing renamed references.
*/
export function renameVariableReferences(value: unknown, oldName: string, newName: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => renameVariableReferences(item, oldName, newName));
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const object = value as Record<string, unknown>;
  if (Object.keys(object).length === 1 && object.var === oldName) {
    return { var: newName };
  }
  return Object.fromEntries(Object.entries(object).map(([key, nested]) => [key, renameVariableReferences(nested, oldName, newName)]));
}
