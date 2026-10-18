# AC-3 â€” Access Enforcement

**Assessment status:** Shared responsibility; planned / not implemented or verified  
**Source:** [ITSG-33 Annex 3A, AC-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33)

This record summarizes the legacy ITSG-33 control and Supplemental Guidance in original wording. Consult the source for exact statements and enhancement applicability. Annex 3A was superseded by ITSP.10.033 on 31 March 2026; see the [Security overview](../README.md#status-and-scope).

## Control definition

The information system must enforce approved logical-access permissions for information and system resources, in line with the applicable access-control policy.

## Supplemental Guidance summary

Access policies can be based on identities, roles, or attributes. Enforcement mechanisms such as permissions lists, access matrices, or cryptography mediate requests between users or processes and the files, records, devices, and services they want to use. Enforcement can occur at the operating-system, application, or service layer. The control's value depends on coverage of all relevant resources and processes within the defined system boundary.

## Plain-language explanation

AC-3 is the lock checking the keycard before opening a door. A written rule about who may enter is not enough; the door must actually check that rule every time.

## Stagehand application mapping

The planned local-first editor does not have a Stagehand login service, and the CLI is expected to run as the invoking user's process. Stagehand therefore cannot enforce who may access a user's repository, CI system, test target, or report store. The product can validate plan structure and should document its process/file/network needs; host operating systems, repositories, CI, and target applications provide most access enforcement.

| Part | Planned contribution / limit |
| --- | --- |
| Plan validator | Reject malformed or unsupported operations before browser execution. Schema validation is not authorization to use a target system. |
| Runner / Playwright | Operate with the invoking worker's permissions. Minimize filesystem and browser permissions; restrict network paths at the host boundary. |
| Editor | Rely on local file permissions or the hosting service's authorization. Do not assume local-first means access-controlled. |
| Reports | Restrict access through the filesystem or CI artifact service; avoid publishing sensitive outputs to public locations. |
| Future service/API | Implement server-side authorization at each API/resource boundary; client-side hiding is not sufficient. Reassess this control before release. |

## Recommendations for operators

- Use operating-system ACLs, repository roles, CI permissions, and artifact access rules to enforce least privilege.
- Run browser jobs in isolated, non-administrative workers and apply network egress controls outside Stagehand.
- Restrict test accounts to authorized test environments and data. Treat browser navigation and actions in a plan as actions performed with that account's authority.
- If hosting the Vue editor, enforce access at the web host and protect the deployment pipeline; the editor itself is not an identity provider.
- Review access after changes to the system boundary, target applications, or runner integrations.

## Control enhancements

| ID | Enhancement | Summary and preliminary relevance |
| --- | --- | --- |
| AC-3(1) | Restricted access to privileged functions | Withdrawn in this catalogue and incorporated into AC-6. Track under AC-6; do not treat as a separate active enhancement. |
| AC-3(2) | Dual authorization | Require two authorized people for selected privileged commands/actions. Could apply to high-impact CI/release or production-target approvals through external workflow controls; Stagehand has no planned two-person gate. **Suggestion for review:** identify any high-impact actions requiring two-person approval in the deployment's risk assessment. |
| AC-3(3) | Mandatory access control | Apply uniform, centrally enforced restrictions that prevent users from passing information or privileges contrary to policy. Generally outside the standalone toolkit; only relevant to a classified/multilevel environment if required by its profile. |
| AC-3(4) | Discretionary access control | Permit resource owners to grant access under defined rules. Implement through repository, filesystem, and artifact permissions where applicable. |
| AC-3(5) | Security-relevant information | Restrict access to security configuration and policy data except in approved non-operational states. Protect CI definitions, release settings, secret references, and deployment configuration through host controls. |
| AC-3(6) | Protection of user and system information | Withdrawn; incorporated into MP-4 and SC-28. Assess through those controls rather than as an active AC-3 enhancement. |
| AC-3(7) | Role-based access control | Enforce permissions based on approved roles. Use the identity/repository/CI provider's role model; Stagehand has no planned user roles. |
| AC-3(8) | Revocation of access authorizations | Revoke permissions when relevant attributes change, within a defined time. **Suggestion for review:** make revocation immediate for compromised or terminated privileged identities, subject to the organisation's approved process. |
| AC-3(9) | Controlled release | Release information outside the system boundary only when the recipient and safeguards are approved and the information is checked. Relevant to reports, screenshots, traces, and exported plans; require review and protected artifact destinations. |
| AC-3(10) | Audited override of access-control mechanisms | Allow an override only under defined conditions and record it. Stagehand has no override feature planned; if introduced, require an audit trail and narrow authorization. |

The table is a short implementation-oriented summary. Refer to the official source for complete enhancement statements and guidance. None are marked implemented.

## Evidence to collect

- Approved access policy and role-to-resource mapping for each deployment boundary.
- Host/CI/network tests demonstrating that unapproved users, jobs, and destinations are denied.
- Review and release approval logs, including any two-person or override workflows selected by the system owner.
- Evidence that reports and exported information are protected after leaving the runner boundary.

