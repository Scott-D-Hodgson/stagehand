# ADR-002 — Local-first test-plan editor

**Status:** Accepted

## Context

Users should be able to use a hosted or self-hosted Vue SPA without adopting a central test-plan repository. Some users may later want an offline desktop package.

## Decision

The editor is a client-side, statically hostable Vue SPA. The MVP supports current stable desktop Chrome and Edge on Windows and handles user-owned files through upload/import and download/export. Direct filesystem access is deferred to TE-020. The initial experience is controlled form-based editing; a raw JSON editor is deferred. Browser storage may provide convenience. After the app has loaded, the open editor should continue working offline; offline cold-start/reopening is not required initially. Electron packaging remains a later distribution option that can reuse the same editor code.

## Consequences

- The core editor does not require an API or user account.
- Supported browser behaviour and offline limitations must be documented. Direct filesystem permission handling is out of MVP scope.
- Editing offline does not imply that test execution or target applications are available offline.
- The app must not upload plans without an explicit user action.
