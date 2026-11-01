# SC-25 - Thin Nodes

**Source:** [ITSG-33 Annex 3A, SC-25](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc25).

## Control definition

Employ assigned information-system components with minimal functionality and information storage.

**Organisation-defined parameter:** components. **Suggestion for review:** consider stateless or disposable CI runner images where compatible with operations.

## Supplemental guidance

Thin clients and diskless nodes reduce the amount of endpoint functionality and stored information that must be secured, potentially reducing attack exposure.

## Related controls

From the [official SC-25 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc25), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-30](SC-30-concealment-and-misdirection.md).

## Plain-language metaphor

Like using a simple kiosk that stores little and can be reset easily instead of a fully stocked office computer.

## Stagehand and operator guidance

Stagehand need not mandate thin clients. Operators may use hardened ephemeral runners, minimal OS images, and externalized approved secret stores; preserve required evidence securely.

## Control enhancements

None listed.

## Assessment status

**Planned / environment-dependent; not verified.**
