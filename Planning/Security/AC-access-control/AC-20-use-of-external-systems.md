# AC-20 — Use of External Systems

**Source:** [ITSG-33 Annex 3A, AC-20](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Establish terms and conditions for authorized users to access organisational systems from external systems, and for external systems to process, store, or transmit organisational information. Restrict such use to approved cases and safeguards.

**Organisation-defined parameters to review:** permitted external systems and uses; required security controls; approval roles; and any limits on storage, processing, or transmission.

## Supplemental guidance

An external system is outside the organisation’s authorization boundary or direct control. Examples can include personally owned devices, partner systems, and cloud services. Agreements and technical protections should address the information and functions exposed; an external system’s claimed security is not itself proof of compliance.

## In plain language

Using an external system is like taking work papers to someone else’s office. Agree on how they will be protected and what may be done there before carrying them over.

## Stagehand initial assessment

Stagehand can interact with browsers, remote services, and potentially hosted automation environments. Operators should inventory the full path, obtain approval for external services, assess data residency and retention, and prohibit sensitive data in unapproved personal devices or public automation services. Use dedicated managed runners and scoped credentials for cloud/CI deployments. Review browser extensions, proxy services, telemetry, logs, and artifact storage as external-system boundaries.

## Control enhancements

Enhancements restrict external-system use and address portable storage/devices and non-organisation-owned systems or components. Apply the current catalogue’s wording and status, and define permitted use in deployment policy; no external-system approval workflow is claimed as implemented by Stagehand.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

