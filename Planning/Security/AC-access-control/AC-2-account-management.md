# AC-2 — Account Management

**Assessment status:** Shared responsibility; planned / not implemented or verified  
**Source:** [ITSG-33 Annex 3A, AC-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac2)

This is an original-language summary of the legacy ITSG-33 entry. The source is authoritative for the complete control and enhancement wording. Annex 3A was superseded by ITSP.10.033 on 31 March 2026; see the [Security overview](../README.md#status-and-scope).

## Control definition

The organisation selects the account types it uses, assigns account managers, defines group and role membership, and records who may use each account and with what permissions. Account creation and changes require designated approval and must follow defined procedures. Account use is monitored; managers are notified when access is no longer needed or a user's role changes; access is based on valid authorization and intended use; accounts are periodically reviewed; and credentials for shared accounts are reissued when membership changes.

### Organisation-defined parameters — suggestions for review

| Parameter | Suggestion for review | Rationale |
| --- | --- | --- |
| Account types | Identify named human users, CI/service identities, target-application test accounts, and any approved emergency accounts. Avoid shared interactive accounts where possible. | Stagehand's baseline has no central user-account service, but its repository, CI, secret store, and target applications still have accounts. |
| Approval roles | Repository/CI owner plus the information or system owner for accounts that can reach sensitive test targets or data. | Separates technical provisioning from authorization to access the target environment. Tailor to the actual organisation. |
| Provisioning, modification, disablement, and removal conditions | Link to the organisation's joiner/mover/leaver and service-account procedures; automatically revoke temporary credentials at job end where supported. | Ensures access follows the account lifecycle. |
| Account review frequency | Quarterly for privileged, CI, and target-system test identities; at least annually for lower-risk accounts, subject to organisational policy. | A starting cadence for review, not a prescribed ITSG-33 value. Risk or policy may require shorter periods. |
| Temporary/emergency account lifetime (enhancement 2) | Prefer job-scoped or time-limited credentials; if a fixed lifetime is required, select one based on operational need and configure automatic disablement. | No universal duration is appropriate across emergency and temporary account types. |
| Inactive account disablement (enhancement 3) | Disable unused interactive accounts after 30 days as a candidate baseline; set separate treatment for service identities with documented owners and monitoring. | A reviewable starting point only. Confirm compatibility and applicable policy before adoption. |
| Shared account conditions (enhancement 9) | Disallow shared interactive accounts by default; document an exception, accountable owner, and credential rotation/reissue procedure if one is unavoidable. | Individual attribution is otherwise difficult. |

## Supplemental Guidance summary

Account categories can include personal, shared, group, system, guest, emergency, vendor, temporary, and service accounts. Some lifecycle steps may be automated by the system. Privileged accounts warrant additional approval and scrutiny. Permissions can be assigned to individual accounts, account types, or both. Restrictions such as allowed times or origins need to be balanced against maintenance and business needs. Temporary and emergency accounts are short-lived; infrequently used accounts are different and may need to remain available. Remove or disable accounts when no longer needed or when a user's status changes. The guidance also links account handling to other access, audit, identity, configuration, and maintenance controls.

## Related controls

From the [official AC-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](AC-3-access-enforcement.md), [AC-4](AC-4-information-flow-enforcement.md), [AC-5](AC-5-separation-of-duties.md), [AC-6](AC-6-least-privilege.md), [AC-10](AC-10-concurrent-session-control.md), [AC-17](AC-17-remote-access.md), [AC-19](AC-19-access-control-for-mobile-devices.md), [AC-20](AC-20-use-of-external-systems.md), [AU-9](../AU-audit-and-accountability/AU-9-protection-of-audit-information.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-4](../IA-identification-and-authentication/IA-4-identifier-management.md), [IA-5](../IA-identification-and-authentication/IA-5-authenticator-management.md), [IA-8](../IA-identification-and-authentication/IA-8-identification-and-authentication-non-organizational-users.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md), [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [CM-11](../CM-configuration-management/CM-11-user-installed-software.md), [MA-3](../MA-maintenance/MA-3-maintenance-tools.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [MA-5](../MA-maintenance/MA-5-maintenance-personnel.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **AC-2(4):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md).
- **AC-2(5):** [SC-23](../SC-system-and-communications-protection/SC-23-session-authenticity.md).
- **AC-2(6):** [AC-16](AC-16-security-attributes.md).
- **AC-2(8):** [AC-16](AC-16-security-attributes.md).
- **AC-2(12):** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md).
- **AC-2(13):** [PS-4](../PS-personnel-security/PS-4-personnel-termination.md).

## Plain-language explanation

An account is a keycard. This control keeps a current list of who has each card, which doors it opens, who approved it, and when to collect it back. A contractor's temporary card should expire; a staff transfer should change their access.

## Stagehand application mapping

Stagehand's planned baseline is a local-first editor and a local/CI runner without Stagehand-managed user accounts. Account administration therefore mostly belongs to the repository host, CI provider, secret manager, workstation, and target application. Stagehand can document the required account boundaries and avoid embedding account credentials in plans, but cannot manage external account lifecycles by itself.

| Component | Planned contribution / limitation |
| --- | --- |
| JSON plans | Permit references to external secrets by name; do not place secret values or reusable passwords in plan files. Validate that secret references are explicit and fail safely when unavailable. |
| Runner and CLI | Resolve secrets from approved external sources and avoid logging them. Use a dedicated low-privilege identity for each worker/job where the host supports it. |
| Editor | No user login or account lifecycle is planned. Local file permissions and hosted-editor access are provided by the user's device or web host. |
| CI, repository, targets | External owners provision, approve, monitor, review, rotate, and revoke accounts and credentials. |
| Future hosted execution | Would make Stagehand account management directly applicable; design lifecycle automation, privilege boundaries, and audit events before launch. |

## Recommendations for operators

- Use a distinct identity for each person and service. Avoid embedding shared credentials in plans, source code, command arguments, or reports.
- Scope CI identities to the required repository, secret names, target URLs, and actions. Prefer short-lived credentials and end-of-job revocation when supported.
- Use separate test accounts per environment and grant only the permissions required by the test. Do not reuse production administrator accounts.
- Assign account owners and review access after team or job changes. Revoke stale, temporary, and emergency credentials promptly.
- If the runner executes in CI, protect workflow changes, secret access, and artifact access as part of the account boundary.

## Control enhancements

The catalogue has 13 numbered enhancements. The applicability notes below are preliminary; select enhancements through the applicable security profile and risk assessment.

| ID | Enhancement | Summary and Stagehand relevance |
| --- | --- | --- |
| AC-2(1) | Automated system account management | Automate lifecycle notices and account-use management. Mainly a CI/IAM/target-system responsibility; Stagehand should expose stable run identity/context for external audit where designed. |
| AC-2(2) | Removal of temporary/emergency accounts | Automatically remove or disable time-limited accounts. Recommend job-scoped credentials and expiration in CI/IAM; Stagehand itself has no account service. |
| AC-2(3) | Disable inactive accounts | Automatically disable accounts after an approved inactivity period. Configure in identity providers and target systems; choose separate treatment for service accounts. |
| AC-2(4) | Automated audit actions | Record account create/change/enable/disable/remove events and notify named roles. Use repository, CI, IAM, and target-system audit facilities. |
| AC-2(5) | Inactivity logout | Require logout after an organisation-defined inactivity condition. Apply to human-facing identity/browser sessions; test sessions should close after each run where practical. |
| AC-2(6) | Dynamic privilege management | Adjust permissions at runtime as operational conditions change. Not a planned Stagehand feature; consider only if a future service requires it. |
| AC-2(7) | Role-based schemes | Administer privileged accounts through approved roles and act when assignments are no longer appropriate. Apply role-based repository, CI, secret-store, and hosting permissions. |
| AC-2(8) | Dynamic account creation | Create identities dynamically through trusted authorization relationships. CI-issued short-lived job identities may be relevant; Stagehand does not create identities in the planned design. |
| AC-2(9) | Restrictions on shared/group accounts | Allow shared accounts only under explicitly defined conditions. Prefer named identities; document any unavoidable exception and owner. |
| AC-2(10) | Shared/group account credential termination | Revoke shared credentials when a member leaves the group. Rotate immediately through the external credential owner and update dependent jobs. |
| AC-2(11) | Usage conditions | Enforce allowed circumstances for specified accounts. Define job, target, time, and origin limits in the identity/CI platform where supported. |
| AC-2(12) | Account monitoring / atypical usage | Identify unusual use and notify specified roles. Monitor repository, CI, identity, and target-service logs; Stagehand output is not a substitute for identity monitoring. |
| AC-2(13) | Disable accounts for high-risk individuals | Disable access within a risk-defined period when a credible high-risk condition is identified. This is an organisational HR/security/IAM process, not a Stagehand feature. |

Enhancement guidance and organisation-defined values are summarized rather than reproduced. Check the official entry for exact applicability and wording. No AC-2 enhancement is claimed as implemented.

## Current repository context

The accepted initial secret source is process environment variables, referenced by name; secret resolution and redaction remain M5 work. External secret managers may populate the process environment, but Stagehand has no implemented direct secret-store integration. Current literal action inputs and diagnostics must not be treated as safe for real secrets.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Evidence to collect

- Account inventory, owners, authorizers, permissions, and lifecycle procedures for repositories, CI, secrets, workers, and test targets.
- Automated expiration/revocation and audit configuration for temporary and privileged accounts.
- Periodic access review records and evidence that stale credentials are revoked.
- Tests showing secrets do not appear in plans, logs, errors, reports, screenshots, or traces.
