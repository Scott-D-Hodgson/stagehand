# AC-5 â€” Separation of Duties

**Assessment status:** Shared responsibility; planned / not implemented or verified  
**Source:** [ITSG-33 Annex 3A, AC-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac5)

This is an original-language summary of the legacy ITSG-33 entry. The source is authoritative for the complete control and references. Annex 3A was superseded by ITSP.10.033 on 31 March 2026; see the [Security overview](../README.md#status-and-scope).

## Control definition

The organisation identifies duties that must be separated, documents the separation, and configures system permissions to support it.

### Organisation-defined parameters â€” suggestion for review

| Parameter | Suggestion for review | Rationale |
| --- | --- | --- |
| Duties that must be separated | Separate approval of production-target plans from plan authoring; separate release/publishing permission from code contribution; where feasible, separate administration of access controls from review of audit records. | These are high-impact duties in the anticipated Stagehand workflow. Confirm against actual staffing, risk, and CI/repository capability. |

## Supplemental Guidance summary

Separating sensitive duties reduces the chance that one authorized person can misuse their access without another person's involvement. Separation can divide business and system-support work, assign programming/configuration/testing/network-security duties to different roles, or separate access administration from audit administration. The precise split depends on organisational structure and risk.

## Related controls

From the [official AC-5 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac5), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](AC-3-access-enforcement.md), [AC-6](AC-6-least-privilege.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [PE-4](../PE-physical-and-environmental-protection/PE-4-access-control-for-transmission-medium.md), [PS-2](../PS-personnel-security/PS-2-position-categorization.md).

## Plain-language explanation

This is the two-person rule for important work: one person prepares the change, and another checks or approves it. It makes mistakes and misuse harder to hide.

## Stagehand application mapping

Stagehand is planned as a local tool and does not provide organisational roles or approval workflows. Separation of duties must therefore be implemented by the repository, CI service, release process, and target-system administration. Product documentation can identify security-sensitive actions and recommend independent review.

| Part | Planned contribution / limit |
| --- | --- |
| Plans | Document a review requirement for plans that can reach sensitive targets or use elevated test identities. |
| Source and releases | Use protected branches/release permissions and independent review in the repository and CI provider. These controls are outside the application code. |
| Runner | Do not claim that a local CLI invocation separates duties; the same person may author and run a plan unless the environment adds controls. |
| Reports | Provide run context that helps a reviewer understand which plan/version ran; do not treat test output as proof of approval. |

## Recommendations for operators

- Require an independent review for sensitive plans, CI workflow changes, and releases.
- Separate permissions to modify plans from permissions to access production-like targets or publish artifacts where the platform permits.
- Keep an auditable record of approvals and exceptions. Do not rely on a comment in a test plan as the approval mechanism.
- Right-size separation for small teams: document compensating review or monitoring when distinct personnel are unavailable.

## Control enhancements

The ITSG-33 Annex 3A entry lists no enhancements for AC-5.

## Current repository context

The current solo workflow uses PRs and a manual self-review checklist with no native required approvals. GitHub does not count an author's own approval as independent review. Independent approval is intended when other reviewers join; automated review-policy enforcement remains deferred. The current workflow does not establish independent separation of duties.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Evidence to collect

- Documented duty/role separation and approval workflow.
- Repository and CI permission configuration.
- Sample review and release records, including approved exceptions or compensating checks.
