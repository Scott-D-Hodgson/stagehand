# AT-2 — Security Awareness

**Source:** [ITSG-33 Annex 3A, AT-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a32at2).

## Control definition

Provide basic security awareness training to information-system users, including managers, executives, and contractors, when they start, when system changes require it, and at an organisation-defined recurring frequency.

**Organisation-defined parameter to review:** recurring training frequency. **Suggested value for review:** annually, supplemented by targeted updates after material changes or incidents.

## Supplemental guidance

Training content and delivery methods depend on users’ access and organisational needs. It should explain why information security matters, user actions that protect systems, how to respond to suspected incidents, and operational security. Methods may include notices, awareness events, or system messages. Related controls include AT-3, AT-4, and PL-4.

## In plain language

This is the regular safety briefing: people learn how to spot hazards, what safe behaviour looks like, and whom to tell when something seems wrong.

## Related controls

From the [official AT-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a32at2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AT-3](AT-3-role-based-security-training.md), [AT-4](AT-4-security-training-records.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md).
- **AT-2(1):** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CP-4](../CP-contingency-planning/CP-4-contingency-plan-testing-and-exercises.md), [IR-3](../IR-incident-response/IR-3-incident-response-testing-and-exercises.md).
- **AT-2(2):** [PL-4](../PL-planning/PL-4-rules-of-behaviour.md), [PS-3](../PS-personnel-security/PS-3-personnel-screening.md), [PS-6](../PS-personnel-security/PS-6-access-agreements.md).

## Stagehand initial assessment

Stagehand should be included in user awareness where deployed. Explain that automation may act with the user’s permissions, can expose data through browser actions or artifacts, and can make unintended changes. Train users to review actions, protect sessions and credentials, validate destinations, avoid unapproved data, and report unexpected behaviour. Operators should tailor content to local workflows; Stagehand itself does not provide organisation-wide training.

## Control enhancements

1. **Practical exercises:** include simulated cyber-attack exercises in awareness training. Adapt exercises to include safe demonstrations of malicious links, deceptive prompts, or unauthorized data-sharing scenarios.
2. **Insider-threat awareness:** teach users to recognize and report potential indicators through appropriate organisational channels. Handle this sensitively under personnel policies and applicable law.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
