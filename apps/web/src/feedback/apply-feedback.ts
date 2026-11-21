import { ref } from 'vue';

export const appliedChangesVisible = ref(false);
let dismissalTimer: ReturnType<typeof window.setTimeout> | undefined;

/*
Displays a short confirmation after an author applies valid changes.
---
Inputs: A successful form-application action.
---
Output: A visible confirmation toast that automatically dismisses.
*/
export function showAppliedChanges(): void {
  appliedChangesVisible.value = true;
  if (dismissalTimer !== undefined) {
    window.clearTimeout(dismissalTimer);
  }
  dismissalTimer = window.setTimeout(() => { appliedChangesVisible.value = false; }, 3_000);
}
