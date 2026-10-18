# SC-11 - Trusted Path

**Source:** [ITSG-33 Annex 3A, SC-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Establish a trusted communication path between users and assigned security functions, including at minimum authentication and re-authentication.

**Organisation-defined parameter:** security functions (authentication and re-authentication are minimum). **Suggestion for review:** identify sign-in and credential-change paths and ensure users can distinguish them from untrusted prompts.

## Supplemental guidance

Trusted paths permit direct user communication with security functions, are activated by users or system security functions, and protect user responses from disclosure or alteration by untrusted applications. They are used for high-assurance actions such as logon.

## Plain-language metaphor

Like a direct, verified service window for handing credentials to security staff, separate from messages passed through strangers.

## Stagehand and operator guidance

Stagehand does not currently define a hosted authentication path. If authentication is added, maintainers should use trusted browser/OS/identity-provider flows and avoid credential prompts embedded in test content. Operators should use approved identity providers and verify URLs/certificates.

## Control enhancements

(1) provide a logically isolated and distinguishable trusted communications path.

## Assessment status

**Planned / architecture-dependent; not verified.**
