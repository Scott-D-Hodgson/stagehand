# PS-4 — Personnel Termination

**Source:** [ITSG-33 Annex 3A, PS-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

On termination, disable access within a defined period, revoke authenticators, conduct an exit discussion of security topics, recover system property, retain organisational access to work information, and notify defined roles within a defined period.

Suggestion for review: disable access immediately or within one hour of confirmed termination; notify HR, security, managers, and IT within one business day. Coordinate exceptions and legal requirements.

## Supplemental guidance

Property includes tokens, manuals, keys, badges, and passes. Timeliness is especially important for termination for cause; exit interviews may not always be possible.

## Plain-language metaphor

Like collecting keys and changing locks when someone leaves.

## Stagehand and operator guidance

Stagehand has no employee lifecycle integration. Remove access to source control, package registries, CI secrets, signing keys, test environments, and reports under the operator’s offboarding process.

## Control enhancements

Enhancements: (1) communicate legally binding post-employment information duties and obtain acknowledgment; (2) automate notifications to defined roles. The first requires legal review; the second belongs in the organisation’s HR/identity workflows.

## Assessment status

**Planned / not verified.** Stagehand implementation and deployment evidence must be assessed before assigning an implemented or compliant status. This summary is a paraphrase for planning, not an authorization decision.

