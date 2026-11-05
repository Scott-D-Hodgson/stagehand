/*
Checks whether a value is a plain key-value object.
---
Inputs: Any value.
---
Output: True for a record object, otherwise false.
*/
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/*
Escapes one property name for a JSON Pointer path.
---
Inputs: A property-name string.
---
Output: A safe pointer segment.
*/
export function escapeJsonPointerSegment(value: string): string {
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}
