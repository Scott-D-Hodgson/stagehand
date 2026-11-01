# CM-2 — Baseline Configuration

**Source:** [ITSG-33 Annex 3A, CM-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm2).

## Control definition

Develop, document, and maintain under change control a current baseline configuration for the information system.

**Organisation-defined parameters to review:** baseline update cadence and triggers; versions retained; and high-risk travel configurations/safeguards where applicable.

## Supplemental guidance

Baselines are formally reviewed and agreed specifications for systems/components and serve as the reference for builds, releases, and changes. They include software and versions, patches, settings, network topology, and component placement, and must evolve with the architecture.

## In plain language

A baseline is the approved recipe for how the system should be assembled, so later changes can be compared with a known good version.

## Related controls

From the [official CM-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-3](CM-3-configuration-change-control.md), [CM-6](CM-6-configuration-settings.md), [CM-8](CM-8-information-system-component-inventory.md), [CM-9](CM-9-configuration-management-plan.md), [SA-10](../SA-system-and-services-acquisition/SA-10-developer-configuration-management.md).
- **CM-2(1):** [CM-5](CM-5-access-restrictions-for-change.md).
- **CM-2(2):** [CM-7](CM-7-least-functionality.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).
- **CM-2(6):** [CM-4](CM-4-security-impact-analysis.md), [SC-3](../SC-system-and-communications-protection/SC-3-security-function-isolation.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).

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

## Current repository context

The repository pins Node.js 26.12.1, npm 11.20.0, Playwright 1.64.1, and axe adapter/engine 4.14.0, with a lockfile and dev-container definition. Windows remains the MVP runner focus; passing Linux development tests does not change the supported-product platform decision. Package/version pins are a development baseline, not a hardened deployment baseline.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.
