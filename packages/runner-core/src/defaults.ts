import type { Viewport } from "./browser/types.js";

export const DEFAULT_VIEWPORT: Viewport = { width: 1280, height: 720 };

export const DEFAULT_LOCATOR_TIMEOUT = 30_000;

export const DEFAULT_WAIT_TIMEOUT = 30_000;

export const DEFAULT_NAVIGATION_TIMEOUT = 30_000;

export const LOCATOR_RETRY_DELAY = 1_000;

export const MAX_LOCATOR_ATTEMPTS = 3;
