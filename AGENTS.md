# Guidance for AI agents

## Project context

Stagehand is a planned, local-first browser end-to-end testing toolkit. The intended product includes versioned JSON test plans, a Node.js/Playwright runner and CLI, and a Vue web editor. The editor is intended to work locally without a Stagehand account or central plan service. These are proposed capabilities: the repository currently contains planning and learning material, not the implemented runner or editor. Never describe planned behaviour as shipped or verified.

The current root folders include `Planning/` and `Learning Plan/`. The application folders in `Planning/Repository/structure.md` are a proposed future layout. Keep actual structure and proposed structure clearly distinguished.

## Project history and working assumptions

- The repository is public, and the intended workflow is that changes reach `main` through pull requests. The owner currently works alone and wants a deliberate self-review. GitHub does not count the author's own approval as independent review. During the solo phase, use a manual self-review checklist and configure no native required approvals so the owner can merge their PRs. The owner manually reviews contributor PRs; require independent approval when other reviewers join. Automated review-policy enforcement is deferred to TE-021. GitHub settings have not been verified as active.
- Squash merging is the selected default. Keep PRs and review as the intended merge path, but distinguish the documented policy from settings that have actually been checked on GitHub.
- The root `LICENSE` is MIT. Do not change the licence or its copyright attribution casually.
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
- In repository-level documentation, maps, and indexes, refer only to paths explicitly designated as publishable project materials.
- Do not add cross-references from publishable project documentation to material outside the designated project documentation set.
- Do not add credentials, real secrets, private customer data, or sensitive test data. Use synthetic examples.

## Verification

For documentation changes, inspect the diff and check affected relative links and references. For code changes, use the repository's documented checks once they exist; do not imply a check ran unless it did. Update status and evidence when work moves from proposed to implemented or verified.
