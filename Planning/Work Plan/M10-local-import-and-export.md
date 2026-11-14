# M10 — Local import and export

**Status:** In progress; M10.1 portable bundle codec, M10.2 validated import, and M10.3 valid-only export complete and verified in the development container
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M9](M9-basic-plan-and-case-authoring.md)

## Objective

Complete the first portable file workflow using a browser-selected ZIP bundle
and a browser download, without direct filesystem access.

## Tasks

- [ ] Import a versioned plan and associated cases from one ZIP bundle; retain portable paths relative to the plan.
- [ ] Use browser-safe shared reference matching and parsed-bundle validation; do not import the Node filesystem loader.
- [ ] Explain malformed JSON, unsupported versions, missing references, duplicates, and invalid documents without replacing current work silently.
- [ ] Export a valid plan and case bundle as one ZIP while retaining the reference layout; distinguish invalid drafts from valid plans.
- [ ] Track local recovery status separately from edits not yet exported, and state what a download does and does not confirm.
- [ ] Protect current work before replacement and verify cancellation and failed imports.

## Deliverables and completion evidence

Import a synthetic ZIP bundle, edit it, export it, and re-import the output with
equivalent contract content and resolved references. Demonstrate
missing/duplicate reference feedback and that an invalid draft cannot be
exported as a valid portable bundle.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Decisions made

- A portable Stagehand bundle is one ZIP archive. Its plan is stored as
  `plan.json` at the archive root; every case is stored at the exact relative
  path referenced by that plan, such as `cases/checkout.json`.
- The editor imports and exports browser-selected/downloaded ZIP archives only;
  it does not request folder access or use a browser-specific filesystem API.
- Use the small browser-safe `fflate` library for ZIP encoding and decoding.
- Export is available only for a fully validated plan/case bundle. An invalid
  draft remains editable and recoverable locally, with validation feedback, but
  cannot be represented as a valid downloaded Stagehand bundle.
- A successful import replaces the active bundle only after the candidate has
  parsed and validated and the author has explicitly confirmed replacement of
  the currently loaded plan.
- Export validates the active bundle before opening a filename dialog. The
  dialog suggests `<plan-id>.stagehand.zip`, adds `.zip` when omitted, and asks
  the browser to download only after the author confirms the filename. Download
  confirmation is left to the browser; the editor footer reports whether the
  current draft has unexported changes separately from local recovery status.

## Incremental delivery

1. **M10.1 — Portable bundle codec (complete):** add `fflate`; define the transparent ZIP
   layout; implement pure browser-safe encode/decode, entry-path safety,
   reference matching, and parsed-bundle validation with synthetic ZIP tests.
   No file-picker or download UI is introduced. Development-container checks
   passed: editor unit tests, type-check, and production build.
2. **M10.2 — Validated import (complete):** add an Import control accepting `.zip`; parse
   a candidate without replacing the active draft; show localized malformed ZIP,
   JSON, version, missing-reference, duplicate, and invalid-document feedback;
   then use a static Bootstrap confirmation flow before replacing the current
   plan. The owner reported passing development-container tests. The
   rejected-bundle dialog is also static and blocks page interaction until
   acknowledged.
3. **M10.3 — Valid-only export (complete):** add an Export control and download a
   `<plan-id>.stagehand.zip` archive through the browser Blob API. Disable or
   block export for invalid drafts with clear validation feedback, while keeping
   recovery status distinct from export status. The owner reported passing
   development-container tests.
4. **M10.4 — Round-trip and integration evidence:** import a synthetic archive,
   edit plan and cases, export, re-import, and verify equivalent content,
   recovery/conflict behaviour, cancellation, failure paths, English/French
   wording, keyboard operation, and download semantics.

## Open decisions and exclusions

The archive has no manifest, compression policy, password protection, remote
storage, or cryptographic signature in M10. Direct filesystem access remains
deferred; no permission-based filesystem integration is included. Reassess
future archive metadata only when a concrete compatibility need arises.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
