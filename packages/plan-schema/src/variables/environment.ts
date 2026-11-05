import type {
  ProtectedVariableValue,
  ResolveEnvironmentValueOptions,
  ResolveEnvironmentValueResult,
} from "./types.js";

/*
Builds the standard result for a missing environment value.
---
Inputs: An environment-variable name.
---
Output: A failed resolution result.
*/
function missingEnvironmentVariable(environmentVariable: string): ResolveEnvironmentValueResult {
  return {
    resolved: false,
    reason: "missingEnvironmentVariable",
    environmentVariable,
    message: `Required environment variable "${environmentVariable}" is not available.`,
  };
}

/*
Resolves one protected value from a supplied environment map.
---
Inputs: Environment reference options.
---
Output: A value or safe resolution failure.
*/
export function resolveEnvironmentValue(
  options: ResolveEnvironmentValueOptions,
): ResolveEnvironmentValueResult {
  const protectedValue: ProtectedVariableValue = options.value;
  if (!Object.hasOwn(options.environment, protectedValue.env)) {
    return missingEnvironmentVariable(protectedValue.env);
  }
  const value = options.environment[protectedValue.env];
  return value === undefined
    ? missingEnvironmentVariable(protectedValue.env)
    : { resolved: true, value, environmentVariable: protectedValue.env };
}
