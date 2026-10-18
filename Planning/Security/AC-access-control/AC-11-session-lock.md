# AC-11 — Session Lock

**Status:** Environment / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

After an organisation-defined inactive period, or on user request, prevent further access until the user re-authenticates. Keep the lock in place until identity is re-established.

## Supplemental Guidance summary

A session lock protects a temporarily unattended device or application session. It is not a replacement for required end-of-day logout. It can be implemented at OS or application level when session activity is observable.

## Plain-language explanation

It is like closing the office door when stepping away, while leaving work in place; returning requires showing your badge again.

## Stagehand mapping and operator guidance

Stagehand does not plan a logged-in session. Apply workstation, remote desktop, browser, CI console, and target-application locking rules in the hosting environment. Avoid long-lived authenticated browser profiles in shared workers; destroy the context after execution where feasible.

## Parameter suggestion for review

Set inactivity duration according to data sensitivity and work pattern. **Suggestion:** use the organisation's managed endpoint baseline; do not create an app-specific timeout until Stagehand has an interactive authenticated session.

## Enhancements

AC-11(1) Pattern-hiding displays: while locked, replace previously visible information with a non-sensitive image or blank display. This is an OS/desktop responsibility, not a browser test feature.
