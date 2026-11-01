# SC-7 - Boundary Protection

**Source:** [ITSG-33 Annex 3A, SC-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc7).

## Control definition

Monitor/control communications at external and key internal boundaries; separate publicly accessible components from internal networks; and connect to external networks only through managed interfaces aligned with organisational security architecture.

## Supplemental guidance

Managed interfaces include gateways, routers, firewalls, guards, malicious-code analysis, virtualization, and encrypted tunnels. Public components may be placed in physically/logically separated subnets (DMZs). Shared commercial telecom infrastructure can add risk.

## Related controls

From the [official SC-7 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc7), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [CA-3](../CA-security-assessment-and-authorization/CA-3-information-system-connections.md), [CM-7](../CM-configuration-management/CM-7-least-functionality.md), [CP-8](../CP-contingency-planning/CP-8-telecommunications-services.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md), [SC-5](SC-5-denial-of-service-protection.md), [SC-13](SC-13-use-of-cryptography.md).
- **SC-7(4):** [SC-8](SC-8-transmission-confidentiality-and-integrity.md).
- **SC-7(8):** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md).
- **SC-7(9):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [SC-38](SC-38-operations-security.md), [SC-44](SC-44-detonation-chambers.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **SC-7(10):** [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md).
- **SC-7(11):** [AC-3](../AC-access-control/AC-3-access-enforcement.md).
- **SC-7(13):** [SA-8](../SA-system-and-services-acquisition/SA-8-security-engineering-principles.md), [SC-2](SC-2-application-partitioning.md), [SC-3](SC-3-security-function-isolation.md).
- **SC-7(14):** [PE-4](../PE-physical-and-environmental-protection/PE-4-access-control-for-transmission-medium.md), [PE-19](../PE-physical-and-environmental-protection/PE-19-information-leakage.md).
- **SC-7(15):** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **SC-7(17):** [SC-4](SC-4-information-in-shared-resources.md).
- **SC-7(18):** [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [SC-24](SC-24-fail-in-known-state.md).
- **SC-7(21):** [CA-9](../CA-security-assessment-and-authorization/CA-9-internal-system-connections.md), [SC-3](SC-3-security-function-isolation.md).

## Plain-language metaphor

Like a staffed checkpoint at every road into a facility, with public areas separated from restricted rooms.

## Stagehand and operator guidance

The runner can contact target systems and is an egress path. Operators should isolate runner networks, allow only authorized target destinations, route traffic through approved proxies/firewalls, prevent unintended internet access, and monitor inbound/outbound traffic. Configurable target allowlists are a potential safeguard for review, not an accepted or implemented product option. Network boundaries remain operator-controlled.

## Control enhancements

(1) physically separated subnetworks withdrawn into base SC-7; (2) public access withdrawn into base; (3) limit external connections; (4) managed interface/policy/protection and documented, periodically reviewed exceptions for each external telecom service; (5) deny by default and allow traffic by exception; (6) response to recognized failures withdrawn into SC-7(18); (7) prevent split tunnelling on remote devices; (8) route defined internal traffic to external networks through authenticated proxies; (9) detect/deny threatening outbound traffic and audit associated internal users; (10) prevent unauthorized exfiltration; (11) allow incoming traffic only from authorized sources to authorized destinations; (12) host-based boundary protections on defined components; (13) isolate security tools/support components on separate managed subnets; (14) protect managed interfaces against unauthorized physical connections; (15) route privileged network access through a dedicated managed interface for access control/auditing; (16) prevent discovery of selected managed-interface components; (17) enforce protocol formats; (18) fail securely when a boundary device fails; (19) block traffic between defined independently configured clients; (20) dynamically isolate/segregate defined components; (21) separate components supporting different missions/functions using boundary controls; (22) use separate subnets for different security domains; (23) disable sender feedback on protocol-validation failure. Many enhancements describe network infrastructure and require operator tailoring; withdrawn entries are not separate active enhancements.

## Current repository context

Absolute HTTP/HTTPS URL validation is not a host allowlist, HTTPS-only requirement, redirect policy, or browser subresource firewall. No target allowlist is implemented; external egress controls remain operator-owned. Axe tag selection scopes assessed accessibility rules, not permitted destinations or browser permissions.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / deployment-dependent; not verified.** No Stagehand network boundary is implemented or assessed by this record.

## Organisation-defined parameter suggestions

SC-7 assigns network boundaries, traffic policy, authorized sources/destinations, monitoring, and selected components. **Suggestion for review:** allow only documented destinations required for the run (for example, approved test targets and necessary identity/package endpoints); deny all other egress by default where feasible; require security-owner approval for exceptions and review them quarterly.
