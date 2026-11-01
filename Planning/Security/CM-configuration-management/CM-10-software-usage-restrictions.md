# CM-10 — Software Usage Restrictions

**Source:** [ITSG-33 Annex 3A, CM-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm10).

## Control definition

Use software and documentation according to contracts and copyright law; track quantity-licensed software to control copying/distribution; and control/document peer-to-peer file-sharing use to prevent unauthorized copyrighted-material distribution.

## Supplemental guidance

Licence tracking can be manual or automated depending on organisational need. Software use restrictions connect to remote access, component inventory, and network safeguards.

## In plain language

Use each tool according to its licence, keep track of how many copies are allowed, and do not share protected material through unapproved channels.

## Related controls

From the [official CM-10 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm10), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-17](../AC-access-control/AC-17-remote-access.md), [CM-8](CM-8-information-system-component-inventory.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).

## Stagehand initial assessment

Maintain an accurate software bill of materials and licence notices for Stagehand and dependencies. Operators should use approved software sources, follow subscription/seat terms, and prevent automation from using peer-to-peer transfer tools to distribute protected content. Obtain legal review for licence obligations; this record is not legal advice.

## Control enhancements

1. **CM-10(1), open-source software:** establish organisation-defined restrictions for using open-source software, including licence review and any required approval.

## Current repository context

Stagehand remains MIT. The owner accepted unchanged use of @axe-core/playwright and axe-core under MPL-2.0; the repository preserves the MPL text, bundled MIT/ISC attributions, and exact-version source instructions. Playwright Apache-2.0 notices are retained. Actual release-artifact notice/source completeness still requires verification when packaging exists.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
