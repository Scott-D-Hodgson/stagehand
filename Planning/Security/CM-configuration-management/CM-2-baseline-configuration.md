# CM-2 — Baseline Configuration

**Source:** [ITSG-33 Annex 3A, CM-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Develop, document, and maintain under change control a current baseline configuration for the information system.

**Organisation-defined parameters to review:** baseline update cadence and triggers; versions retained; and high-risk travel configurations/safeguards where applicable.

## Supplemental guidance

Baselines are formally reviewed and agreed specifications for systems/components and serve as the reference for builds, releases, and changes. They include software and versions, patches, settings, network topology, and component placement, and must evolve with the architecture.

## In plain language

A baseline is the approved recipe for how the system should be assembled, so later changes can be compared with a known good version.

## Stagehand initial assessment

Maintain a release baseline covering supported OS/runtime/browser versions, dependencies, configuration defaults, network interfaces, permissions, and build artifacts. Operators should record their deployment’s pinned versions, policies, and deviations. Keep development/test baselines separate from production and retain rollback information where risk requires it.

## Control enhancements

1. **CM-2(1), reviews and updates:** review on a defined schedule, after defined events, and during installations/upgrades.
2. **CM-2(2), automation support:** automate baseline accuracy and currency (e.g., inventory/configuration tooling).
3. **CM-2(3), retention of previous configurations:** retain defined prior baselines for rollback.
4. **CM-2(4), unauthorized software:** withdrawn into CM-7.
5. **CM-2(5), authorized software:** withdrawn into CM-7.
6. **CM-2(6), development and test environments:** maintain a separate baseline from operations; environments need not be physically separate.
7. **CM-2(7), high-risk areas:** issue defined hardened configurations for travel to high-risk locations and apply safeguards after return.
