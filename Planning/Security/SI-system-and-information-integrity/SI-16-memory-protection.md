# SI-16 - Memory Protection

**Source:** [ITSG-33 Annex 3A, SI-16](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si16).

## Control definition

Use defined safeguards to protect system memory from unauthorized code execution.

**Organisation-defined parameter:** safeguards. **Suggestion for review:** use supported operating systems/runtimes with hardware-backed execution protections enabled; do not disable DEP/ASLR or equivalent mitigations without approved rationale.

## Supplemental guidance

Attackers may try to execute code in prohibited memory regions. Data execution prevention and address-space layout randomization are examples; hardware-enforced protections generally provide stronger mechanisms.

## Related controls

From the [official SI-16 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si16), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-25](../AC-access-control/AC-25-reference-monitor.md), [SC-3](../SC-system-and-communications-protection/SC-3-security-function-isolation.md).

## Plain-language metaphor

Like marking certain areas of a workshop as storage-only so stored material cannot suddenly become a running machine.

## Stagehand and operator guidance

Memory protections are provided by the runtime, OS, and hardware. Maintainers should use supported runtimes and avoid unsafe native extensions; operators keep platform mitigations enabled and patched.

## Control enhancements

None listed.

## Assessment status

**Planned / platform-dependent; not verified.**
