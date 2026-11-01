# SC-24 - Fail in Known State

**Source:** [ITSG-33 Annex 3A, SC-24](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc24).

## Control definition

On defined failure types, fail to a defined known state while preserving assigned system-state information.

**Organisation-defined parameters:** known state, failure types, state information to preserve. **Suggestion for review:** specify safe behaviour for runner crashes, browser disconnects, and interrupted plans; stop actions and retain only necessary diagnostic state without secrets.

## Supplemental guidance

A known secure state helps protect confidentiality, integrity, and availability; a known safe state helps prevent injury/property damage. Preserving useful state aids recovery with less disruption.

## Related controls

From the [official SC-24 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc24), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [CP-10](../CP-contingency-planning/CP-10-information-system-recovery-and-reconstitution.md), [CP-12](../CP-contingency-planning/CP-12-safe-mode.md), [SC-7](SC-7-boundary-protection.md), [SC-22](SC-22-architecture-and-provisioning-for-name-address-resolution-service.md).

## Plain-language metaphor

Like an elevator stopping safely and recording its floor when power fails.

## Stagehand and operator guidance

Maintainers should define failure behaviour so partial automation does not continue unpredictably. Operators should ensure CI cancellation, host restart, and network failure leave target systems in an understood state.

## Control enhancements

None listed.

## Current repository context

Dispatch stops on hard failures, returns recognized soft assertion failures while continuing, and preserves step context. Enabled scans run after eligible completed steps and recognized assertion failures; simultaneous assertion/scan failures retain both errors. M6 case/run status and continuation policy remain pending; no target-side rollback or crash recovery is implemented.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** No failure-mode analysis is asserted.
