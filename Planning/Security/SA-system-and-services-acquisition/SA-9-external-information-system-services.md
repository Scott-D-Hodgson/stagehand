# SA-9 - External Information System Services

**Source:** [ITSG-33 Annex 3A, SA-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Require external service providers to meet organisational security requirements and defined controls; document government oversight and user roles; and monitor provider compliance on an ongoing basis.

**Organisation-defined parameters:** provider controls; monitoring processes/methods; and (enhancements) providers, approving roles, trust criteria, safeguards, and permitted service/data locations. **Suggestion for review:** name a service owner and security approver, require evidence and incident notification, and review evidence at least annually and after material service changes.

## Supplemental guidance

External services sit outside the system authorization boundary, even when used by it. Responsibility for risk remains with the authorizing organisation. Document provider/user responsibilities and service levels; maintain a chain of trust, including relevant subcontractors, supported by evidence and agreements.

## Plain-language metaphor

Like hiring a courier: you still own the package, so you check who handles it, where it travels, and how delivery is confirmed.

## Stagehand and operator guidance

Hosting, CI, source control, package registries, and telemetry are deployment or development services. Operators should assess contracts, data locations, provider controls, subcontractors, availability, incident response, and evidence. Stagehand maintainers should document any service dependency and avoid implying provider safeguards without evidence.

## Control enhancements

(1) assess risks and obtain assigned approval before outsourcing dedicated security services; (2) require providers to identify necessary functions, ports, protocols, and services; (3) document and maintain trust relationships using defined criteria; (4) use safeguards to align provider and organisational interests; (5) restrict processing, storage, or service locations under defined conditions. Apply based on the actual external services and organisational requirements; these are provider-governance measures, not built-in application features.

## Assessment status

**Planned / not verified.** No provider has been assessed in this record.
