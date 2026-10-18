# SC-23 - Session Authenticity

**Source:** [ITSG-33 Annex 3A, SC-23](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Protect the authenticity of communications sessions.

## Supplemental guidance

Session-level protection establishes confidence in each party’s identity and transmitted information and addresses interception, hijacking, and insertion of false information.

## Plain-language metaphor

Like checking both caller identity and the integrity of the conversation, not merely checking that the phone line works.

## Stagehand and operator guidance

Stagehand should rely on secure browser/session mechanisms and avoid persisting sensitive session state in plans or artifacts. Operators should protect cookies/tokens, use TLS, and configure secure session handling in identity providers and target applications.

## Control enhancements

(1) invalidate session identifiers at logout/termination; (2) user-initiated logout/message display withdrawn into AC-12(1); (3) generate unique session identifiers meeting defined randomness requirements and accept only system-generated IDs; (4) duplicate unique-ID enhancement withdrawn into SC-23(3); (5) restrict protected sessions to defined certificate authorities.

## Assessment status

**Planned / target-and-host-dependent; not verified.**

## Organisation-defined parameter suggestions

Enhancements assign session-ID randomness requirements and approved certificate authorities. **Suggestion for review:** use platform-generated unpredictable session IDs and the organisation’s managed trust store; do not allow self-signed or unapproved authorities for protected sessions unless formally approved.
