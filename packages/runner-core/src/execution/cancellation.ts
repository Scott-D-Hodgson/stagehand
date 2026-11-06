export class CancellationError extends Error {
  constructor() {
    super("Run cancellation was requested.");
    this.name = "CancellationError";
  }
}

/*
Stops work when cancellation was requested.
---
Inputs: Optional abort signal.
---
Output: Completes or throws CancellationError.
*/
export function throwIfCancelled(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new CancellationError();
  }
}

/*
Runs items one at a time until cancelled.
---
Inputs: Inputs, async work function, and optional signal.
---
Output: Outputs in input order.
*/
export async function executeSequentially<Input, Output>(
  inputs: readonly Input[],
  execute: (input: Input, index: number) => Promise<Output>,
  signal?: AbortSignal,
): Promise<Output[]> {
  const outputs: Output[] = [];
  for (const [index, input] of inputs.entries()) {
    throwIfCancelled(signal);
    outputs.push(await execute(input, index));
  }
  return outputs;
}
