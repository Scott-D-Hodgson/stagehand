# CM-4 — Security Impact Analysis

**Source:** [ITSG-33 Annex 3A, CM-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Analyse proposed system changes for potential security impact before implementing them.

## Supplemental guidance

Qualified personnel with security responsibilities should assess how a change affects controls and risk. Analysis may review security plans and design records and determine whether new safeguards are needed. Scale effort to system sensitivity.

## In plain language

Before renovating a house, check how the work could affect wiring, exits, and structural supports—not just the room being changed.

## Stagehand initial assessment

Review changes to browser permissions, task-plan actions, network destinations, credential handling, logging, dependencies, release/update mechanisms, and data artifacts for security impacts. Include deployment changes such as remote hosting or persistent browser profiles. Record findings and required mitigations before operational release.

## Control enhancements

1. **CM-4(1), separate test environments:** analyse changes in a logically or physically isolated test environment before operations, preventing test activity or data from crossing boundaries.
2. **CM-4(2), verification of security functions:** after changes, verify security functions remain correctly implemented and produce required outcomes.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

