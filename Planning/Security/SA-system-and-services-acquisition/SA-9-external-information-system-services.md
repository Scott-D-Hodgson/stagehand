# SA-9 - External Information System Services

**Source:** [ITSG-33 Annex 3A, SA-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa9).

## Control definition

Require external service providers to meet organisational security requirements and defined controls; document government oversight and user roles; and monitor provider compliance on an ongoing basis.

**Organisation-defined parameters:** provider controls; monitoring processes/methods; and (enhancements) providers, approving roles, trust criteria, safeguards, and permitted service/data locations. **Suggestion for review:** name a service owner and security approver, require evidence and incident notification, and review evidence at least annually and after material service changes.

## Supplemental guidance

External services sit outside the system authorization boundary, even when used by it. Responsibility for risk remains with the authorizing organisation. Document provider/user responsibilities and service levels; maintain a chain of trust, including relevant subcontractors, supported by evidence and agreements.

## Related controls

From the [official SA-9 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa9), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-3](../CA-security-assessment-and-authorization/CA-3-information-system-connections.md), [IR-7](../IR-incident-response/IR-7-incident-response-assistance.md), [PS-7](../PS-personnel-security/PS-7-third-party-personnel-security.md).
- **SA-9(1):** [CA-6](../CA-security-assessment-and-authorization/CA-6-security-authorization.md), [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md).
- **SA-9(2):** [CM-7](../CM-configuration-management/CM-7-least-functionality.md).

## Plain-language metaphor

Like hiring a courier: you still own the package, so you check who handles it, where it travels, and how delivery is confirmed.

## Stagehand and operator guidance

Hosting, CI, source control, package registries, and telemetry are deployment or development services. Operators should assess contracts, data locations, provider controls, subcontractors, availability, incident response, and evidence. Stagehand maintainers should document any service dependency and avoid implying provider safeguards without evidence.

## Control enhancements

(1) assess risks and obtain assigned approval before outsourcing dedicated security services; (2) require providers to identify necessary functions, ports, protocols, and services; (3) document and maintain trust relationships using defined criteria; (4) use safeguards to align provider and organisational interests; (5) restrict processing, storage, or service locations under defined conditions. Apply based on the actual external services and organisational requirements; these are provider-governance measures, not built-in application features.

## Assessment status

**Planned / not verified.** No provider has been assessed in this record.
