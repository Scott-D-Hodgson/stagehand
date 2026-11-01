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
export { prepareCase, prepareCaseStep } from "./variables/prepare.js";
export type {
  PrepareCaseOptions,
  PrepareCaseResult,
  PrepareCaseStepOptions,
  PrepareCaseStepResult,
  ResolveVariableOptions,
  ScalarVariableValue,
  VariableDefinition,
  VariableResolutionResult,
} from "./variables/types.js";
