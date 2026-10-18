# M0 - GitHub repository bootstrap and PR governance

**Estimate:** 1-3 person-days  
**Depends on:** none  
**Purpose:** establish the repository and merge controls before Phase 1 implementation begins.

> **Current execution status:** The initial GitHub repository has been created, but its settings and PR behaviour still need review and verification. M0 remains incomplete. Keep the tasks below as a greenfield bootstrap guide, as requested, rather than rewriting the procedure around the existing remote.

## Tasks

- [ ] Create the public GitHub repository and set `main` as the default branch.
- [ ] Configure a branch ruleset or protection rule targeting `main`.
- [ ] Require pull requests before merging and disallow direct updates and force pushes to `main`; apply the rule to the repository owner/administrators and avoid bypass settings that undermine it.
- [ ] During the solo-maintainer phase, set required approving reviews to zero so the owner can merge their own PRs after self-review and checks. Keep the PR requirement active.
- [ ] Add a pull request template with an author self-review checklist (read the full diff, check for accidental changes, and confirm relevant checks ran); ask the author to complete it before merging.
- [ ] During the solo phase, use a manual review procedure: complete the self-review checklist on owner-authored PRs, and have the repository owner review PRs from other contributors before merging. Required status-check automation for this policy is deferred to [TE-021](../Backlog/technical-enablers/te-021-automated-pr-review-policy-check.md).
- [ ] Add a root README "Contributing" section that briefly explains the PR workflow and links to `CONTRIBUTING.md`; put detailed contribution and review instructions in `CONTRIBUTING.md`.
- [ ] Document the future transition: when trusted collaborators have write access, change the ruleset to require at least one approving review from someone other than the PR author, and dismiss stale approvals or require approval of the latest reviewable push.
- [ ] Document the review expectations (what the author checks, what reviewers check once added, and how requested changes are resolved); use squash merging as the default merge method.
- [ ] Validate the repository rules using a test pull request: PRs are required for changes to `main`, direct pushes are blocked, and the manual review procedure is documented. Checklist enforcement by automation is not part of the initial configuration.

## Solo-phase review policy and future transition

GitHub does not count an author's approval on their own PR toward the required approval rule. While you are the sole maintainer, require a PR for every change and configure zero native required approvals so you can merge your own PRs. Manually complete the self-review checklist on your PRs; review and submit an approval for PRs from other contributors. This procedure is not automatically enforced beyond the required-PR rule. When trusted collaborators are added, update the ruleset to require at least one independent approval; authors still complete the self-review checklist. Automating the author-sensitive policy is deferred to TE-021.

## Merge-method decision

**Decision: enable squash merging as the default.** It keeps `main` readable with one cohesive commit per reviewed PR while leaving the full discussion, review, and intermediate commits on the PR. Individual branch commits are collapsed on `main`.

The author-sensitive required status check is deferred to TE-021 to avoid extra setup during the solo phase. A PR template is a checklist for the human author; GitHub does not treat checked Markdown boxes as an approval. A future automated GitHub Actions workflow, GitHub App, or external CI check could report pass/fail based on the PR author and required evidence (the self-review checklist for owner PRs, or a submitted owner review for other PRs). Branch protection/rulesets could then require that check to pass.

## Completion evidence

- The repository is public, `main` is the default branch, and its protection/ruleset settings are documented.
- A PR is required for every update to `main`; direct pushes and bypasses are blocked.
- During the solo phase, the documented manual policy requires the owner to complete the self-review checklist on their own PRs and to review other contributors' PRs; native approving-review count is zero and policy automation is deferred.
- The root README points contributors to `CONTRIBUTING.md`, and the PR template records the author's self-review.
- A test PR confirms the solo-phase merge gates behave as documented.
- The future independent-review policy is documented, including the setting change to require one non-author approval when reviewers are added.

## GitHub references

- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Approving a pull request with required reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)
- [Helping others review your changes](https://docs.github.com/en/pull-requests/concepts/helping-others-review-your-changes)
- [Pull request merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
