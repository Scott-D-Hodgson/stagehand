# AU-9 — Protection of Audit Information

**Source:** [ITSG-33 Annex 3A, AU-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Protect audit information and audit tools from unauthorized access, alteration, or deletion.

**Organisation-defined parameters to review:** subset of privileged users for audit management and read-only access; information subject to dual authorization.

## Supplemental guidance

Audit information includes records, settings, and reports needed to audit system activity. This control addresses technical protection; physical and media controls provide complementary safeguards. Separate audit privileges from general administrative privileges where feasible.

## In plain language

The referee’s notebook must be protected from anyone who could change the score after the game.

## Stagehand initial assessment

Operators should restrict log access, separate audit administration from ordinary application administration, encrypt data in transit and at rest where supported, and forward records to a separately controlled repository. Protect configuration and collection tools too. Ensure retention/deletion is governed by policy; do not claim product logs are tamper-proof without evidence.

## Control enhancements

1. **AU-9(1), hardware write-once media:** store audit trails on hardware-enforced write-once media.
2. **AU-9(2), separate-system backup:** back up records to a physically different system/component at a defined frequency.
3. **AU-9(3), cryptographic protection:** use cryptography to protect integrity of audit information and tools.
4. **AU-9(4), subset of privileged users:** limit audit-management access to an organisation-defined privileged subset.
5. **AU-9(5), dual authorization:** require two authorized people for defined movement or deletion actions.
6. **AU-9(6), read-only access:** limit specified privileged users to read-only audit access.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

