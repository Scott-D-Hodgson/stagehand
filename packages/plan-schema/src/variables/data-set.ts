import { isRecord } from "../json.js";
import type {
  NamedDataSet,
  SelectCaseDataSetOptions,
  SelectCaseDataSetResult,
  VariableDefinition,
} from "./types.js";

/*
Finds one named data set.
---
Inputs: Data sets and a requested name.
---
Output: The matching set or nothing.
*/
function findDataSet(dataSets: readonly NamedDataSet[], name: string): NamedDataSet | undefined {
  return dataSets.find((dataSet) => dataSet.name === name);
}

/*
Reads the default data-set variables from a case.
---
Inputs: A case value.
---
Output: Default variable definitions or nothing.
*/
function getDefaultVariables(caseFile: Readonly<Record<string, unknown>>): Readonly<Record<string, VariableDefinition>> | undefined {
  if (!isRecord(caseFile.dataSets) || !isRecord(caseFile.dataSets.default)) {
    return undefined;
  }
  return caseFile.dataSets.default as Readonly<Record<string, VariableDefinition>>;
}

/*
Chooses and layers the effective case data set.
---
Inputs: Case and data-set selection options.
---
Output: Selected variables or a safe failure.
*/
export function selectCaseDataSet(options: SelectCaseDataSetOptions): SelectCaseDataSetResult {
  const defaultVariables = getDefaultVariables(options.case);
  if (options.selectedDataSet === undefined) {
    return defaultVariables === undefined
      ? { selected: true }
      : { selected: true, source: "default", variables: defaultVariables };
  }
  const dataSet = findDataSet(options.dataSets, options.selectedDataSet);
  if (dataSet === undefined) {
    return {
      selected: false,
      reason: "unknownDataSet",
      message: `No data set named "${options.selectedDataSet}" is available for this case.`,
    };
  }
  return {
    selected: true,
    name: dataSet.name,
    source: "selected",
    variables: { ...defaultVariables, ...dataSet.variables },
  };
}
