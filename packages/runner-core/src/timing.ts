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

export function startElapsedTimer(clock: MonotonicClock = systemMonotonicClock): ElapsedTimer {
  return { startedAt: clock.now() };
}

export function elapsedMilliseconds(timer: ElapsedTimer, clock: MonotonicClock = systemMonotonicClock): number {
  return Math.max(0, Math.round(clock.now() - timer.startedAt));
}
