# AC-6 — Least Privilege

**Status:** Planned; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Allow users and processes only the access needed for their assigned work. Apply the principle during development, deployment, and operation, and use separate roles/processes/accounts when they help keep privileges narrowly scoped.

## Supplemental Guidance summary

Least privilege applies to people and processes. Organisations may create distinct accounts, roles, and processes so routine work does not inherit administrative power. Reassess access as roles and risks change.

## Plain-language explanation

Give each worker only the keys needed for today's task, not a master key to the whole building.

## Stagehand plan and operator guidance

The local CLI runs with the invoking identity; the browser can exercise the permissions of its test account. Stagehand should document required permissions and avoid requiring administrator rights. Operators should use non-admin, isolated workers; dedicated low-privilege test identities; restricted egress; and narrow repository, CI, secret, and artifact permissions. No privilege enforcement is implemented yet.

## Parameters — suggestions for review

Define the roles allowed to change security settings, the roles allowed privileged access, and the review frequency. **Suggestion:** review privileged and CI identities quarterly and after role changes; validate this interval against organisational policy.

## Enhancements

The catalogue lists AC-6(1) authorize access to security functions; (2) non-privileged access for non-security functions; (3) network access to privileged commands; (4) separate processing domains; (5) privileged accounts; (6) privileged access by non-organisational users; (7) review of user privileges; (8) privilege levels for code execution; (9) auditing use of privileged functions; and (10) prohibit non-privileged users from executing privileged functions. These primarily map to host identity, CI, OS, and network controls. Stagehand should avoid privileged execution, document exceptions, and support externally visible run context where feasible. See source for complete statements and individual guidance.
