import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { createHash, type Hash } from "node:crypto";
import { dirname, isAbsolute, posix, relative, sep } from "node:path";
import {
  matchCaseReferences,
  validatePlan,
  validatePlanBundle,
  type ValidationIssue,
} from "@stagehand/plan-schema";

export interface LoadedCaseFile {
  caseIndex: number;
  reference: string;
  normalizedPath: string;
  value: unknown;
}

export interface PlanSourceFingerprint {
  algorithm: "sha256-v1";
  digest: string;
}

export interface PlanLoadIssue extends ValidationIssue {
  reference?: string;
}

export type PlanFileLoadResult =
  | {
      valid: true;
      plan: unknown;
      cases: LoadedCaseFile[];
      fingerprint: PlanSourceFingerprint;
    }
  | {
      valid: false;
      issues: PlanLoadIssue[];
    };

/*
Turns an unknown thrown value into text for a returned load issue.
---
Inputs: any error value.
---
Output: a message string.
*/
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/*
Builds one consistent plan-loading issue.
---
Inputs: issue location, rule, message, and optional case reference.
---
Output: a typed issue.
*/
function makeIssue(options: {
  path: string;
  keyword: string;
  message: string;
  reference?: string;
}): PlanLoadIssue {
  if (options.reference === undefined) {
    return {
      path: options.path,
      keyword: options.keyword,
      message: options.message,
    };
  }
  return options;
}

/*
Checks whether a target is below, but not equal to, a directory.
---
Inputs: two resolved paths.
---
Output: true when contained.
*/
function isInsideDirectory(directoryPath: string, targetPath: string): boolean {
  const relativePath = relative(directoryPath, targetPath);
  return (
    relativePath.length > 0 &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${sep}`) &&
    !isAbsolute(relativePath)
  );
}

/*
Checks whether a target is a directory itself or is contained below it.
---
Inputs: two resolved paths.
---
Output: true when safe.
*/
function isSameOrInsideDirectory(directoryPath: string, targetPath: string): boolean {
  return (
    directoryPath === targetPath ||
    isInsideDirectory(directoryPath, targetPath)
  );
}

/*
Joins a filesystem directory with the spelling from a plan reference.
---
Inputs: directory and slash-separated reference.
---
Output: a platform path.
*/
function joinOriginalReference(
  directoryPath: string,
  reference: string,
): string {
  const prefix = directoryPath.endsWith(sep)
    ? directoryPath
    : `${directoryPath}${sep}`;
  return `${prefix}${reference.replaceAll("/", sep)}`;
}

/*
Normalizes a plan reference for logical matching only.
---
Inputs: a slash-separated reference.
---
Output: its normalized form.
*/
function normalizeAvailablePath(reference: string): string {
  return posix.normalize(reference);
}

/*
Finds a capitalization mismatch between a plan reference and disk.
---
Inputs: plan directory and reference.
---
Output: mismatch details or nothing.
*/
async function findCaseMismatch(
  planDirectory: string,
  reference: string,
): Promise<{ expected: string; actual: string } | undefined> {
  let currentDirectory = planDirectory;
  for (const segment of reference.split("/")) {
    if (segment === "." || segment === "") {
      continue;
    }
    if (segment === "..") {
      try {
        currentDirectory = dirname(await realpath(currentDirectory));
      } catch {
        return undefined;
      }
      continue;
    }
    let canonicalDirectory: string;
    try {
      canonicalDirectory = await realpath(currentDirectory);
    } catch {
      return undefined;
    }
    if (
      canonicalDirectory !== planDirectory &&
      !isInsideDirectory(planDirectory, canonicalDirectory)
    ) {
      return undefined;
    }
    let entries: string[];
    try {
      entries = await readdir(canonicalDirectory);
    } catch {
      return undefined;
    }
    const actualSegment = entries.includes(segment)
      ? segment
      : entries.find(
          (entry) => entry.toLowerCase() === segment.toLowerCase(),
        );
    if (actualSegment === undefined) {
      return undefined;
    }
    if (actualSegment !== segment) {
      return { expected: segment, actual: actualSegment };
    }
    currentDirectory = joinOriginalReference(canonicalDirectory, actualSegment);
  }
  return undefined;
}

type CasePathResolution =
  | { valid: true; path: string }
  | { valid: false; keyword: "caseFileError" | "pathEscapesPlan"; message: string };

/*
Adds one length-prefixed byte value to a fingerprint hash.
---
Inputs: hash and bytes.
---
Output: updates the supplied hash.
*/
function updateLengthPrefixed(hash: Hash, value: Uint8Array): void {
  const prefix = Buffer.alloc(8);
  prefix.writeBigUInt64BE(BigInt(value.byteLength));
  hash.update(prefix);
  hash.update(value);
}

/*
Adds one labelled source record to a fingerprint hash.
---
Inputs: hash, label, and raw contents.
---
Output: updates the supplied hash.
*/
function updateFingerprintRecord(
  hash: Hash,
  label: string,
  contents: Uint8Array,
): void {
  updateLengthPrefixed(hash, Buffer.from(label, "utf8"));
  updateLengthPrefixed(hash, contents);
}

/*
Creates the sha256-v1 identity for loaded plan and case bytes.
---
Inputs: plan bytes and ordered case bytes.
---
Output: fingerprint metadata.
*/
function createSourceFingerprint(
  planContents: Uint8Array,
  caseFiles: readonly { normalizedPath: string; contents: Uint8Array }[],
): PlanSourceFingerprint {
  const hash = createHash("sha256");
  updateFingerprintRecord(hash, "plan", planContents);
  for (const caseFile of caseFiles) {
    updateFingerprintRecord(hash, caseFile.normalizedPath, caseFile.contents);
  }
  return { algorithm: "sha256-v1", digest: hash.digest("hex") };
}

/*
Resolves a case reference segment by segment without allowing it outside the plan folder.
---
Inputs: plan directory and reference.
---
Output: safe path or issue details.
*/
async function resolveOriginalReference(
  planDirectory: string,
  reference: string,
): Promise<CasePathResolution> {
  let currentPath = planDirectory;
  for (const segment of reference.split("/")) {
    if (segment === "") {
      continue;
    }
    if (segment === "." || segment === "..") {
      try {
        const currentStats = await stat(currentPath);
        if (!currentStats.isDirectory()) {
          return {
            valid: false,
            keyword: "caseFileError",
            message: `Case reference "${reference}" passes through a file where a folder is required.`,
          };
        }
      } catch (error) {
        return {
          valid: false,
          keyword: "caseFileError",
          message: `Could not resolve case file "${reference}": ${getErrorMessage(error)}`,
        };
      }
      if (segment === "..") {
        currentPath = dirname(currentPath);
      }
    } else {
      try {
        currentPath = await realpath(
          joinOriginalReference(currentPath, segment),
        );
      } catch (error) {
        return {
          valid: false,
          keyword: "caseFileError",
          message: `Could not resolve case file "${reference}": ${getErrorMessage(error)}`,
        };
      }
    }
    if (!isSameOrInsideDirectory(planDirectory, currentPath)) {
      return {
        valid: false,
        keyword: "pathEscapesPlan",
        message: `Case file "${reference}" resolves outside the plan folder.`,
      };
    }
  }
  return { valid: true, path: currentPath };
}

/*
Adds the original plan reference to a plan-validation issue when its path identifies a case entry.
---
Inputs: issue and references.
---
Output: enriched issue.
*/
function addReferenceToIssue(
  issue: ValidationIssue,
  references: readonly string[],
): PlanLoadIssue {
  const match = /^\/cases\/(\d+)\/path$/.exec(issue.path);
  if (match?.[1] === undefined) {
    return issue;
  }
  const reference = references[Number(match[1])];
  if (reference === undefined) {
    return issue;
  }
  return { ...issue, reference };
}

/*
Adds the original plan reference to a bundle-validation issue when its path identifies a loaded case.
---
Inputs: issue and references.
---
Output: enriched issue.
*/
function addReferenceToCaseIssue(
  issue: ValidationIssue,
  references: readonly string[],
): PlanLoadIssue {
  const match = /^\/caseFiles\/(\d+)(?:\/|$)/.exec(issue.path);
  if (match?.[1] === undefined) {
    return issue;
  }
  const reference = references[Number(match[1])];
  if (reference === undefined) {
    return issue;
  }
  return { ...issue, reference };
}

/*
Loads, validates, and fingerprints one plan with its referenced cases.
---
Inputs: plan file path.
---
Output: validated bundle and fingerprint, or safe issues.
*/
export async function loadPlanFile(
  planFilePath: string,
): Promise<PlanFileLoadResult> {
  let canonicalPlanPath: string;
  try {
    canonicalPlanPath = await realpath(planFilePath);
  } catch (error) {
    return {
      valid: false,
      issues: [
        makeIssue({
          path: "/plan",
          keyword: "planFileError",
          message: `Could not resolve plan file "${planFilePath}": ${getErrorMessage(error)}`,
        }),
      ],
    };
  }
  let planContents: Buffer;
  try {
    planContents = await readFile(canonicalPlanPath);
  } catch (error) {
    return {
      valid: false,
      issues: [
        makeIssue({
          path: "/plan",
          keyword: "planFileError",
          message: `Could not read plan file "${planFilePath}": ${getErrorMessage(error)}`,
        }),
      ],
    };
  }
  let parsedPlan: unknown;
  try {
    parsedPlan = JSON.parse(planContents.toString("utf8"));
  } catch (error) {
    return {
      valid: false,
      issues: [
        makeIssue({
          path: "/plan",
          keyword: "invalidJson",
          message: `Plan file "${planFilePath}" is not valid JSON: ${getErrorMessage(error)}`,
        }),
      ],
    };
  }
  const planResult = validatePlan(parsedPlan);
  if (!planResult.valid) {
    return { valid: false, issues: planResult.issues };
  }
  const plan = parsedPlan as { cases: Array<{ path: string }> };
  const references = plan.cases.map(({ path }) => path);
  const availablePaths = [...new Set(references.map(normalizeAvailablePath))];
  const matchResult = matchCaseReferences(plan, availablePaths);
  if (!matchResult.valid) {
    return {
      valid: false,
      issues: matchResult.issues.map((issue) =>
        addReferenceToIssue(issue, references),
      ),
    };
  }
  const planDirectory = dirname(canonicalPlanPath);
  const loadedCases: LoadedCaseFile[] = [];
  const caseSourceFiles: { normalizedPath: string; contents: Buffer }[] = [];
  for (const match of matchResult.matches) {
    const caseMismatch = await findCaseMismatch(
      planDirectory,
      match.reference,
    );
    if (caseMismatch !== undefined) {
      return {
        valid: false,
        issues: [
          makeIssue({ path: `/cases/${match.caseIndex}/path`, keyword: "caseMismatch", message: `Case reference segment "${caseMismatch.expected}" does not match the on-disk capitalization "${caseMismatch.actual}".`, reference: match.reference }),
        ],
      };
    }
    const resolution = await resolveOriginalReference(
      planDirectory,
      match.reference,
    );
    if (!resolution.valid) {
      return {
        valid: false,
        issues: [
          makeIssue({ path: `/cases/${match.caseIndex}/path`, keyword: resolution.keyword, message: resolution.message, reference: match.reference }),
        ],
      };
    }
    const canonicalCasePath = resolution.path;
    let caseContents: Buffer;
    try {
      const caseStats = await stat(canonicalCasePath);
      if (!caseStats.isFile()) {
        return {
          valid: false,
          issues: [
            makeIssue({ path: `/cases/${match.caseIndex}/path`, keyword: "notAFile", message: `Case reference "${match.reference}" does not point to a file.`, reference: match.reference }),
          ],
        };
      }
      caseContents = await readFile(canonicalCasePath);
    } catch (error) {
      return {
        valid: false,
        issues: [
          makeIssue({ path: `/cases/${match.caseIndex}/path`, keyword: "caseFileError", message: `Could not read case file "${match.reference}": ${getErrorMessage(error)}`, reference: match.reference }),
        ],
      };
    }
    let parsedCase: unknown;
    try {
      parsedCase = JSON.parse(caseContents.toString("utf8"));
    } catch (error) {
      return {
        valid: false,
        issues: [
          makeIssue({ path: `/cases/${match.caseIndex}/path`, keyword: "invalidJson", message: `Case file "${match.reference}" is not valid JSON: ${getErrorMessage(error)}`, reference: match.reference }),
        ],
      };
    }
    loadedCases.push({
      caseIndex: match.caseIndex,
      reference: match.reference,
      normalizedPath: match.normalizedPath,
      value: parsedCase,
    });
    caseSourceFiles.push({
      normalizedPath: match.normalizedPath,
      contents: caseContents,
    });
  }
  const bundleResult = validatePlanBundle(
    plan,
    loadedCases.map(({ value }) => value),
  );
  if (!bundleResult.valid) {
    return {
      valid: false,
      issues: bundleResult.issues.map((issue) =>
        addReferenceToCaseIssue(issue, references),
      ),
    };
  }
  return {
    valid: true,
    plan,
    cases: loadedCases,
    fingerprint: createSourceFingerprint(planContents, caseSourceFiles),
  };
}
