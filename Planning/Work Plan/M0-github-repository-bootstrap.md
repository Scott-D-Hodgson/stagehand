# M0 — GitHub repository bootstrap and PR governance

**Status:** Complete
**Original estimate:** 1–3 person-days (not actual effort)
**Depends on:** None (bootstrap prerequisite)

## Objective

Established the public repository and a deliberate PR-based workflow before Phase 1 implementation, including solo self-review and a path to independent review.

## Tasks completed

- Created the public repository with `main` as its default branch and configured the active `Protect main` ruleset.
- Added the contribution guide, root contributing link, and PR template with a self-review checklist.
- Enabled merge commits and squash merging, disabled rebase merging, and exercised the repository rules with a test PR.

## Decisions made

- Required PRs, conversation resolution, restricted deletion, and blocked force pushes; the initial ruleset had an empty bypass list.
- Used zero native required approvals during the solo phase and manual self-review. Contributor PRs receive owner review.
- Adopted merge commits for owner-authored PRs and squash merges for other contributors as a human convention, not author-sensitive automation.

## Deferred work

- Automated author-sensitive review-policy enforcement remains assigned to [TE-021](../Backlog/technical-enablers/te-021-automated-pr-review-policy-check.md).
- Require independent approval when trusted reviewers join; signing and additional review controls can be revisited with contributor needs.

## Completion evidence

- The recorded M0 close-out confirms repository creation, ruleset configuration, contribution documentation, and a successful test PR.
- The owner confirmed the enabled merge methods and disabled rebase merging. These are recorded completion observations, not a fresh audit of remote settings.

## Learning plan reference

[Repository collaboration](../../Learning%20Plan/Phase%201/Lessons/01-repository-collaboration.md).

## Supporting detail

### Initial ruleset configuration record

This table records the initial settings and rationale, not a fresh audit of current remote configuration.

| Setting | Initial choice | Reason |
|---|---|---|
| Ruleset name | `Protect main` | Clear, short, and describes what it protects. |
| Enforcement | **Active** | A disabled or evaluate-only ruleset would not protect `main`. |
| Target | Branch name pattern `main` | Protects the branch used for the repository's default branch. |
| Bypass list | Empty | No actor or app should bypass the protections by default. The owner can still change repository settings; this is not a defence against the owner changing the ruleset. |
| Require a pull request before merging | On | Keeps changes flowing through the reviewable PR process. |
| Required approvals | **0 for now** | GitHub does not count the author's approval on their own PR. Keep the self-review checklist manual while there is only one maintainer. |
| Require conversation resolution | On | Requires PR comments to be addressed or acknowledged before merging. |
| Restrict deletions | On | Prevents accidental deletion of `main`. |
| Block force pushes | On | Prevents rewriting published `main` history. |
| Require linear history | Off | This conflicts with the intended use of merge commits on owner-authored PRs. |
| Require status checks | Off until checks exist | Do not require a check that has not been created and observed in GitHub. Add relevant CI checks later. |
| Require signed commits | Off initially | Avoid adding signing setup overhead before the repository workflow and contributor needs are established. Revisit if policy requires it. |

When trusted independent reviewers are available, update the ruleset to require at least one non-author approval and consider dismissing stale approvals or requiring approval of the latest reviewable push. Those settings do not replace the current manual self-review policy.

### GitHub references

- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Approving a pull request with required reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)
- [Helping others review your changes](https://docs.github.com/en/pull-requests/concepts/helping-others-review-your-changes)
- [Configuring commit merging for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-merging-for-pull-requests)
- [Configuring commit squashing for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)
- [Pull request merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
