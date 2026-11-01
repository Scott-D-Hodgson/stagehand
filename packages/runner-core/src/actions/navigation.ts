import type { Page, Response } from "playwright";
import { DEFAULT_NAVIGATION_TIMEOUT } from "../defaults.js";

export type NavigationWaitUntil = "domcontentloaded" | "networkidle";

export interface NavigationOptions {
  timeout?: number;
  waitUntil?: NavigationWaitUntil;
}

function validateNavigationUrl(url: string): void {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    throw new TypeError("Navigation URL must be an absolute HTTP or HTTPS URL with a host.");
  }
  try {
    const parsedUrl = new URL(url);
    if (
      (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") ||
      parsedUrl.hostname.length === 0
    ) {
      throw new TypeError("Navigation URL must be an absolute HTTP or HTTPS URL with a host.");
    }
  } catch {
    throw new TypeError("Navigation URL must be an absolute HTTP or HTTPS URL with a host.");
  }
}

export async function executeNavigation(
  page: Page,
  url: string,
  options: NavigationOptions,
): Promise<Response | null> {
  validateNavigationUrl(url);
  const timeout = options.timeout ?? DEFAULT_NAVIGATION_TIMEOUT;
  if (!Number.isInteger(timeout) || timeout < 1) {
    throw new RangeError("Navigation timeout must be a positive integer in milliseconds.");
  }
  const waitUntil = options.waitUntil ?? "domcontentloaded";
  if (waitUntil !== "domcontentloaded" && waitUntil !== "networkidle") {
    throw new RangeError("Navigation waitUntil must be domcontentloaded or networkidle.");
  }
  return page.goto(url, { timeout, waitUntil });
}
