# ADR-006 — Editor technology and UI baselines

**Status:** Accepted  
**Decision date:** 2026-11-07

## Context

Phase 2 starts with the M8 editor foundation. The owner wants to focus on function, learn the application setup, and avoid extensive custom styling before authoring workflows are established. The interface must support localization and optional personality in its guidance.

This decision supplements [ADR-002](ADR-002-local-first-editor.md) and the M8 recovery scope in [ADR-005](ADR-005-editor-draft-recovery.md). It records technology and presentation choices. M8.1 has implemented and verified the initial Vite/Vue/TypeScript foundation and Bootstrap CSS shell; later editor behaviour remains planned until its own evidence is recorded.

## Decision

### Application setup

- Use Vite to set up the Vue application with TypeScript.
- Guide the owner through commands, explanations, and checkpoints so the owner performs the initial scaffolding. Do not generate the scaffold on their behalf.
- Select exact dependency versions and setup commands when that implementation slice begins.

### Localization

- Deliver Canadian English (`en-CA`) as the default interface language and Canadian French (`fr-CA`) as the second initial language.
- Put user-facing strings into translation resources from the beginning, including persona guidance.
- Keep interface language separate from the languages used for expected assertion values in plan documents.
- i18next is the owner's familiar candidate. Assess its Vue integration before selecting the localization dependency; no integration package is selected by this decision.

### Guidance personas

- Ship Neutral guidance by default in both initial languages. It uses brief, direct wording.
- In M8, define how persona text fits into localization and deliver Neutral. Defer the persona-file format, validation, and loading UI to the provisionally assigned M13 slice; confirm that assignment before implementation.
- Optional personas are loaded by the user through the UI. Motivating and Cranky can be authored and loaded later; neither must ship with M8.
- Motivating is intended to convey the required guidance with encouragement and affirmation.
- Cranky is intended to convey the required guidance in a gruff, reluctantly helpful, grumpy voice. It may grumble about the task but must not insult the user.
- Personas change wording while preserving meaning, available actions, and validation rules.
- Critical errors and data-loss warnings remain direct and unambiguous in every persona.
- Remember language locally, separately from exported plan data and the recovery draft. Remember persona selection when optional persona loading is introduced; its storage details remain to be defined in that slice.

### Presentation and accessibility

- Start with Bootstrap 5 CSS referenced from a CDN, without a Vue Bootstrap component library.
- Add Bootstrap JavaScript components only when needed.
- Avoid extensive custom CSS while establishing functionality. Keep Bootstrap-specific presentation separate from document and storage logic so it can be replaced later.
- Establish keyboard access, visible focus, labelled inputs, and understandable validation feedback in M8. Styling alone is not accessibility verification.
- Use Bootstrap's root `data-bs-theme` mechanism for Light and Dark modes. Default to the browser colour-scheme preference; store only an explicit user override locally and keep it outside exported documents and recovery drafts. System selection removes that override.

### Offline styling follow-through

The offline-after-load requirement in [ADR-002](ADR-002-local-first-editor.md) remains in force. Initial CDN styling is accepted while its offline follow-through is deferred. This does not establish offline compliance or add an offline cold-start requirement.

The owner identified project-owned CSS or an offline CSS shim as possible later approaches. Neither is selected yet. Revisit the approach during the Phase 2 integration and offline review, or earlier if CDN availability blocks a working authoring flow. Verify the resulting offline-after-load behaviour before Phase 2 is considered complete.

## Alternatives and consequences

- Extensive custom styling now would distract from authoring functionality; it is deferred.
- A Vue Bootstrap component library is not part of the initial baseline; use the CSS baseline and add only needed behaviour.
- CDN styling introduces an availability dependency whose offline implications remain to be resolved and verified.
- Canadian English and Canadian French, including Neutral guidance, are initial delivery scope rather than localization infrastructure alone. Optional persona content and loading are later Phase 2 work.
- Exact localization integration, translation review arrangements, optional persona loading details, and the offline styling solution remain to be defined during the relevant implementation and review slices.
