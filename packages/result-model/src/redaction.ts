export const REDACTED_EVIDENCE_VALUE = "[REDACTED]";

/*
Replaces known protected text in one string.
---
Inputs: text and protected values.
---
Output: a redacted copy.
*/
function redactString(value: string, protectedValues: readonly string[]): string {
  let redacted = value;
  for (const protectedValue of protectedValues) {
    redacted = redacted.replaceAll(protectedValue, REDACTED_EVIDENCE_VALUE);
  }
  return redacted;
}

/*
Copies and redacts strings throughout JSON-like data.
---
Inputs: a value and protected values.
---
Output: a detached redacted value.
*/
function redactValue(value: unknown, protectedValues: readonly string[]): unknown {
  if (typeof value === "string") {
    return redactString(value, protectedValues);
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, protectedValues));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactValue(item, protectedValues)]),
    );
  }
  return value;
}

/*
Makes a redacted copy of retained evidence.
---
Inputs: JSON-like evidence and known protected values.
---
Output: same-shaped safe copy.
*/
export function redactEvidence<T>(evidence: T, protectedValues: readonly string[]): T {
  const values = [...new Set(protectedValues.filter((value) => value.length > 0))]
    .sort((left, right) => right.length - left.length);
  return redactValue(evidence, values) as T;
}
