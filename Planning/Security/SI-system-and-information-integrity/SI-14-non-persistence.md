# SI-14 - Non-Persistence

**Source:** [ITSG-33 Annex 3A, SI-14](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si14).

## Control definition

Use defined non-persistent components/services that start in a known state and terminate after a session or at defined intervals.

**Organisation-defined parameters:** components/services and refresh timing. **Suggestion for review:** use disposable CI/browser execution environments for untrusted plans; refresh after each job while preserving approved evidence separately.

## Supplemental guidance

Non-persistence reduces attacker time on target and can restore a known state without first proving compromise. Virtualization/re-imaging can support refresh, but frequency must balance risk and stability.

## Related controls

From the [official SI-14 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si14), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-30](../SC-system-and-communications-protection/SC-30-concealment-and-misdirection.md), [SC-34](../SC-system-and-communications-protection/SC-34-non-modifiable-executable-programs.md).

## Plain-language metaphor

Like using a fresh, clean workbench for every job instead of reusing one that might contain hidden residue.

## Stagehand and operator guidance

The runner should be designed to work in clean disposable workspaces where practical. Operators can use ephemeral agents/containers and securely handle required reports and evidence outside the refreshed environment.

## Control enhancements

(1) obtain software/data used for refreshes from defined trusted sources.

## Current repository context

Explicit context/run cleanup is implemented and covered by doubles, but neither disposal of host storage nor secure memory erasure is established. Collected findings and raw scan objects can remain reachable after context close. Ephemeral workers, external session revocation, and artifact retention controls remain deployment responsibilities.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / deployment-dependent; not verified.**
