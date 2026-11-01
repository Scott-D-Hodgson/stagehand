# AC-22 — Publicly Accessible Content

**Source:** [ITSG-33 Annex 3A, AC-22](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac22).

## Control definition

Designate authorized individuals to post or process information on publicly accessible systems; train them to ensure that non-public information is not released; review proposed public content before posting; and review published content at an organisation-defined frequency to ensure it remains appropriate.

**Organisation-defined parameter to review:** frequency of review of publicly accessible content. **Suggested value for review:** quarterly, with immediate review after a reported exposure or material policy change.

## Supplemental guidance

Public content can be accessed by anyone, including search engines and automated collectors. Prevent accidental disclosure of non-public information and ensure posted material is authorized. A review after publication does not replace pre-publication checks.

## In plain language

Posting to a public website is like putting a notice on a town billboard. Check it before it goes up, and check it regularly because anyone can read or copy it.

## Related controls

From the [official AC-22 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac22), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](AC-3-access-enforcement.md), [AC-4](AC-4-information-flow-enforcement.md), [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md), [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [AU-13](../AU-audit-and-accountability/AU-13-monitoring-for-information-disclosure.md).

## Stagehand initial assessment

Stagehand may interact with publishing consoles or generate content, but it has no assumed authority to approve publication. Operators should require an authorized human review before automation publishes or changes public content, use separate credentials and least privilege, and prevent test data, secrets, internal URLs, or personal information from reaching public pages. Schedule content review and retain appropriate approval records.

## Control enhancements

No enhancements are listed for this control in the Annex 3A catalogue.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
