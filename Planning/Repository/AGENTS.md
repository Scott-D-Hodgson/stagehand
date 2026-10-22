# Repository documentation guidance

Keep `README.md` as a readable guide to important current and proposed folders, and `structure.md` as the fuller proposed footprint.

- Clearly distinguish existing paths from future/proposed paths. The current root includes `Planning/` and `Learning Plan/`; application folders such as `apps/`, `packages/`, `examples/`, and `tools/` are proposed unless they appear in the actual checkout.
- When the repository layout changes, update both the map and affected root documentation links. Do not preserve obsolete paths merely because they appeared in an earlier proposal.
- Keep the map descriptive, not a commitment that every proposed component will be built. Mark optional/later candidates as such.
- In repository documentation, refer only to paths explicitly designated as publishable project materials.
- Verify Markdown relative links from the file that contains them.
- Make every ADR and technical-enabler identifier mentioned in the repository map a clickable relative Markdown link to its source document.
