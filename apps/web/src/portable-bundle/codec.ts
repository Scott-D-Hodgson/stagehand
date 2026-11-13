import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { matchCaseReferences, validatePlanBundle, type ValidationIssue } from '@stagehand/plan-schema';
import type { CaseDraft, EditorBundleDraft, PlanDraft } from '../document/plan-draft';

const planEntryPath = 'plan.json';

export type PortableBundleDecodeResult =
  | { valid: true; draft: EditorBundleDraft }
  | { valid: false; issues: ValidationIssue[] };

export type PortableBundleEncodeResult =
  | { valid: true; bytes: Uint8Array }
  | { valid: false; issues: ValidationIssue[] };

/*
Decodes a portable Stagehand ZIP archive into a detached editor bundle.
---
Inputs: ZIP archive bytes containing root plan.json and referenced case files.
---
Output: A validated editor bundle or structured archive and contract issues.
*/
export function decodePortableBundle(bytes: Uint8Array): PortableBundleDecodeResult {
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(bytes);
  } catch {
    return { valid: false, issues: [createIssue('/', 'invalidArchive', 'The selected file is not a readable ZIP archive.')] };
  }
  const entryPathIssues = getArchiveEntryPathIssues(Object.keys(entries));
  if (entryPathIssues.length > 0) {
    return { valid: false, issues: entryPathIssues };
  }
  const planBytes = entries[planEntryPath];
  if (planBytes === undefined) {
    return { valid: false, issues: [createIssue(`/${planEntryPath}`, 'missingPlan', 'The ZIP archive must contain plan.json at its root.')] };
  }
  const planResult = parseJsonEntry(planEntryPath, planBytes);
  if (!planResult.valid) {
    return planResult;
  }
  const casePaths = Object.keys(entries).filter((path) => path !== planEntryPath);
  const matches = matchCaseReferences(planResult.value, casePaths);
  if (!matches.valid) {
    return { valid: false, issues: matches.issues };
  }
  const unexpectedEntryIssues = getUnexpectedEntryIssues(casePaths, matches.matches.map((match) => match.filePath));
  if (unexpectedEntryIssues.length > 0) {
    return { valid: false, issues: unexpectedEntryIssues };
  }
  const parsedCases: unknown[] = [];
  for (const match of matches.matches) {
    const caseBytes = entries[match.filePath];
    if (caseBytes === undefined) {
      return { valid: false, issues: [createIssue(`/${match.filePath}`, 'missingReference', `No archive entry matches case reference "${match.reference}".`)] };
    }
    const caseResult = parseJsonEntry(match.filePath, caseBytes);
    if (!caseResult.valid) {
      return caseResult;
    }
    parsedCases.push(caseResult.value);
  }
  const bundleValidation = validatePlanBundle(planResult.value, parsedCases);
  if (!bundleValidation.valid) {
    return bundleValidation;
  }
  return {
    valid: true,
    draft: {
      cases: Object.fromEntries(matches.matches.map((match, index) => [match.reference, parsedCases[index] as CaseDraft])),
      plan: planResult.value as PlanDraft,
    },
  };
}

/*
Encodes a valid editor bundle into the portable Stagehand ZIP layout.
---
Inputs: An in-memory plan draft and its case drafts.
---
Output: ZIP bytes or structured validation issues for a non-exportable draft.
*/
export function encodePortableBundle(draft: EditorBundleDraft): PortableBundleEncodeResult {
  const validation = validateEditorBundleDraft(draft);
  if (!validation.valid) {
    return validation;
  }
  const entries: Record<string, Uint8Array> = {
    [planEntryPath]: strToU8(`${JSON.stringify(draft.plan, null, 2)}\n`),
  };
  for (const reference of draft.plan.cases) {
    const caseDraft = draft.cases[reference.path];
    if (caseDraft !== undefined) {
      entries[reference.path] = strToU8(`${JSON.stringify(caseDraft, null, 2)}\n`);
    }
  }
  return { valid: true, bytes: zipSync(entries) };
}

/*
Validates an editor bundle before it can be exported as a portable archive.
---
Inputs: An in-memory plan draft and its case drafts.
---
Output: Valid confirmation or the shared-contract and layout issues.
*/
export function validateEditorBundleDraft(draft: EditorBundleDraft): { valid: true } | { valid: false; issues: ValidationIssue[] } {
  const matches = matchCaseReferences(draft.plan, Object.keys(draft.cases));
  if (!matches.valid) {
    return { valid: false, issues: matches.issues };
  }
  const unexpectedEntryIssues = getUnexpectedEntryIssues(Object.keys(draft.cases), matches.matches.map((match) => match.filePath));
  if (unexpectedEntryIssues.length > 0) {
    return { valid: false, issues: unexpectedEntryIssues };
  }
  const parsedCases = matches.matches.map((match) => draft.cases[match.filePath]);
  const bundleValidation = validatePlanBundle(draft.plan, parsedCases);
  return bundleValidation.valid ? { valid: true } : bundleValidation;
}

/*
Parses one UTF-8 JSON archive entry without exposing parser exceptions.
---
Inputs: An archive entry path and its uncompressed bytes.
---
Output: Parsed JSON data or one issue naming the invalid entry.
*/
function parseJsonEntry(path: string, bytes: Uint8Array): { valid: true; value: unknown } | { valid: false; issues: ValidationIssue[] } {
  try {
    return { valid: true, value: JSON.parse(strFromU8(bytes)) };
  } catch {
    return { valid: false, issues: [createIssue(`/${path}`, 'invalidJson', `Archive entry "${path}" is not valid JSON.`)] };
  }
}

/*
Checks that every ZIP entry uses a safe portable relative path.
---
Inputs: Archive entry paths reported by the ZIP decoder.
---
Output: Issues for absolute, backslash, empty, or traversal entry paths.
*/
function getArchiveEntryPathIssues(paths: readonly string[]): ValidationIssue[] {
  return paths.flatMap((path) => isSafeArchiveEntryPath(path) ? [] : [createIssue(`/${path}`, 'unsafeArchivePath', `Archive entry "${path}" is not a safe portable relative path.`)]);
}

/*
Determines whether a ZIP entry uses a portable non-traversing path.
---
Inputs: One archive entry path.
---
Output: Whether the path is safe to compare with plan case references.
*/
function isSafeArchiveEntryPath(path: string): boolean {
  return path.length > 0
    && !path.includes('\\')
    && !path.startsWith('/')
    && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(path)
    && path.split('/').every((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
}

/*
Reports archive or draft cases that are not referenced by the plan.
---
Inputs: All available case paths and the paths matched to plan references.
---
Output: Issues for entries outside the transparent portable bundle layout.
*/
function getUnexpectedEntryIssues(availablePaths: readonly string[], matchedPaths: readonly string[]): ValidationIssue[] {
  const matched = new Set(matchedPaths);
  return availablePaths.flatMap((path) => matched.has(path) ? [] : [createIssue(`/${path}`, 'unexpectedEntry', `Archive entry "${path}" is not referenced by plan.json.`)]);
}

/*
Creates one structured codec issue.
---
Inputs: JSON-pointer-like path, stable keyword, and author-facing message.
---
Output: A validation issue compatible with shared validation reporting.
*/
function createIssue(path: string, keyword: string, message: string): ValidationIssue {
  return { path, keyword, message };
}
