# IA-5 — Authenticator Management

**Source:** [ITSG-33 Annex 3A, IA-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Manage authenticators by verifying recipients, setting initial content and required strength, establishing issuance/loss/revocation procedures, replacing defaults before installation, defining lifetime/reuse rules and refresh schedules, protecting authenticators, requiring user/device safeguards, and changing group/role authenticators when membership changes.

**Organisation-defined parameters:** authenticator strength, lifetime/refresh, password conditions, registration process, token/biometric quality, cached-authenticator expiry, and trust-store management.

## Supplemental guidance

Authenticators include passwords, tokens, biometrics, certificates, and key cards. Factory defaults are commonly known and risky. Protect secrets in storage and transit; revoke credentials when no longer needed; report lost or compromised authenticators promptly. Password rules and procedures depend on mechanism and policy.

## Plain-language metaphor

Issue keys to verified people, replace factory keys, protect spares, and change locks when a key is lost or a person leaves.

## Stagehand and operator guidance

Stagehand plans must not contain secrets. Operators should use a secrets manager or identity provider, short-lived scoped credentials, rotation/revocation procedures, and separate identities per user/service. Never embed static credentials in task plans, scripts, or screenshots. Verify browser storage and logs do not expose authenticators.

## Enhancements

1. **IA-5(1), password-based:** define/enforce password complexity and change requirements, protect stored/transmitted passwords cryptographically, define lifetime/reuse restrictions, and support temporary passwords with immediate change.
2. **IA-5(2), PKI-based:** validate certificate paths/status; protect private-key access; map identity to accounts; cache revocation data for outages.
3. **IA-5(3), trusted registration:** require in-person or trusted-third-party registration for defined authenticators with designated authority approval.
4. **IA-5(4), automated strength determination:** use tools to check password strength against defined requirements.
5. **IA-5(5), change before delivery:** require developers/installers to provide unique or changed defaults before delivery/installation where applicable.
6. **IA-5(6), protection of authenticators:** protect credentials according to the sensitivity of the information they unlock.
7. **IA-5(7), no embedded unencrypted static authenticators:** prevent such credentials in apps, scripts, or function keys.
8. **IA-5(8), multiple accounts:** apply safeguards against compromise propagation across accounts.
9. **IA-5(9), cross-organisation credential management:** coordinate credentials with external organisations.
10. **IA-5(10), dynamic credential association:** dynamically provision identities where trusted external bindings support it.
11. **IA-5(11), hardware-token authentication:** meet defined token-quality requirements.
12. **IA-5(12), biometric authentication:** meet defined biometric-quality requirements, including accuracy considerations.
13. **IA-5(13), expiration of cached authenticators:** prohibit cached credentials after a defined period.
14. **IA-5(14), PKI trust-store management:** centrally govern trust-store contents across platforms and applications.
15. **IA-5(15), FICAM-approved products/services:** marked not applicable to the Government of Canada in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

