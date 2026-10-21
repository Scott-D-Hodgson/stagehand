# M0 - GitHub repository bootstrap and PR governance

**Estimate:** 1-3 person-days  
**Depends on:** none  
**Purpose:** establish the repository and merge controls before Phase 1 implementation begins.

> **Current execution status:** M0 is complete. The public GitHub repository has been created, `main` is its default branch, the ruleset is configured, the contribution guide and PR template are in place, repository rules have been tested with a PR, and the repository owner confirmed that merge commits and squash merging are enabled while rebase merging is disabled. Keep this as a greenfield bootstrap guide for reuse, rather than rewriting the procedure around the existing remote.
>
## Tasks

- [x] Create the public GitHub repository and set `main` as the default branch.
- [x] Create and configure an **Active** branch ruleset named `Protect main`, targeting the `main` branch with an empty bypass list. Require pull requests before merging, set required approvals to zero during the solo phase, require conversation resolution, restrict deletions, and block force pushes. Do not require linear history, because owner-authored PRs are intended to use merge commits.
- [x] Confirm the repository-level pull request merge settings allow merge commits and squash merging, with rebase merging disabled. The project convention is to choose a method per PR; this setting is separate from the branch ruleset.
- [x] Add `.github/pull_request_template.md` with an author self-review checklist (read the full diff, check for accidental changes, and confirm relevant checks ran); ask the author to complete it before merging. GitHub will use it for new PRs after the file reaches the default branch.
- [x] Create `CONTRIBUTING.md` with the solo self-review steps, manual review procedure for contributor PRs, requested-change handling, future transition to independent approval, and per-author merge convention. Add a brief root README "Contributing" section that links to it. Required status-check automation for the manual review policy is deferred to [TE-021](../Backlog/technical-enablers/te-021-automated-pr-review-policy-check.md).
- [x] Validate the repository rules using a test pull request: PRs are required for changes to `main`, direct pushes are blocked, and the manual review procedure is documented. Checklist enforcement by automation is not part of the initial configuration.

## Solo-phase review policy and future transition

GitHub does not count an author's approval on their own PR toward the required approval rule. While you are the sole maintainer, require a PR for every change and configure zero native required approvals so you can merge your own PRs. Manually complete the self-review checklist on your PRs; review and submit an approval for PRs from other contributors. This procedure is not automatically enforced beyond the required-PR rule. When trusted collaborators are added, update the ruleset to require at least one independent approval; authors still complete the self-review checklist. Automating the author-sensitive policy is deferred to TE-021.

## Merge-method decision

**Decision: enable merge commits and squash merging, and choose the method per PR.** The intended practice is to merge the owner's own PRs with merge commits so their individual commits remain visible in `main`'s history. PRs from other contributors will generally be squash-merged, keeping `main` focused on one cohesive commit per reviewed contribution while the PR retains its discussion and incremental commits. This is a documented human convention; GitHub's merge-method settings enable methods repository-wide and do not automatically select a method based on who authored a PR. Rebase merging is disabled and is not part of the planned workflow.

The author-sensitive required status check is deferred to TE-021 to avoid extra setup during the solo phase. A PR template is a checklist for the human author; GitHub does not treat checked Markdown boxes as an approval. A future automated GitHub Actions workflow, GitHub App, or external CI check could report pass/fail based on the PR author and required evidence (the self-review checklist for owner PRs, or a submitted owner review for other PRs). Branch protection/rulesets could then require that check to pass.

## Initial ruleset settings recommendation

Use a repository branch ruleset as the primary setup path. GitHub still supports classic branch protection rules, but rulesets are the newer management option and make active rules visible to people with repository read access. Avoid overlapping a classic rule with this ruleset unless there is a specific reason; overlapping rules can compound.

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

## Completion evidence

- The repository is public, `main` is the default branch, and its protection/ruleset settings are documented.
- A PR is required for every update to `main`; the ruleset is active and has no explicitly configured bypass actors.
- An active `Protect main` ruleset targets `main`, has an empty bypass list, and uses the initial settings documented above.
- During the solo phase, the documented manual policy requires the owner to complete the self-review checklist on their own PRs and to review other contributors' PRs; native approving-review count is zero and policy automation is deferred.
- The root README points contributors to `CONTRIBUTING.md`, and the PR template records the author's self-review.
- Repository settings allow merge commits and squash merges, with rebase merging disabled; the per-PR convention is documented and understood.
- A test PR confirms the solo-phase merge gates behave as documented.
- The future independent-review policy is documented, including the setting change to require one non-author approval when reviewers are added.

## GitHub references

- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Approving a pull request with required reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)
- [Helping others review your changes](https://docs.github.com/en/pull-requests/concepts/helping-others-review-your-changes)
- [Configuring commit merging for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-merging-for-pull-requests)
- [Configuring commit squashing for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)
- [Pull request merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
