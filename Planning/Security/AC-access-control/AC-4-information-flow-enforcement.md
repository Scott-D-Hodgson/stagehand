# AC-4 — Information Flow Enforcement

**Assessment status:** Shared; planned / not implemented or verified  
**Source:** [ITSG-33 Annex 3A, AC-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33)

## Control definition

The system enforces approved rules governing where information may move within the system and between connected systems, using organisation-defined information-flow policies.

## Supplemental Guidance summary

Information-flow rules govern destinations and paths, while access-control rules govern who may use information. They can be enforced at network boundaries, proxies, gateways, or application transfer points and may examine addresses, content, or structure. Transfers between systems with different security policies create risk. The catalogue notes that many higher-numbered enhancements address specialized cross-domain filtering and guard solutions.

## Plain-language explanation

AC-4 is like a mailroom that checks not only who may open a letter, but also which building it may be sent to and whether it can cross a secure boundary.

## Stagehand application mapping

Stagehand plans and reports can move between a user's workstation, repository, CI service, browser, target application, and artifact store. The baseline product does not provide a network boundary or cross-domain guard. Plan validation and safe output handling can reduce risks, but egress restrictions and data-flow enforcement primarily belong to the host environment.

| Area | Planned treatment |
| --- | --- |
| Plans | Validate format and constrain supported actions; avoid embedding secrets or unapproved data. Consider explicit navigation/redirect allowlists as a security requirement. |
| Runner | Document network destinations and data flows; avoid arbitrary code execution; constrain worker egress outside the app. |
| Editor | Verify that importing/editing plans causes no unapproved uploads or external requests. |
| Reports | Treat exports, screenshots, traces, and HTML as data flows beyond the runner boundary; restrict destinations and recipients. |
| Operator | Configure firewall/proxy rules to permit only approved targets and services; use approved cross-domain mechanisms if the deployment has separate security domains. |

## Organisation-defined parameters — suggestions for review

- **Flow policy:** candidate baseline is deny-by-default outbound access from execution workers, with narrowly allowlisted target applications and required package/service endpoints. Validate against CI needs.
- **Information categories and destinations:** define which plan data, credentials, logs, and artifacts may flow to each destination. Use the organisation's classification scheme; do not invent labels for the application.
- **Review points:** require human review before exporting artifacts that may contain sensitive data or sending runs to a higher-sensitivity or production environment.

## Control enhancements

The catalogue lists 22 enhancements; many address specialized cross-domain systems and may not apply to a standalone browser-testing toolkit. Select applicability through the system profile and risk assessment.

| ID | Enhancement | Stagehand-oriented note |
| --- | --- | --- |
| AC-4(1) | Object security attributes | Apply labels/attributes to data and endpoints; not a current Stagehand capability. |
| AC-4(2) | Processing domains | Isolate processing spaces; use CI worker/container/VM isolation where required. |
| AC-4(3) | Dynamic information flow control | Change allowed flows based on conditions; deployment policy/network controls. |
| AC-4(4) | Content check encrypted information | Inspect, block, or otherwise handle encrypted flows under policy; configure at approved network inspection points. |
| AC-4(5) | Embedded data types | Limit nested/embedded content beyond inspection capability; relevant to uploaded plans/artifacts only if such transfers are allowed. |
| AC-4(6) | Metadata | Use trusted metadata for flow decisions; protect its accuracy and binding to the data. |
| AC-4(7) | One-way flow mechanisms | Enforce hardware one-way transfer where a high-assurance boundary requires it; outside Stagehand. |
| AC-4(8) | Security policy filters | Filter by content and structure; apply approved gateways or artifact scanning, not a Stagehand claim. |
| AC-4(9) | Human reviews | Require review where automatic decisions cannot establish safe release. |
| AC-4(10) | Enable/disable security policy filters | Restrict administrative changes to filters and document conditions. |
| AC-4(11) | Configuration of security policy filters | Restrict filter configuration and change control to authorized operators. |
| AC-4(12) | Data type identifiers | Validate file types/signatures at cross-domain transfer points. |
| AC-4(13) | Decomposition into policy-relevant subcomponents | Parse transferred packages so policy checks can inspect relevant parts. |
| AC-4(14) | Security policy filter constraints | Use enumerated formats and structure/content constraints at domain boundaries. |
| AC-4(15) | Detection of unsanctioned information | Scan for prohibited or malicious content before transfer; combine with SI-3 processes. |
| AC-4(16) | Information transfers on interconnected systems | Withdrawn in the catalogue and incorporated into AC-4. |
| AC-4(17) | Domain authentication | Authenticate source and destination systems/applications/users for transfers. |
| AC-4(18) | Security attribute binding | Bind labels/attributes reliably to information; not in planned Stagehand scope. |
| AC-4(19) | Validation of metadata | Filter metadata under the same policy as payload data. |
| AC-4(20) | Approved solutions | Use organisation-approved cross-domain solutions/configurations. |
| AC-4(21) | Physical/logical separation of information flows | Separate traffic or information classes using approved mechanisms. |
| AC-4(22) | Access only | Permit access to multiple domains while preventing data transfer between them; a host/VDI architecture decision. |

Enhancement entries above are concise summaries, not control statements. Consult the official catalogue for exact definitions and supplemental guidance. None are asserted as satisfied.

## Evidence to collect

- Data-flow diagram for plans, credentials, browser traffic, logs, and artifacts.
- Worker egress rules and tests showing unapproved destinations are blocked.
- Editor network-behaviour assessment and report/artifact release procedures.
- For cross-domain use, approved architecture and assessment of the selected guard/transfer solution.
