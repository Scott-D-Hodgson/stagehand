import { escapeJsonPointerSegment, isRecord } from "../json.js";
import type { ValidationIssue } from "./types.js";

export function validateLocale(value: unknown, path: string): ValidationIssue[] {
  if (typeof value !== "string") {
    return [];
  }
  try {
    Intl.getCanonicalLocales(value);
    return [];
  } catch {
    return [{
      path,
      keyword: "invalidLocale",
      message: "Locale must be a well-formed BCP 47 language tag, such as en-CA.",
    }];
  }
}

export function validateTimeZone(value: unknown, path: string): ValidationIssue[] {
  if (typeof value !== "string") {
    return [];
  }
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format(0);
    return [];
  } catch {
    return [{
      path,
      keyword: "invalidTimeZone",
      message: "Time zone must be a valid IANA identifier supported by this runtime.",
    }];
  }
}

export function validateLocalizedValues(input: unknown, path: string): ValidationIssue[] {
  if (!isRecord(input) || !isRecord(input.locales)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  const canonicalKeys = new Map<string, string>();
  for (const locale of Object.keys(input.locales)) {
    const localePath = `${path}/locales/${escapeJsonPointerSegment(locale)}`;
    let canonicalLocale: string;
    try {
      canonicalLocale = Intl.getCanonicalLocales(locale)[0] ?? locale;
    } catch {
      issues.push({
        path: localePath,
        keyword: "invalidLocale",
        message: "Locale must be a well-formed BCP 47 language tag, such as fr-CA.",
      });
      continue;
    }
    const earlierLocale = canonicalKeys.get(canonicalLocale);
    if (earlierLocale !== undefined) {
      issues.push({
        path: localePath,
        keyword: "duplicateLocale",
        message: `Locale duplicates the canonical locale key at ${path}/locales/${escapeJsonPointerSegment(earlierLocale)}.`,
      });
      continue;
    }
    canonicalKeys.set(canonicalLocale, locale);
  }
  return issues;
}

export function validateVariables(input: unknown, path: string): ValidationIssue[] {
  if (!isRecord(input)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  for (const [name, definition] of Object.entries(input)) {
    issues.push(...validateLocalizedValues(
      definition,
      `${path}/${escapeJsonPointerSegment(name)}`,
    ));
  }
  return issues;
}
