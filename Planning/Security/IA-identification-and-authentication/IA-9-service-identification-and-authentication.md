# IA-9 — Service Identification and Authentication

**Source:** [ITSG-33 Annex 3A, IA-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Identify and authenticate defined information-system services using defined safeguards.

**Organisation-defined parameters:** services in scope and safeguards.

## Supplemental guidance

Distributed systems may use dynamic external services. The system should be able to determine whether providers and their services are authentic; signing and provenance evidence are examples of safeguards.

## Plain-language metaphor

Before accepting a delivery, verify both the courier company and the package label.

## Stagehand and operator guidance

Verify the authenticity of package registries, browser/automation services, identity endpoints, telemetry providers, and target APIs. Use TLS validation, signed artifacts, pinned/trusted sources where appropriate, and approved service credentials. Operators should maintain endpoint allowlists and validate cloud-provider service identities.

## Enhancements

1. **IA-9(1), information exchange:** ensure service providers receive, validate, and transmit identity/authentication information.
2. **IA-9(2), transmission of decisions:** transmit authentication decisions consistently with policy between defined services, without unnecessarily transmitting authenticators themselves.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

