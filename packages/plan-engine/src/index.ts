import { readFile, readdir, realpath, stat } from "node:fs/promises";
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

export interface PlanLoadIssue extends ValidationIssue {
  reference?: string;
}

export type PlanFileLoadResult =
  | {
      valid: true;
      plan: unknown;
      cases: LoadedCaseFile[];
    }
  | {
      valid: false;
      issues: PlanLoadIssue[];
    };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function makeIssue(
  path: string,
  keyword: string,
  message: string,
  reference?: string,
): PlanLoadIssue {
  if (reference === undefined) {
    return { path, keyword, message };
  }
  return { path, keyword, message, reference };
}

function isInsideDirectory(directoryPath: string, targetPath: string): boolean {
  const relativePath = relative(directoryPath, targetPath);
  return (
    relativePath.length > 0 &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${sep}`) &&
    !isAbsolute(relativePath)
  );
}

function isSameOrInsideDirectory(directoryPath: string, targetPath: string): boolean {
  return (
    directoryPath === targetPath ||
    isInsideDirectory(directoryPath, targetPath)
  );
}

function joinOriginalReference(
  directoryPath: string,
  reference: string,
): string {
  const prefix = directoryPath.endsWith(sep)
    ? directoryPath
    : `${directoryPath}${sep}`;
  return `${prefix}${reference.replaceAll("/", sep)}`;
}

function normalizeAvailablePath(reference: string): string {
  return posix.normalize(reference);
}

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
        makeIssue(
          "/plan",
          "planFileError",
          `Could not resolve plan file "${planFilePath}": ${getErrorMessage(error)}`,
        ),
      ],
    };
  }
  let planText: string;
  try {
    planText = await readFile(canonicalPlanPath, "utf8");
  } catch (error) {
    return {
      valid: false,
      issues: [
        makeIssue(
          "/plan",
          "planFileError",
          `Could not read plan file "${planFilePath}": ${getErrorMessage(error)}`,
        ),
      ],
    };
  }
  let parsedPlan: unknown;
  try {
    parsedPlan = JSON.parse(planText);
  } catch (error) {
    return {
      valid: false,
      issues: [
        makeIssue(
          "/plan",
          "invalidJson",
          `Plan file "${planFilePath}" is not valid JSON: ${getErrorMessage(error)}`,
        ),
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
  for (const match of matchResult.matches) {
    const caseMismatch = await findCaseMismatch(
      planDirectory,
      match.reference,
    );
    if (caseMismatch !== undefined) {
      return {
        valid: false,
        issues: [
          makeIssue(
            `/cases/${match.caseIndex}/path`,
            "caseMismatch",
            `Case reference segment "${caseMismatch.expected}" does not match the on-disk capitalization "${caseMismatch.actual}".`,
            match.reference,
          ),
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
          makeIssue(
            `/cases/${match.caseIndex}/path`,
            resolution.keyword,
            resolution.message,
            match.reference,
          ),
        ],
      };
    }
    const canonicalCasePath = resolution.path;
    let caseText: string;
    try {
      const caseStats = await stat(canonicalCasePath);
      if (!caseStats.isFile()) {
        return {
          valid: false,
          issues: [
            makeIssue(
              `/cases/${match.caseIndex}/path`,
              "notAFile",
              `Case reference "${match.reference}" does not point to a file.`,
              match.reference,
            ),
          ],
        };
      }
      caseText = await readFile(canonicalCasePath, "utf8");
    } catch (error) {
      return {
        valid: false,
        issues: [
          makeIssue(
            `/cases/${match.caseIndex}/path`,
            "caseFileError",
            `Could not read case file "${match.reference}": ${getErrorMessage(error)}`,
            match.reference,
          ),
        ],
      };
    }
    let parsedCase: unknown;
    try {
      parsedCase = JSON.parse(caseText);
    } catch (error) {
      return {
        valid: false,
        issues: [
          makeIssue(
            `/cases/${match.caseIndex}/path`,
            "invalidJson",
            `Case file "${match.reference}" is not valid JSON: ${getErrorMessage(error)}`,
            match.reference,
          ),
        ],
      };
    }
    loadedCases.push({
      caseIndex: match.caseIndex,
      reference: match.reference,
      normalizedPath: match.normalizedPath,
      value: parsedCase,
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
  return { valid: true, plan, cases: loadedCases };
}
