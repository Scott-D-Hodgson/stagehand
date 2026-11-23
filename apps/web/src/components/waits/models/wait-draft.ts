export type WaitDraft = DelayWaitDraft | LocatorWaitDraft | PageStateWaitDraft;

export interface DelayWaitDraft {
  delay: number;
  timeout?: number;
}

export interface LocatorWaitDraft {
  timeout?: number;
  waitFor: {
    name?: string;
    role: string;
  };
}

export interface PageStateWaitDraft {
  timeout?: number;
  waitForState: 'domcontentloaded' | 'networkidle';
}

/*
Determines whether a raw value is one of the contract-supported wait drafts.
---
Inputs: An unknown item from an interaction Before or After list.
---
Output: Whether the value can be displayed and updated as a wait draft.
*/
export function isWaitDraft(value: unknown): value is WaitDraft {
  return typeof value === 'object' && value !== null && (('delay' in value && typeof value.delay === 'number') || ('waitFor' in value && typeof value.waitFor === 'object' && value.waitFor !== null) || ('waitForState' in value && (value.waitForState === 'domcontentloaded' || value.waitForState === 'networkidle')));
}
