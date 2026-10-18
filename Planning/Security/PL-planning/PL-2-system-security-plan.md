# PL-2 — System Security Plan

**Source:** [ITSG-33 Annex 3A, PL-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Create a security plan aligned with enterprise architecture that defines system boundary and mission context, categorization/rationale, operating environment and connections, security requirements/overlays, planned or implemented controls and tailoring rationale, and obtains authorizing approval before implementation. Distribute it to defined roles, review/update it for defined cadence and material changes, and protect it from unauthorized disclosure or modification.

**Organisation-defined parameters:** recipients and review cadence. **Suggestion for review:** review annually and after boundary, hosting, data, or major control changes; restrict access because plans reveal architecture and weaknesses.

## Supplemental guidance

Plans connect requirements to controls and explain at a high level how controls satisfy them. They specify parameter choices sufficiently to support design and risk decisions. A plan can be a collection of referenced documents rather than one file; detailed contingency/incident procedures can be referenced.

## Plain-language metaphor

It is the system’s security blueprint: what is inside the fence, what protections are planned, and who approved the design.

## Stagehand and operator guidance

The adopting organisation should define whether Stagehand, browser, runner, host, identity, network, and target systems are in one authorization boundary or multiple. Document data flows, external dependencies, control ownership, parameter decisions, and rationale. Protect the plan. This repository’s assessment is not a security plan for an operational system.

## Enhancements

1. **PL-2(1), concept of operations:** withdrawn and incorporated into PL-7.
2. **PL-2(2), functional architecture:** withdrawn and incorporated into PL-8.
3. **PL-2(3), coordinate with other organisational entities:** plan/coordinate assessments, maintenance, patching, tests, and other security activities before performing them.
