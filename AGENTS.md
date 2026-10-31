# Guidance for AI agents

## Project context

Stagehand is a planned, local-first browser end-to-end testing toolkit. The intended product includes versioned JSON test plans, a Node.js/Playwright runner and CLI, and a Vue web editor. The editor is intended to work locally without a Stagehand account or central plan service. The repository contains planning and learning material, npm workspace scaffolds, initial plan/case schemas with runtime validation, a Node-side plan-file loader, a validated result model, and a Playwright browser lifecycle, case-session locator resolution, ordered wait-list execution, absolute HTTP/HTTPS navigation, direct clicks, sequential typing, direct field filling, option selection, and exact locale-aware `assertText` and `assertHtml` on case sessions in runner-core. Runner-core dispatches `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, and `assertHtml` case steps. Focused `assertText` tests passed as part of the earlier 54-test runner-core suite; `assertHtml` tests and verification are pending. Other assertion handlers, result aggregation, the CLI, and editor behaviour are not implemented. Never describe planned behaviour as shipped or verified.

The current root includes `Planning/`, `Learning Plan/`, `apps/`, and `packages/`. New implementation code should use TypeScript by default. Keep JSON Schema documents and synthetic examples as JSON data. The `plan-schema` package contains shared document validation, reference matching, parsed-bundle checks, and absolute HTTP/HTTPS navigation URL validation; the `plan-engine` package loads and validates plan and referenced case files, checks that resolved case files stay within the plan folder, and calculates the `sha256-v1` fingerprint from their raw contents. The `result-model` package contains the initial versioned result JSON Schema, a synthetic example, TypeScript result types, and a runtime schema validator. It validates document shape and registered formats; it does not compute source fingerprints or enforce execution aggregation policy. The `runner-core` package starts Chromium, manages per-case browser contexts and pages, resolves case-session locators, runs ordered wait lists, navigates to absolute HTTP/HTTPS URLs, performs direct clicks, sequential typing, direct field filling, option selection, and exact locale-aware `assertText` and `assertHtml` checks, and dispatches validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, and `assertHtml` case steps in order. `assertHtml` implementation is present, but its focused tests and runner-core suite verification are pending. Other assertion handlers, result aggregation, and complete plan loading/execution remain future work. CLI and editor behaviour are unimplemented. `apps/cli/`, `apps/web/`, and `packages/reporters/` remain scaffolds. Other folders shown in `Planning/Repository/structure.md` remain proposed. Keep actual scaffolds and proposed structure clearly distinguished.

## Project history and working assumptions

- The repository is public, and the intended workflow is that changes reach `main` through pull requests. The owner currently works alone and wants a deliberate self-review. GitHub does not count the author's own approval as independent review. During the solo phase, use a manual self-review checklist and configure no native required approvals so the owner can merge their PRs. The owner manually reviews contributor PRs; require independent approval when other reviewers join. Automated review-policy enforcement is deferred to [TE-021](Planning/Backlog/technical-enablers/te-021-automated-pr-review-policy-check.md).
- The intended merge-method convention is merge commits for owner-authored PRs, preserving the owner's individual commits in `main`, and squash merges for PRs from other contributors, grouping their incremental commits. M0 enabled both methods. GitHub does not automatically select a method by author, so describe this as a human convention, not an enforced setting. Keep PRs and review as the intended merge path.
- The root `LICENSE` is MIT. Do not change the licence or its copyright attribution casually.
- Linux runner support follows the MVP; Windows is the initial runner focus. During development, prefer designs that work on both Windows and Linux when practical, so the later Linux expansion does not require avoidable rewrites.
- Markdown is the canonical format for current planning and learning material.
- Use Canadian English spelling in repository documentation (for example, `colour`, `behaviour`, `licence`, and `analyse`). Preserve exact spellings in code, file paths, product names, and official titles where changing them would alter the identifier or source name.
- Keep `Planning/acronyms.md` and `Learning Plan/acronyms.md` aligned with the acronyms used in their respective document sets. Group stable identifier families rather than listing every numbered ID separately; do not invent expansions for project prefixes that have none.
- Product backlog, roadmap, and work plan are distinct: the backlog captures candidate requirements and decisions; the roadmap sequences work at a high level; the work plan breaks Phase 1 into milestones with deliverables and approximate human effort.
- Security documentation is a planned assessment aid, not proof of compliance. See `Planning/Security/AGENTS.md` for its source and status rules.

## Editing guidance

- Read nearby README and related planning documents before editing. Preserve stable identifiers, cross-links, and established terminology.
- Treat unresolved product choices as unresolved. Make a recommendation only when asked or when needed to make a useful draft, and label it as a suggestion for review.
- Separate completed actions, current facts, proposed design, assumptions, and recommendations. Do not invent repository configuration, test results, implementation behaviour, or user decisions.
- Prefer clear Markdown, descriptive links, and concise language. Keep links valid relative to their containing file after moving or renaming content.
- Do not put blank lines inside function bodies. Blank lines between functions and other top-level declarations are fine.
- Use `async`/`await` as the standard style for asynchronous control flow and cleanup. Prefer `try`/`catch`/`finally` around `await` over direct `.then()`, `.catch()`, or `.finally()` chains. Use explicit Promise composition or coordination only when needed for concurrent work; keep `Promise<T>` types and APIs that return promises where appropriate.
- Whenever a planning or learning document refers to an ADR or technical enabler by identifier, make the identifier a clickable Markdown link to that document. Apply this in prose, lists, tables, and repeated mentions; leave an identifier unlinked only when no corresponding document exists, and flag that case for review.
- In repository-level documentation, maps, and indexes, refer only to paths explicitly designated as publishable project materials.
- Do not add cross-references from publishable project documentation to material outside the designated project documentation set.
- Do not add credentials, real secrets, private customer data, or sensitive test data. Use synthetic examples.
- When working in this repository, keep agent activity within the project directory. Access other directories or system files only when the task requires it and the user authorizes it; repository guidance cannot technically enforce this boundary.

## Verification

For documentation changes, inspect the diff and check affected relative links and references. For code changes, use the repository's documented checks once they exist; do not imply a check ran unless it did. Update status and evidence when work moves from proposed to implemented or verified.

## Closing review

When the owner asks to **"Perform closing review"**, treat that phrase as a request to complete this documentation close-out:

1. Identify the current PR/base branch when available and review every changed Markdown file in the working tree and branch. Check decisions, statuses, scope, Canadian spelling, cross-references, and whether the Learning Plan reflects accepted planning changes without presenting proposed behaviour as implemented.
2. Make clear, supported corrections directly. Keep unresolved decisions open and report them as questions; do not block independent review work while waiting for answers.
3. Update the ignored personal `Obsidian-todo.md` only when completed or newly agreed work changes its guidance. Keep it out of the PR.
4. Refresh the ignored `Obsidian-review.md` to include links to only the Markdown files changed for this PR. Under each file link, include the changed section or exact diff hunk so the owner can find and review the edits in Obsidian.
5. Check Markdown relative links and ADR/technical-enabler links, inspect the final diff, and run `git diff --check`. Do not run tests unless the owner asks for them.
6. Summarize corrections, unresolved decisions, and verification performed. Do not commit or publish unless explicitly requested.

If the PR base cannot be identified locally, use the changed Markdown files relative to `HEAD` and say that the review scope was limited to the current diff.
