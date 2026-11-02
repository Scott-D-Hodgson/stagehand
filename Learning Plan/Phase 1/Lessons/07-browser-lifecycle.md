# Lesson 7: Browser lifecycle and isolation

> “How can cases share one browser without sharing their page state?” — Bianca “Browser Boundary” Bell, Developer

Runner-core launches one Chromium process and creates a separate context and page per case. A context is like a private browser profile: it isolates cookies and storage while sharing the process.

Headless mode and locale are run-wide; viewport and time zone can vary per context. Coordinated shutdown waits for in-flight setup, closes sessions, and then closes the browser.

## Try it

Explain why one case can change viewport but cannot choose a different headless mode.

## You are ready when

- You can distinguish browser, context, and page.
- You can describe safe cleanup order.

