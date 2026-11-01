# AC-1 — Access Control Policy and Procedures

**Assessment status:** Planned / not implemented or verified  
**Source:** [ITSG-33 Annex 3A, AC-1](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac1)

> The official control statement and Supplemental Guidance are summarized below in original wording. Consult the linked catalogue for the authoritative text and references; related controls are linked below. This entry follows the requested ITSG-33 taxonomy; ITSG-33 Annex 3A was superseded by ITSP.10.033 effective 31 March 2026.

## Control definition

The organisation must establish, document, and communicate an access-control policy and procedures that define the purpose, scope, responsibilities, coordination, and compliance expectations. The organisation must review and update both the policy and procedures at organisation-defined intervals.

### Organisation-defined parameters

| Parameter | Suggestion for review | Rationale |
| --- | --- | --- |
| Roles/personnel who receive the policy and procedures | System owner, security lead, developers, release maintainers, CI administrators, and operators who can author or execute test plans | These roles can change Stagehand code, plans, credentials, execution environments, or resulting artifacts. Confirm the actual role list for each deployment. |
| Policy review frequency | At least annually, and after a material change to Stagehand's trust boundaries or deployment model | A predictable review point plus change-triggered review helps keep procedures aligned. This is a proposal, not an ITSG-33-mandated interval. |
| Procedure review frequency | At least annually, and after a security incident or material operational change | Procedures for plan review, secret handling, execution, and artifact handling can become stale as environments change. Confirm against organisational policy. |

## Supplemental Guidance summary

This control establishes the policy and procedures that make the other access-control safeguards usable and consistent. Those documents may be organisation-wide or system-specific, depending on the organisation's security program and complexity. They should reflect the policies and rules that apply to the organisation and its risk-management approach. Supplemental Guidance gives implementation context; the mandatory requirements are the control statements above.

## Related controls

From the [official AC-1 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac1), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Plain-language explanation

This is the rulebook for who may enter which rooms and what they may do there. A building's keys and locks only work well when people know who issues keys, how access is approved, and when the rules are reviewed.

## Stagehand application mapping

Stagehand is planned as a local-first JSON-plan editor and Node.js/Playwright runner, with no central account service in the baseline design. AC-1 is therefore primarily an organisation and deployment responsibility, supported by Stagehand documentation and secure defaults. There is no implemented Stagehand policy feature or evidence today.

| Part | Planned contribution |
| --- | --- |
| Plans and schema | Document who may author, review, approve, and execute plans; define permitted data and target environments. Validate plans before execution. |
| Runner and CLI | Document execution identity, permissions, network reach, secret sources, and safe invocation. Run with least privilege. |
| Editor | Document local file handling, hosting requirements, and expected network behaviour; do not imply the editor enforces the organisation's access policy. |
| Reports and artifacts | Set rules for access, sharing, retention, and deletion of reports, screenshots, traces, and accessibility output. |
| Future hosted or multi-user capability | Reassess AC-1 and related access controls before design approval; define service roles and policy enforcement responsibilities. |

## Recommendations for Stagehand operators

- Adopt an organisational access-control policy and procedures that cover source repositories, plan files, CI configuration, secret stores, runner workers, target-system test accounts, and generated artifacts.
- Require review and approval for plans that can access sensitive targets or data. Restrict who can change CI workflows and release credentials.
- Keep Stagehand's product documentation separate from an organisation's authoritative policy; link to the governing policy and identify the responsible owner.
- Review this entry when Stagehand introduces hosted services, accounts, shared plan storage, telemetry, or remote execution.

## Control enhancements

The ITSG-33 Annex 3A entry lists no enhancements for AC-1.

## Evidence to collect when implemented

- Approved access-control policy and procedures, with owner and review date.
- Role-to-permission mapping for the actual repository, CI, secrets, runner, target systems, and artifacts.
- Evidence that contributors and operators receive the applicable procedures.
- Review record after material architecture or deployment changes.
