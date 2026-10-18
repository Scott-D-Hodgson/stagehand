# SI-14 - Non-Persistence

**Source:** [ITSG-33 Annex 3A, SI-14](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Use defined non-persistent components/services that start in a known state and terminate after a session or at defined intervals.

**Organisation-defined parameters:** components/services and refresh timing. **Suggestion for review:** use disposable CI/browser execution environments for untrusted plans; refresh after each job while preserving approved evidence separately.

## Supplemental guidance

Non-persistence reduces attacker time on target and can restore a known state without first proving compromise. Virtualization/re-imaging can support refresh, but frequency must balance risk and stability.

## Plain-language metaphor

Like using a fresh, clean workbench for every job instead of reusing one that might contain hidden residue.

## Stagehand and operator guidance

The runner should be designed to work in clean disposable workspaces where practical. Operators can use ephemeral agents/containers and securely handle required reports and evidence outside the refreshed environment.

## Control enhancements

(1) obtain software/data used for refreshes from defined trusted sources.

## Assessment status

**Planned / deployment-dependent; not verified.**
