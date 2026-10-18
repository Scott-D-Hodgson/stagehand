# SC-13 - Use of Cryptography

**Source:** [ITSG-33 Annex 3A, SC-13](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Implement organisation-defined cryptographic uses and the required type of cryptography for each use, consistent with applicable requirements.

**Organisation-defined parameter:** cryptographic uses and cryptography type for each use. **Suggestion for review:** create a use-to-standard mapping only where cryptography is required by policy or another selected control; have the security authority approve it.

## Supplemental guidance

Cryptography can protect information, provide signatures, enforce separation, or support random/hash generation. This control itself does not require organisations to use cryptography; when required elsewhere, document the use and type. Catalogue examples include FIPS-validated and CSE-approved cryptography.

## Plain-language metaphor

Like choosing the right kind of lock for each purpose instead of assuming one lock fits every door.

## Stagehand and operator guidance

Use platform/standard cryptographic libraries and services; do not invent algorithms. Operators determine required cryptography for stored plans, reports, transmissions, and classified/protected data under current policy. Select applicable government requirements for the deployment; this record does not certify any implementation.

## Control enhancements

Enhancements (1)-(9) in this Annex are withdrawn and incorporated into SC-13: FIPS-validated cryptography, NSA-approved cryptography, separation for persons lacking formal approvals, digital signatures, transmission protections for Protected A/B/C, protection at rest, and COMSEC equipment. They are not separate active enhancements here.

## Assessment status

**Planned / deployment-dependent; not verified.** No cryptographic implementation is evaluated.
