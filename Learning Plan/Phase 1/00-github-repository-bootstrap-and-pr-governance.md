# 0. GitHub repository bootstrap and PR governance

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, this lesson will help; if all are checked, skim it and use the exercise to confirm your setup plan.

- [ ] I can explain the difference between a local Git repository, its GitHub remote, and the default branch.
- [ ] I know why I should start with an empty GitHub repository when I already have local commits.
- [ ] I can explain how a PR requirement, a branch ruleset, and a required status check differ.
- [ ] I can explain why Stagehand selected squash merging and what history trade-off it makes.
- [ ] I understand why my own PR approval does not count as independent approval and what the solo self-review can and cannot prove.
- [ ] I know how I would verify the effective rules on `main` rather than trusting that a planned setting is active.

## What you will learn

- How a local Git repository relates to a GitHub-hosted repository.
- Why an existing local history should usually be pushed to an empty remote instead of initializing a second history on GitHub.
- How default branches, pull requests, branch rulesets, and required status checks fit together.
- How GitHub's PR merge methods shape the history on `main`.
- How to use a manual self-review checklist while working alone without pretending it is an independent approval.
- How to test the merge policy and record what is actually configured.

This lesson prepares you for [Work Plan M0](../../Planning/Work%20Plan/M0-github-repository-bootstrap.md), which happens before the Phase 1 implementation milestones. GitHub's settings can change, so use the current documentation linked below when you do the setup.

## Core ideas

A **local repository** is the Git history on your machine. A **remote** is another copy hosted by a service such as GitHub. The remote's **default branch** is the branch GitHub treats as the normal base for new pull requests; Stagehand plans to use `main`.

A **pull request (PR)** is a proposed change from one branch into another. It gives the author a place to inspect the diff, explain the change, and run checks before merging. A **branch ruleset** applies repository rules to selected branches. For `main`, the intended policy is that changes arrive through PRs, force pushes are blocked, and bypasses do not quietly undo the rules.

A **required status check** is a named result GitHub waits for before allowing a PR to merge. The check can report whether automation passed; it cannot prove that a human paid attention. Think of it as the venue checking the ticket scanner is green, not checking whether the stage manager read the whole script.

GitHub supports three common PR merge methods. A **merge commit** preserves the branch commits and adds a merge point; **squash merge** combines the PR into one commit on `main`; **rebase merge** adds the PR's commits individually without a merge commit. Stagehand selected squash merging as the default: each PR becomes one cohesive commit on `main`, while the discussion and intermediate commits remain on the PR. The trade-off is that intermediate branch commits are not separate commits on `main`.

## The solo-review wrinkle

GitHub does not count a PR author's approval as an approval of their own PR. With only one maintainer, the planned approach is therefore:

1. Keep PRs required for changes to `main` and set native required approvals to zero during the solo phase so the owner can merge their own PR.
2. Manually complete the PR self-review checklist on owner-authored PRs. For a PR from another contributor, the repository owner manually reviews it before merging.
3. This manual procedure is not enforced by an author-sensitive automated status check. That automation is deferred to [TE-021](../../Planning/Backlog/technical-enablers/te-021-automated-pr-review-policy-check.md) to avoid setup overhead while there is one developer.
4. When trusted reviewers join, change the native rule to require at least one approval from someone other than the PR author. Keep the self-review checklist as a useful habit.

The checklist is a self-attestation. It is a speed bump that encourages a careful look at the diff, not a second pair of eyes and not proof of independent review. Later automation could inspect PR authorship, checklist completion, and submitted reviews, but it would need deliberate permission and event handling; that is future work, not a solo-phase setup requirement.

## Bootstrap order

When a local repository already has commits, create the GitHub repository empty: do not ask GitHub to generate another README, `.gitignore`, or licence commit. Push the existing branch to seed the remote, then set `main` as the default branch and configure the rules that apply to it. Otherwise, the two histories can start unrelated and Git will quite reasonably complain about the mess.

The first push is a bootstrap step because the remote does not yet have a `main` branch to protect. After that, configure the PR requirement, force-push/deletion rules, and bypass behaviour. An ordinary CI check may need to run once before GitHub can offer it by name in the ruleset. The author-sensitive review-policy check is deferred to TE-021, so it is not a prerequisite for the solo-phase setup.

Because this repository is intended to be public, review the exact files being published. The root `LICENSE` is MIT; public visibility and a licence are separate things. Keep secrets, private data, and machine-specific files out of the first push.

## Apply this to Stagehand

Use the milestone checklist in M0 as the source for the actual setup tasks. Before publishing, inspect the local repository and intended remote:

```powershell
git status --short --branch
git branch --show-current
git remote -v
git log -1 --oneline
```

Then work through the following sequence:

1. Confirm the local branch, working tree, repository URL, README, `.gitignore`, and MIT licence. Review staged and untracked files for anything private.
2. Create the public GitHub repository with the intended name and description. Leave initialization options unchecked when preserving existing local history.
3. Add or correct `origin` only after checking its URL, then push the intended branch once to seed the remote.
4. Set `main` as the default branch and configure a ruleset or branch protection rule. Check the rule's target, enforcement status, required PR setting, force-push/deletion behaviour, approval count, and bypass actors.
5. Enable squash merging as the default and document the history trade-off.
6. Add the contribution guide and PR template. Document that the owner manually self-reviews their own PRs and reviews outside contributions before merging.
7. Keep any ordinary CI checks required by the repository policy. Do not configure a required author-sensitive review-policy check during the solo phase; that automation is deferred to TE-021.
8. Test PR requirements, direct-push blocking, and bypass behaviour. Record evidence and any untested cases in M0's completion notes.

Do not write that a rule is active just because it appears in a plan or a settings screenshot. Verify the effective rule on `main` and the behaviour of a real PR. Repository settings may also be affected by other rules, permissions, or account-plan limitations, so inspect the result GitHub actually enforces.

## Exercise

Before changing repository settings, make a one-page setup worksheet with:

- The repository owner/name, public visibility, description, and local remote URL.
- The default branch and the branch pattern the ruleset will target.
- Squash merging as the selected default and why it fits the desired `main` history.
- The rules required during the solo phase and who can bypass them.
- What the owner self-review checklist checks, and what it cannot establish.
- What is handled manually during the solo phase and what author-sensitive review automation is deferred to TE-021.
- The test PRs that will demonstrate each expected pass or block.
- The setting change required when an independent reviewer is added.

After setup, fill the worksheet with observed values and links to evidence. Mark anything you could not test as open rather than giving it a hopeful green check.

## You are ready when

- You can explain the difference between a local Git history, its GitHub remote, the default branch, a PR, a ruleset, and a required status check.
- You can explain why the initial push precedes protection of `main` when the remote starts empty.
- You understand that the solo self-review is useful but does not provide independent approval.
- You can find and inspect the effective branch rules and identify bypass behaviour.
- You can explain the selected PR merge method and the history trade-off it makes.
- You can describe the solo manual review process, the future independent-review rule, and the deferred automation without treating a checkbox as GitHub-enforced approval.
- You record observed configuration separately from intended configuration.

## Read next

- [Work Plan M0 — GitHub repository bootstrap and PR governance](../../Planning/Work%20Plan/M0-github-repository-bootstrap.md)
- [GitHub rulesets: available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Create a repository ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Approving a pull request with required reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)
- [Pull request merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
- [Add local code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)

## Reinforcement quiz

Try these without looking back, then open the answer key to check your reasoning.

1. What is the difference between the local repository and the GitHub remote?
2. You already have local commits and files. Why is creating an empty remote usually the clean bootstrap choice?
3. Why can't your approval satisfy GitHub's required-review rule on your own PR?
4. What does a required status check prove, and what does a self-review checkbox prove?
5. What does squash merging do to the PR's commits on `main`, and what is one trade-off?
6. Which parts of the solo review process are manual, and what does TE-021 add later?
7. Name two pieces of evidence you would record after testing the merge policy.

<details>
<summary>Answer key</summary>

1. The local repository is the Git history on your machine; the remote is its hosted counterpart on GitHub.
2. Initializing README/licence files on GitHub can create a separate history from the existing local one. An empty remote lets you push the existing history cleanly.
3. GitHub does not count the PR author's approval as approval of their own PR. The solo policy uses zero native required approvals, requires PRs, and follows the manual self-review checklist.
4. A passing status check proves that the automation reported success under its logic. A checkbox records the author's self-attestation. Neither proves the author carefully understood every line.
5. It combines all commits from the PR into one commit on the target branch. Intermediate commits are not preserved separately on `main`.
6. The owner self-reviews their own PR by completing the checklist and manually reviews other contributors' PRs. TE-021 may later automate these checks and make them required in the branch ruleset.
7. Examples include the effective ruleset settings/link and test PR links/results for owner PRs, outside-author PRs, direct pushes, or bypass behaviour. Mark untested cases as open.

</details>
