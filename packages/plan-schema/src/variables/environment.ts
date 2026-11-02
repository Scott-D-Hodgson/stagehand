import type {
  ProtectedVariableValue,
  ResolveProtectedEnvironmentValueOptions,
  ResolveProtectedEnvironmentValueResult,
} from "./types.js";

function missingEnvironmentVariable(environmentVariable: string): ResolveProtectedEnvironmentValueResult {
  return {
    resolved: false,
    reason: "missingEnvironmentVariable",
    environmentVariable,
    message: `Required environment variable "${environmentVariable}" is not available.`,
  };
}

export function resolveProtectedEnvironmentValue(
  options: ResolveProtectedEnvironmentValueOptions,
): ResolveProtectedEnvironmentValueResult {
  const protectedValue: ProtectedVariableValue = options.value;
  if (!Object.hasOwn(options.environment, protectedValue.env)) {
    return missingEnvironmentVariable(protectedValue.env);
  }
  const value = options.environment[protectedValue.env];
  return value === undefined
    ? missingEnvironmentVariable(protectedValue.env)
    : { resolved: true, value, environmentVariable: protectedValue.env };
}
