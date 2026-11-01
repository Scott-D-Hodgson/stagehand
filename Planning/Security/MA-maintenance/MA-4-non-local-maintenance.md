# MA-4 — Non-Local Maintenance

**Source:** [ITSG-33 Annex 3A, MA-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma4).

## Control definition

Approve and monitor network-based maintenance; permit tools only under policy and system-plan rules; use strong authenticators for sessions; and keep activity records.

## Supplemental guidance

Non-local maintenance uses internal or external networks. Authentication should align with network-access requirements and typically resist replay and use MFA. Remote maintenance must be documented and monitored.

## Related controls

From the [official MA-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-3](../AU-audit-and-accountability/AU-3-content-of-audit-records.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-4](../IA-identification-and-authentication/IA-4-identifier-management.md), [IA-5](../IA-identification-and-authentication/IA-5-authenticator-management.md), [IA-8](../IA-identification-and-authentication/IA-8-identification-and-authentication-non-organizational-users.md), [MA-2](MA-2-controlled-maintenance.md), [MA-5](MA-5-maintenance-personnel.md), [MP-6](../MP-media-protection/MP-6-media-sanitization.md), [PL-2](../PL-planning/PL-2-system-security-plan.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SC-10](../SC-system-and-communications-protection/SC-10-network-disconnect.md), [SC-17](../SC-system-and-communications-protection/SC-17-public-key-infrastructure-certificates.md).
- **MA-4(1):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md).
- **MA-4(3):** [MA-3](MA-3-maintenance-tools.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **MA-4(4):** [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **MA-4(6):** [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **MA-4(7):** [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md). Additional source list: [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-3](../AU-audit-and-accountability/AU-3-content-of-audit-records.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-8](../IA-identification-and-authentication/IA-8-identification-and-authentication-non-organizational-users.md), [MA-5](MA-5-maintenance-personnel.md), [MP-6](../MP-media-protection/MP-6-media-sanitization.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).

## Plain-language metaphor

Remote repair is like giving a mechanic a temporary key over the phone; verify who they are, watch the work, and confirm the key no longer works afterward.

## Stagehand and operator guidance

If an operator or provider maintains a remote runner, require approved MFA, encrypted isolated sessions, time-limited access, approval, recording/audit as policy allows, and verified disconnection. Never expose browser-control endpoints publicly for convenience.

## Enhancements

1. **MA-4(1), auditing/review:** audit defined remote-maintenance events and review session records.
2. **MA-4(2), document procedures:** document policies and procedures for remote maintenance connections in the security plan.
3. **MA-4(3), comparable security/sanitization:** use a maintenance system with comparable safeguards, or sanitize/remove/inspect/re-sanitize the component before reconnecting it.
4. **MA-4(4), authentication/separation:** use replay-resistant authenticators and separate maintenance communications physically or through compliant encryption.
5. **MA-4(5), approvals/notifications:** require session approval and notify designated roles of planned maintenance time.
6. **MA-4(6), cryptographic protection:** protect confidentiality and integrity of remote maintenance communications cryptographically.
7. **MA-4(7), remote disconnect verification:** verify all remote maintenance connections have terminated.
