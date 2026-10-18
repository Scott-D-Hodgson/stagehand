# IA-7 — Cryptographic Module Authentication

**Source:** [ITSG-33 Annex 3A, IA-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Authenticate to cryptographic modules using mechanisms that meet applicable legislation, policy, directives, and standards.

## Supplemental guidance

Modules may require operator authentication and verification that the operator is authorized for the requested role and cryptographic service.

## Plain-language metaphor

Even a secure key vault checks who is opening it and what they are permitted to do inside.

## Stagehand and operator guidance

Where Stagehand uses OS cryptography, HSMs, or key-management services, operators should rely on approved modules and restrict administrative roles. Document which component performs cryptographic operations and its authorization boundary. Do not claim module validation based only on an application using a crypto library.

## Enhancements

None are listed for IA-7 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

