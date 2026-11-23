import type { EditorBundleDraft } from '../../services/planDraftService';

export type RecoveryRouteTarget =
  | { name: 'plan' }
  | { name: 'case'; cardIndex: number }
  | { name: 'step'; cardIndex: number; stepIndex: number }
  | { name: 'wait'; cardIndex: number; position: 'after' | 'before'; stepIndex: number; waitIndex: number };

export interface ResolveRecoveryRouteOptions {
  cardIndex: unknown;
  draft: EditorBundleDraft;
  position: unknown;
  routeName: unknown;
  stepIndex: unknown;
  waitIndex: unknown;
}

/*
Chooses the deepest still-valid route after restoring a local editor draft.
---
Inputs: A recovered bundle and the route parameters that were present before restoration.
---
Output: The retained valid route or its nearest valid Plan, Case, or Step ancestor.
*/
export function resolveRecoveryRoute(options: ResolveRecoveryRouteOptions): RecoveryRouteTarget {
  if (options.routeName !== 'case' && options.routeName !== 'step' && options.routeName !== 'wait') {
    return { name: 'plan' };
  }
  const cardIndex = toValidIndex(options.cardIndex, options.draft.plan.cases.length);
  if (cardIndex === undefined) {
    return { name: 'plan' };
  }
  const caseReference = options.draft.plan.cases[cardIndex];
  const caseDraft = caseReference === undefined ? undefined : options.draft.cases[caseReference.path];
  if (caseDraft === undefined) {
    return { name: 'plan' };
  }
  if (options.routeName === 'case') {
    return { name: 'case', cardIndex };
  }
  const stepIndex = toValidIndex(options.stepIndex, caseDraft.steps.length);
  if (stepIndex === undefined) {
    return { name: 'case', cardIndex };
  }
  if (options.routeName === 'step') {
    return { name: 'step', cardIndex, stepIndex };
  }
  const position = options.position === 'before' || options.position === 'after' ? options.position : undefined;
  const step = caseDraft.steps[stepIndex];
  const waits = position === undefined || typeof step !== 'object' || step === null ? undefined : (step as { after?: unknown; before?: unknown })[position];
  const waitIndex = Array.isArray(waits) ? toValidIndex(options.waitIndex, waits.length) : undefined;
  if (position === undefined || waitIndex === undefined) {
    return { name: 'step', cardIndex, stepIndex };
  }
  return { name: 'wait', cardIndex, position, stepIndex, waitIndex };
}

/*
Parses one route index and checks it against a collection length.
---
Inputs: A raw route parameter and the collection size it indexes.
---
Output: A safe zero-based index or undefined when the parameter is invalid.
*/
function toValidIndex(value: unknown, length: number): number | undefined {
  const index = typeof value === 'string' || typeof value === 'number' ? Number(value) : Number.NaN;
  return Number.isSafeInteger(index) && index >= 0 && index < length ? index : undefined;
}
