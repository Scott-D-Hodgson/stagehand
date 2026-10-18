# AU-10 — Non-Repudiation

**Source:** [ITSG-33 Annex 3A, AU-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Protect against a person or process falsely denying organisation-defined actions.

**Organisation-defined parameter to review:** actions covered by non-repudiation and the required identity-binding strength and validation response where enhancements apply.

## Supplemental guidance

Non-repudiation can establish who created, sent, received, or approved information. Digital signatures, receipts, and evidence chains can support this, but must be selected for the information’s sensitivity and risk. A normal application log is not automatically proof of non-repudiation.

## In plain language

It is a signed delivery receipt that helps show who sent or approved a package and whether it changed along the way.

## Stagehand initial assessment

Stagehand should not be treated as providing legally reliable signatures or proof of human intent. For consequential approvals, require the authorized user to review and approve through a separately controlled workflow that records identity and action. Operators should preserve signed target-system records and chain-of-custody information where evidence handling matters.

## Control enhancements

1. **AU-10(1), association of identities:** bind information to its producer and let authorized people determine that identity.
2. **AU-10(2), validate producer binding:** validate the producer-identity binding at a defined frequency and take defined action on error.
3. **AU-10(3), chain of custody:** retain reviewer/releaser identity and credentials through review and release.
4. **AU-10(4), validate reviewer binding:** validate reviewer identity at transfers between defined security domains and respond to errors.
5. **AU-10(5), digital signatures:** withdrawn and incorporated into SI-7.
