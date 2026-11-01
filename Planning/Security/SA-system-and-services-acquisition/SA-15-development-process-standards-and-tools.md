# SA-15 - Development Process, Standards, and Tools

**Source:** [ITSG-33 Annex 3A, SA-15](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa15).

## Control definition

Require a documented development process that addresses security requirements, identifies standards/tools and their options/configurations, and controls changes to them. Review the process and tooling at defined intervals to confirm they meet defined security requirements.

**Organisation-defined parameters:** review frequency and security requirements. **Suggestion for review:** review at least annually and after a major toolchain change; document supported languages, build tools, CI settings, and security gates.

## Supplemental guidance

Development tools include programming languages and design systems. Process/tool reviews can use maturity models. Configuration control across the lifecycle supports supply-chain risk management and helps prevent unauthorized changes.

## Related controls

From the [official SA-15 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa15), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SA-3](SA-3-system-development-lifecycle.md), [SA-8](SA-8-security-engineering-principles.md).
- **SA-15(3):** [SA-4](SA-4-acquisition-process.md), [SA-14](SA-14-criticality-analysis.md).
- **SA-15(4):** [SA-4](SA-4-acquisition-process.md).
- **SA-15(5):** [CM-7](../CM-configuration-management/CM-7-least-functionality.md).
- **SA-15(7):** [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).
- **SA-15(10):** [IR-8](../IR-incident-response/IR-8-incident-response-plan.md).

## Plain-language metaphor

Like documenting the recipe, oven settings, and quality checks, then controlling any changes to how the product is made.

## Stagehand and operator guidance

Maintainers should document repository workflows, dependency and build tooling, CI configuration, and approved changes as these processes are established. Operators should review and pin build/runtime tool versions and treat changes to CI actions and plugins as supply-chain changes.

## Control enhancements

(1) define quality metrics early and provide evidence at selected times/milestones/delivery; (2) use a security tracking tool; (3) developer performs criticality analysis at defined depth and lifecycle points; (4) threat-model and analyse vulnerabilities using defined impact/threat inputs, methods, and acceptance criteria; (5) reduce attack surface to defined thresholds; (6) explicit continuous-improvement process; (7) automated vulnerability analysis with defined tools, exploitation potential, mitigations, and delivery of results to assigned roles; (8) reuse threat/vulnerability findings from similar systems; (9) approve, document, and control live data in development/test (prefer dummy data where feasible); (10) provide developer incident-response plan; (11) archive release with evidence supporting final security review.

## Current repository context

CONTRIBUTING.md, the dev-container definition, pinned toolchain, workspace checks, and configured PR CI describe the current development process. The 209-test existing-suite run and owner-reported passing PR checks are development evidence, not formal verification or tool qualification.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** No documented development-process review or enhancement evidence is asserted.
