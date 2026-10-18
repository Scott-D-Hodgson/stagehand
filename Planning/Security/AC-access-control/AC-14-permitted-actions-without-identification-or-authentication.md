# AC-14 — Permitted Actions Without Identification or Authentication

**Status:** Shared / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Identify which actions, if any, may be performed without identification or authentication, and document the supporting rationale in the system security plan.

## Supplemental Guidance summary

Some public information access may not need login. Organisations may also define narrowly controlled emergency bypasses. This control concerns cases where authentication has not occurred at all; it does not cover an existing authenticated session. An organisation may decide that no unauthenticated actions are permitted.

## Plain-language explanation

Decide which doors, if any, are intentionally open to everyone, and write down why. Any emergency bypass should be deliberate and recorded.

## Stagehand mapping and operator guidance

The local-first editor may allow anonymous access to its static interface, but access to test plans, target systems, and artifacts remains controlled by the host and destination services. Document any public web hosting separately from authenticated execution. Do not put sensitive plan data or results in a publicly accessible site.

## Parameters — suggestions for review

Define unauthenticated actions. **Suggestion:** for Stagehand's core components, set privileged execution, secret access, plan publication, and sensitive-artifact access to none without authentication. Public access to non-sensitive documentation may be allowed under the organisation's web policy.

## Enhancements

The ITSG-33 Annex 3A entry lists no enhancements for AC-14.
