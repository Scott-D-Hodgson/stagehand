# TE-021 — Automate the PR review policy check

**Status:** Later candidate  
**Priority:** Later

## Intent

When additional developers are regularly contributing, consider automating the author-sensitive PR review policy currently handled manually during the solo phase.

## Possible behaviour

- For owner-authored PRs, require the self-review checklist to be complete.
- For PRs authored by other contributors, require an approving review from the repository owner or an eligible maintainer.
- Publish a clear pass/fail status that can be required by the `main` branch ruleset.
- Document token permissions, event triggers, stale-review behaviour, and how the check handles edited PR descriptions or changed commits.

## Constraints

- This automation is deferred to avoid setup and maintenance overhead while the project has one developer.
- The current solo-phase procedure is manual; the PR requirement and mixed merge-method convention (merge commits for owner-authored PRs, squash merges for outside contributions) remain in M0.
- The check must not claim that a self-attestation is an independent review.

## Dependencies

- M0 repository bootstrap and PR governance
- Additional contributors or a demonstrated need for automated enforcement
