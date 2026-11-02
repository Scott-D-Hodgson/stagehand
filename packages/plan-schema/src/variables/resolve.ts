import type {
  ResolveVariableOptions,
  ScalarVariableValue,
  VariableDefinition,
  VariableResolutionResult,
} from "./types.js";

function selectLocaleValue(definition: VariableDefinition, locale: string): ScalarVariableValue {
  for (const [localeKey, value] of Object.entries(definition.locales ?? {})) {
    if (Intl.getCanonicalLocales(localeKey)[0] === locale) {
      return value;
    }
  }
  return definition.default;
}

export function resolveVariable(options: ResolveVariableOptions): VariableResolutionResult {
  let locale: string;
  try {
    locale = Intl.getCanonicalLocales(options.locale)[0] ?? options.locale;
  } catch {
    return {
      resolved: false,
      reason: "invalidLocale",
      message: "Locale must be a well-formed BCP 47 language tag, such as en-CA.",
    };
  }
  const scopes: Array<[
    "step" | "dataSet" | "case" | "plan",
    Readonly<Record<string, VariableDefinition>> | undefined,
  ]> = [
    ["step", options.stepVariables],
    ["dataSet", options.dataSetVariables],
    ["case", options.caseVariables],
    ["plan", options.planVariables],
  ];
  for (const [source, variables] of scopes) {
    if (variables !== undefined && Object.hasOwn(variables, options.name)) {
      const definition = variables[options.name];
      if (definition !== undefined) {
        return { resolved: true, value: selectLocaleValue(definition, locale), source };
      }
    }
  }
  return {
    resolved: false,
    reason: "missingVariable",
    message: options.dataSetVariables === undefined
      ? `No variable named "${options.name}" is defined in step, case, or plan scope.`
      : `No variable named "${options.name}" is defined in step, selected data set, case, or plan scope.`,
  };
}
