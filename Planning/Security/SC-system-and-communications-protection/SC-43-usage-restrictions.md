# SC-43 - Usage Restrictions

**Source:** [ITSG-33 Annex 3A, SC-43](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc43).

## Control definition

Set usage restrictions and implementation guidance for components based on potential damage if misused; authorize, monitor, and control their use.

**Organisation-defined parameter:** components. **Suggestion for review:** identify components that can execute code, access targets, or move data, and define approved users and conditions.

## Supplemental guidance

Components can include hardware, software, and firmware such as VoIP, mobile code, printers, scanners, wireless technology, and mobile devices. Related controls include configuration settings and boundary protection.

## Related controls

From the [official SC-43 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc43), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [SC-7](SC-7-boundary-protection.md).

## Plain-language metaphor

Like giving dangerous tools to trained people only and keeping a record of when they are used.

## Stagehand and operator guidance

Treat the runner/browser as a powerful component: allow only approved users, plans, targets, and environments. Operators should restrict unapproved browser extensions, plugins, and tools on runner hosts.

## Control enhancements

None listed.

## Assessment status

**Planned / deployment-dependent; not verified.**
