# Learning Plan guidance

These lessons prepare the owner for M0 and Roadmap Phases 1–4. Keep milestone lessons in the matching phase folder; the M0 lesson is grouped with Phase 1 in `Phase 1/`. Teach concepts needed to make and review the work, not just steps to copy.

- Treat each phase and package learning folder as a short course. Its README should explain what the learner will learn, help them decide whether they need the course, list prerequisites, order the lessons, and link to a final skill-testing quiz.
- Keep each folder's learning sequence aligned with its README and the roadmap/work plan. The root README indexes all phases; each phase README orders the lessons needed for its planned outcomes.
- Explain terminology in plain language, then connect it to Stagehand's proposed architecture. Use small examples and metaphors when they make abstract ideas easier to grasp.
- Distinguish general technical facts from Stagehand decisions that remain open. Do not teach a proposed design as though it is already implemented or final.
- Give each lesson one subject and one central question. Put the question immediately after the title as a Markdown blockquote attributed to a unique fictional developer; use a memorable topic-related nickname where it fits. Do not add a `Central question` heading.
- Keep writing at a layperson's level. Briefly explain necessary technical names, and use small examples, metaphors, or Mermaid diagrams when they materially clarify the idea.
- Include a practical exercise and observable readiness criteria in each lesson. Use one final course quiz with an answer key instead of repeating a quiz in every lesson. Link to authoritative external references when a new or evolving concept needs them.
- Keep lessons self-contained enough to be useful, while linking related lessons and planning decisions rather than duplicating them.
- Use Canadian English spelling, including in headings and quizzes. Update the root `acronyms.md` when lessons introduce abbreviations; do not invent an expansion for identifiers whose prefix has no defined phrase.
- Keep the M0/Phase 1 to Phase 4 structure and links aligned with the root index and the phase README files.
- Keep package-specific learning guides under `Packages/<package-name>/`, indexed from `Packages/README.md` and the root Learning Plan README. Focus each guide on the current implementation and learning within that package; link to phase lessons for broader concepts instead of duplicating them.
- Make every ADR and technical-enabler identifier mentioned in a lesson or quiz a clickable relative Markdown link to its Planning source document, including repeated mentions.
- The Learning Plan is generated from the AI-guided Planning materials. Treat the planning documents as the current source for Stagehand decisions and keep open questions labelled as open.
