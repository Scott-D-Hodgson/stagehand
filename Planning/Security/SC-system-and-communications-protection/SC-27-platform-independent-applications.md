# SC-27 - Platform-Independent Applications

**Source:** [ITSG-33 Annex 3A, SC-27](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc27).

## Control definition

Include organisation-defined platform-independent applications.

**Organisation-defined parameter:** applications. **Suggestion for review:** identify only applications that need portability across platforms for availability or continuity objectives.

## Supplemental guidance

Platforms combine hardware and software, including operating systems and architectures. Platform-independent applications can support portability and reconstitution on another platform when one environment is under attack.

## Related controls

From the [official SC-27 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc27), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-29](SC-29-heterogeneity.md).

## Plain-language metaphor

Like a document that can be opened on more than one kind of computer if the first one fails.

## Stagehand and operator guidance

Stagehand’s planned web editor and Node-based runner may have platform dependencies that must be documented. Operators should use supported OS/browser/runtime combinations; do not assume portability without release testing.

## Control enhancements

None listed.

## Current repository context

Current unit suites pass in the existing Linux dev container; the owner also confirmed passing configured PR CI. Windows remains the initial product runner baseline, with Linux runner support after MVP. Do not infer complete Linux/browser compatibility or actual Chromium/axe behaviour from those unit runs.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / portability not verified.**
