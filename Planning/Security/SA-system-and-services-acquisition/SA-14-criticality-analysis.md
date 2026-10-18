# SA-14 - Criticality Analysis

**Source:** [ITSG-33 Annex 3A, SA-14](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Identify critical system components and functions through criticality analysis for assigned systems/components/services at defined lifecycle decision points.

**Organisation-defined parameters:** scope and decision points. **Suggestion for review:** perform analysis during architecture/design and significant change; identify components whose failure or direct access could disrupt critical business functions.

## Supplemental guidance

Criticality analysis supports supply-chain-risk prioritization. Decompose missions into functions, then trace those functions to hardware, software, and firmware, including shared components inside or outside the system boundary. Consider components with unmediated access to critical functions. Reassess when architecture or design changes.

## Plain-language metaphor

Like identifying which beams hold up a building before deciding where extra inspections are needed.

## Stagehand and operator guidance

Maintainers should identify critical product components such as plan interpretation, browser-control boundaries, and release/update mechanisms when a risk analysis is undertaken. Operators should map the components and services their deployment depends on to their business functions; this assessment is deployment-specific.

## Control enhancements

None listed.

## Assessment status

**Planned / not verified.** No formal criticality analysis is asserted.
