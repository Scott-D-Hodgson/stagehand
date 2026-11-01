import type { ValidationIssue } from "../validation/types.js";

export interface CaseReferenceMatch {
  caseIndex: number;
  reference: string;
  normalizedPath: string;
  filePath: string;
}

export type CaseReferenceMatchResult =
  | { valid: true; matches: CaseReferenceMatch[] }
  | { valid: false; matches: CaseReferenceMatch[]; issues: ValidationIssue[] };
