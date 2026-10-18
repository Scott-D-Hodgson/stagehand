# SC-18 - Mobile Code

**Source:** [ITSG-33 Annex 3A, SC-18](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Define acceptable/unacceptable mobile code and technologies; establish usage restrictions and guidance; authorize, monitor, and control use.

## Supplemental guidance

Assess potential damage if code is malicious. Mobile code includes technologies such as JavaScript, ActiveX, PDF scripting, and macros on servers or user devices. Prevent introduction of unacceptable code.

## Plain-language metaphor

Like inspecting visiting contractors’ tools before letting them operate inside the building.

## Stagehand and operator guidance

Plans may trigger browser execution of page scripts. Maintainers should treat plans and target content as untrusted, limit permitted actions, and isolate execution. Operators should use managed browsers, restrict extensions and downloads, and apply approved script policies.

## Control enhancements

(1) identify unacceptable code and block/quarantine/alert; (2) ensure mobile-code acquisition/development/use meets defined requirements; (3) prevent download/execution of unacceptable code; (4) prevent automatic execution and require defined pre-execution actions; (5) run permitted code only in confined virtual-machine environments.

## Assessment status

**Planned / environment-dependent; not verified.**

## Organisation-defined parameter suggestions

Mobile-code definitions and corrective actions are organisation-specific. **Suggestion for review:** prohibit unapproved scripts/extensions and downloads on managed runner endpoints; quarantine or alert on detections; permit exceptions only through an authorized review.
