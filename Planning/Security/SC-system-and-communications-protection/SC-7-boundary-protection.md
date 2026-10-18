# SC-7 - Boundary Protection

**Source:** [ITSG-33 Annex 3A, SC-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Monitor/control communications at external and key internal boundaries; separate publicly accessible components from internal networks; and connect to external networks only through managed interfaces aligned with organisational security architecture.

## Supplemental guidance

Managed interfaces include gateways, routers, firewalls, guards, malicious-code analysis, virtualization, and encrypted tunnels. Public components may be placed in physically/logically separated subnets (DMZs). Shared commercial telecom infrastructure can add risk.

## Plain-language metaphor

Like a staffed checkpoint at every road into a facility, with public areas separated from restricted rooms.

## Stagehand and operator guidance

The runner can contact target systems and is an egress path. Operators should isolate runner networks, allow only authorized target destinations, route traffic through approved proxies/firewalls, prevent unintended internet access, and monitor inbound/outbound traffic. Maintainers should provide configurable target allowlists and avoid arbitrary network destinations where feasible. Network boundaries remain operator-controlled.

## Control enhancements

(1) physically separated subnetworks withdrawn into base SC-7; (2) public access withdrawn into base; (3) limit external connections; (4) managed interface/policy/protection and documented, periodically reviewed exceptions for each external telecom service; (5) deny by default and allow traffic by exception; (6) response to recognized failures withdrawn into SC-7(18); (7) prevent split tunnelling on remote devices; (8) route defined internal traffic to external networks through authenticated proxies; (9) detect/deny threatening outbound traffic and audit associated internal users; (10) prevent unauthorized exfiltration; (11) allow incoming traffic only from authorized sources to authorized destinations; (12) host-based boundary protections on defined components; (13) isolate security tools/support components on separate managed subnets; (14) protect managed interfaces against unauthorized physical connections; (15) route privileged network access through a dedicated managed interface for access control/auditing; (16) prevent discovery of selected managed-interface components; (17) enforce protocol formats; (18) fail securely when a boundary device fails; (19) block traffic between defined independently configured clients; (20) dynamically isolate/segregate defined components; (21) separate components supporting different missions/functions using boundary controls; (22) use separate subnets for different security domains; (23) disable sender feedback on protocol-validation failure. Many enhancements describe network infrastructure and require operator tailoring; withdrawn entries are not separate active enhancements.

## Assessment status

**Planned / deployment-dependent; not verified.** No Stagehand network boundary is implemented or assessed by this record.

## Organisation-defined parameter suggestions

SC-7 assigns network boundaries, traffic policy, authorized sources/destinations, monitoring, and selected components. **Suggestion for review:** allow only documented destinations required for the run (for example, approved test targets and necessary identity/package endpoints); deny all other egress by default where feasible; require security-owner approval for exceptions and review them quarterly.
