# CA-8 — Penetration Testing

**Source:** [ITSG-33 Annex 3A, CA-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca8).

## Control definition

Conduct penetration testing at organisation-defined intervals on designated systems or components.

**Organisation-defined parameters to review:** testing frequency and scope; independent tester and red-team exercise requirements. **Suggested value for review:** test before production release and after significant security-boundary changes, with a recurring cadence set by risk and authorization needs.

## Supplemental guidance

Penetration testing simulates adversary actions within agreed constraints to find exploitable weaknesses. It can cover hardware, software, firmware, and physical/technical controls. Agree on rules of engagement in advance and use risk assessment to determine tester independence.

## In plain language

Hire an authorized inspector to try the doors and windows using agreed limits, then fix the weaknesses they find.

## Related controls

From the [official CA-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md).
- **CA-8(1):** [CA-2](CA-2-security-assessments.md).

## Stagehand initial assessment

Test the application and representative deployment surfaces within explicit scope: plan parsing, browser-control endpoints, authorization boundaries, secret handling, output artifacts, and update/build paths. Obtain written authorization for all targets, especially third-party services. Track findings through the organisation’s remediation process; do not run intrusive testing against production without approval.

## Control enhancements

1. **CA-8(1), independent penetration agent/team:** use impartial testers without conflicting development/operation roles.
2. **CA-8(2), red-team exercises:** conduct defined adversary simulations under approved rules of engagement. These are broader organisational exercises than ordinary component penetration tests.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
