import { isRecord } from "../json.js";
import type {
  NamedDataSet,
  SelectCaseDataSetOptions,
  SelectCaseDataSetResult,
  VariableDefinition,
} from "./types.js";

function findDataSet(dataSets: readonly NamedDataSet[], name: string): NamedDataSet | undefined {
  return dataSets.find((dataSet) => dataSet.name === name);
}

export function selectCaseDataSet(options: SelectCaseDataSetOptions): SelectCaseDataSetResult {
  const defaultName = isRecord(options.case) && typeof options.case.defaultDataSet === "string"
    ? options.case.defaultDataSet
    : undefined;
  const name = options.selectedDataSet ?? defaultName;
  if (name === undefined) {
    return { selected: true };
  }
  const dataSet = findDataSet(options.dataSets, name);
  if (dataSet === undefined) {
    return {
      selected: false,
      reason: "unknownDataSet",
      message: `No data set named "${name}" is available for this case.`,
    };
  }
  return {
    selected: true,
    name,
    source: options.selectedDataSet === undefined ? "caseDefault" : "selected",
    variables: dataSet.variables as Readonly<Record<string, VariableDefinition>>,
  };
}
