# CA-9 — Internal System Connections

**Source:** [ITSG-33 Annex 3A, CA-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Authorize defined components or component classes to connect within the system and document each connection’s interfaces, security requirements, and information exchanged.

**Organisation-defined parameters to review:** authorized components/classes and connection details.

## Supplemental guidance

Internal connections include separate components such as workstations, mobile devices, printers, sensors, or servers. Organisations may authorize classes that share a baseline rather than approve each instance individually.

## In plain language

Even inside one building, decide which rooms and machines may connect and what may pass between them.

## Stagehand initial assessment

Document connections among the Stagehand UI/editor, runner, browser process, local files, orchestration service, and target applications. Restrict local control interfaces to intended components and users. Operators should inventory supporting devices/services and confirm their baselines before joining them to the deployment.

## Control enhancements

1. **CA-9(1), security compliance checks:** check component compliance, such as baseline configuration, before establishing an internal connection.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

