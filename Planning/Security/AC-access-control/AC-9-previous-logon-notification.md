# AC-9 — Previous Logon (Access) Notification

**Status:** Environment / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

After successful access, show the user the date and time of the previous access.

## Supplemental Guidance summary

This can apply to human login interfaces and other system architectures. It helps users notice access that may not have been theirs.

## Plain-language explanation

The sign-in screen says, “Your last visit was Tuesday at 9:15.” An unexpected time is a clue that someone else may have used the account.

## Stagehand mapping and operator guidance

No Stagehand user-account interface is planned. Configure this in the identity provider, operating system, repository, CI, or target application that authenticates users. If Stagehand introduces accounts, consider showing previous access information there. This is not supplied by a test report.

## Parameter suggestion for review

For AC-9(2), choose a reporting window aligned with identity-provider log retention; **suggestion:** use the provider's existing security-event window rather than creating a separate Stagehand value.

## Enhancements

AC-9(1) show failed logons since the last successful sign-in; AC-9(2) show selected successful/failed counts within an organisation-defined period; AC-9(3) notify users about security-related account changes within a defined period; AC-9(4) show additional organisation-defined sign-in details such as last-access origin. Stagehand has no planned identity service to implement these. See source for full statements.
