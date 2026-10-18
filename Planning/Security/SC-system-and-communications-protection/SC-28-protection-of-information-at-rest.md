# SC-28 - Protection of Information at Rest

**Source:** [ITSG-33 Annex 3A, SC-28](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Protect the confidentiality and/or integrity, as selected, of assigned information while stored on system storage components.

**Organisation-defined parameters:** information and selected protection property. **Suggestion for review:** include plans, credentials, browser profiles, logs, screenshots, traces, and reports; select confidentiality/integrity safeguards based on categorization.

## Supplemental guidance

Covers user and system information at rest. Protection may use cryptography, file-share scanning, write-once storage, or secure offline storage where online protection is insufficient. Align key management with SC-12.

## Plain-language metaphor

Like locking documents in a cabinet and using a seal to reveal if someone changed them.

## Stagehand and operator guidance

Maintainers should minimize persistent secrets and provide safe storage guidance. Operators should use full-disk or file-level encryption, restrict artifact access/retention, secure browser profiles, and manage encryption keys under policy.

## Control enhancements

(1) cryptographically prevent unauthorized disclosure/modification of defined information on defined components; (2) remove defined information from online storage and keep it in a secure offline location. Select based on data sensitivity and deployment need.

## Assessment status

**Planned / deployment-dependent; not verified.**
