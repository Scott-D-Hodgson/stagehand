export { caseSchemaV1, planSchemaV1 } from "./validation/schemas.js";
export { validatePlan } from "./validation/plan.js";
export { validateCase } from "./validation/case.js";
export { validatePlanBundle } from "./validation/bundle.js";
export type { ValidationIssue, ValidationResult } from "./validation/types.js";
export { matchCaseReferences } from "./references/match.js";
export type {
  CaseReferenceMatch,
  CaseReferenceMatchResult,
} from "./references/types.js";
export { resolveVariable } from "./variables/resolve.js";
export { resolveProtectedEnvironmentValue } from "./variables/environment.js";
export { selectCaseDataSet } from "./variables/data-set.js";
export { prepareCase, prepareCaseStep } from "./variables/prepare.js";
export { expandCaseSharedSteps, prepareCaseSharedSteps } from "./variables/shared-steps.js";
export type {
  PrepareCaseOptions,
  PrepareCaseResult,
  PrepareCaseStepOptions,
  PrepareCaseStepResult,
  PrepareCaseSharedStepsOptions,
  PrepareCaseSharedStepsResult,
  ExpandCaseSharedStepsOptions,
  ExpandCaseSharedStepsResult,
  ExpandedCaseStep,
  ResolveVariableOptions,
  ScalarVariableValue,
  ProtectedVariableValue,
  ResolveProtectedEnvironmentValueOptions,
  ResolveProtectedEnvironmentValueResult,
  VariableValue,
  NamedDataSet,
  SelectCaseDataSetOptions,
  SelectCaseDataSetResult,
  VariableDefinition,
  VariableResolutionResult,
  SharedStepGroup,
} from "./variables/types.js";
