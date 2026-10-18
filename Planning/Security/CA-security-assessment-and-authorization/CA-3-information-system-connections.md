# CA-3 — Information System Connections

**Source:** [ITSG-33 Annex 3A, CA-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Authorize connections to other information systems using Interconnection Security Agreements (or an allowed equivalent where systems share the same authorizing official); document each connection’s interfaces, security requirements, and information exchanged; and review/update agreements on a defined schedule.

**Organisation-defined parameter to review:** agreement review frequency and applicable boundary-protection/network restrictions in enhancements. **Suggested value for review:** review annually and when a connected system, data flow, or security boundary changes.

## Supplemental guidance

This applies to dedicated system interconnections, not ordinary user-controlled web browsing or email. Connections can introduce risks when systems have different controls. Authorizing officials determine risk and safeguards; agreements may be incorporated into formal contracts.

## In plain language

Before connecting two buildings’ networks, document what crosses the bridge, the rules on both sides, and who maintains the bridge.

## Stagehand initial assessment

For Stagehand integrations or dedicated connections to identity, orchestration, storage, or target systems, document endpoints, protocols, authentication, data exchanged, and owner approval. Browser navigation is not automatically an interconnection agreement, but persistent integrations and service links may be. Operators should use approved boundary controls and restrict external destinations according to policy.

## Control enhancements

1. **CA-3(1), unclassified national-security systems:** require a defined boundary-protection device for external network connections.
2. **CA-3(2), classified national-security systems:** require a defined boundary-protection device and appropriate flow enforcement.
3. **CA-3(3), unclassified non-national-security systems:** require a defined boundary device; catalogue notes applicability for Protected Information environments.
4. **CA-3(4), connections to public networks:** prohibit direct connection of defined systems to public networks.
5. **CA-3(5), external-connection restrictions:** select allow-all/deny-by-exception or deny-all/permit-by-exception policy for defined systems. Deny-by-default is the stronger restrictive option, subject to operational needs.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

