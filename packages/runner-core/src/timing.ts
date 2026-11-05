export interface MonotonicClock {
  now(): number;
}

export interface ElapsedTimer {
  startedAt: number;
}

export const systemMonotonicClock: MonotonicClock = {
  now() {
    return performance.now();
  },
};

/*
Starts an elapsed-time measurement.
---
Inputs: Optional monotonic clock.
---
Output: A timer start record.
*/
export function startElapsedTimer(clock: MonotonicClock = systemMonotonicClock): ElapsedTimer {
  return { startedAt: clock.now() };
}

/*
Calculates non-negative elapsed milliseconds.
---
Inputs: Timer and optional monotonic clock.
---
Output: Rounded duration in milliseconds.
*/
export function elapsedMilliseconds(timer: ElapsedTimer, clock: MonotonicClock = systemMonotonicClock): number {
  return Math.max(0, Math.round(clock.now() - timer.startedAt));
}
