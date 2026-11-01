# CA-2 — Security Assessments

**Source:** [ITSG-33 Annex 3A, CA-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca2).

## Control definition

Prepare an assessment plan describing in-scope controls, assessment procedures, environment, team, and roles; assess controls and the operating environment at a defined frequency; document results in a report; and provide results to designated roles.

**Organisation-defined parameters to review:** assessment frequency, recipients, and assessor independence/specialized-assessment schedule and methods in enhancements. **Suggested values for review:** assess before production authorization and after significant architecture changes; use risk-based ongoing assessment rather than assuming a universal calendar interval.

## Supplemental guidance

Assessments determine whether controls are correctly implemented, operate as intended, and achieve required outcomes. They support authorization, continuous monitoring, and the development lifecycle, and should identify weaknesses early. Existing evidence may be reused when current and relevant; assessors need an appropriate level of independence.

## In plain language

An inspection plan says what will be checked, how it will be checked, who will inspect it, and where the findings will go.

## Related controls

From the [official CA-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-5](CA-5-plan-of-action-and-milestones.md), [CA-6](CA-6-security-authorization.md), [CA-7](CA-7-continuous-monitoring.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SA-11](../SA-system-and-services-acquisition/SA-11-developer-security-testing.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **CA-2(2):** [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [SI-2](../SI-system-and-information-integrity/SI-2-flaw-remediation.md).

## Stagehand initial assessment

Assess the actual release and deployment, not only design documents. Include source/build provenance, dependencies, browser-control surfaces, credentials, data artifacts, host/runner, network boundaries, and operational procedures. Use findings to update risk and remediation records. Product development checks are not a substitute for deployment-specific assessment.

## Control enhancements

1. **CA-2(1), independent assessors:** use assessors with an organisation-defined level of independence and impartiality.
2. **CA-2(2), specialized assessments:** include organisation-defined assessment types at a defined frequency, announced or unannounced, such as in-depth monitoring, scanning, malicious-user testing, insider-threat assessment, or load testing.
3. **CA-2(3), external organisations:** accept external assessment results when they meet defined requirements; evaluate scope, methods, currency, independence, evidence detail, and applicable mandates.

## Current repository context

Current engineering evidence includes 209 passing existing tests in the running Linux dev container (39 plan-schema, 17 plan-engine, 22 result-model, 131 runner-core), with no failures or skips. The owner confirmed passing CI on every PR through #50; individual workflow runs were not independently inspected. This is functional development evidence, not a security-control assessment or authorization.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
