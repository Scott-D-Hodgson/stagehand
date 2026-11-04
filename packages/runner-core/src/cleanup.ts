export class PrimaryFailureError extends Error {
  primary: unknown;
  secondary: unknown;
  constructor(primary: unknown, secondary: unknown) {
    super("Cleanup failed after an earlier execution failure.", { cause: primary });
    this.name = "PrimaryFailureError";
    this.primary = primary;
    this.secondary = secondary;
  }
}

export async function executeWithCleanup<Output>(
  execute: () => Promise<Output>,
  cleanup: () => Promise<void>,
): Promise<Output> {
  let output: Output | undefined;
  let primaryFailure: unknown;
  let executionFailed = false;
  try {
    output = await execute();
  } catch (error) {
    primaryFailure = error;
    executionFailed = true;
  }
  try {
    await cleanup();
  } catch (cleanupFailure) {
    if (executionFailed) {
      throw new PrimaryFailureError(primaryFailure, cleanupFailure);
    }
    throw cleanupFailure;
  }
  if (executionFailed) {
    throw primaryFailure;
  }
  return output as Output;
}
