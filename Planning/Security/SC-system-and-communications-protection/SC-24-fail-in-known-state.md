# SC-24 - Fail in Known State

**Source:** [ITSG-33 Annex 3A, SC-24](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

On defined failure types, fail to a defined known state while preserving assigned system-state information.

**Organisation-defined parameters:** known state, failure types, state information to preserve. **Suggestion for review:** specify safe behaviour for runner crashes, browser disconnects, and interrupted plans; stop actions and retain only necessary diagnostic state without secrets.

## Supplemental guidance

A known secure state helps protect confidentiality, integrity, and availability; a known safe state helps prevent injury/property damage. Preserving useful state aids recovery with less disruption.

## Plain-language metaphor

Like an elevator stopping safely and recording its floor when power fails.

## Stagehand and operator guidance

Maintainers should define failure behaviour so partial automation does not continue unpredictably. Operators should ensure CI cancellation, host restart, and network failure leave target systems in an understood state.

## Control enhancements

None listed.

## Assessment status

**Planned / not verified.** No failure-mode analysis is asserted.
