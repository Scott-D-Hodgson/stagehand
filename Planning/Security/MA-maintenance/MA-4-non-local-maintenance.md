# MA-4 — Non-Local Maintenance

**Source:** [ITSG-33 Annex 3A, MA-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Approve and monitor network-based maintenance; permit tools only under policy and system-plan rules; use strong authenticators for sessions; and keep activity records.

## Supplemental guidance

Non-local maintenance uses internal or external networks. Authentication should align with network-access requirements and typically resist replay and use MFA. Remote maintenance must be documented and monitored.

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
