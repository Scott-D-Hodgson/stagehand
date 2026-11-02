# Package-course learning guidance

The folders below `Learning Plan/Packages/` are short courses for learning and reviewing Stagehand packages. Follow the parent [`Learning Plan` guidance](../AGENTS.md) as well as these package-specific rules.

## Course structure

Do not turn a package course into one long `README.md`. Organize each course as:

```text
<package-name>/
├── README.md
├── Lessons/
│   ├── 01-<topic>.md
│   └── 02-<topic>.md
└── quiz.md
```

- Use `README.md` as the course overview. Include an **In this course you will learn** summary, a **Do I need this course?** checklist, any prerequisites, the ordered lesson links, the current implementation boundary, and a link to the final quiz.
- Put one coherent learning topic in each numbered file under `Lessons/`. Keep the sequence intentional so a learner can work through it without already knowing later concepts.
- Begin every lesson with one plain-language question formatted as a Markdown blockquote, followed by an attribution to a fictional developer. Do not add a generic “Central question” heading. Give every developer a unique name across the package courses; a playful topic-related nickname and gentle alliteration are encouraged. For example: `> “How does Stagehand decide whether one document is valid?” — Valerie “Validation Voyager” Vaughn, Developer`. Use the question to control the lesson's scope: explanations, examples, diagrams, exercises, and readiness criteria should all help answer it. Move a second substantial question into its own lesson instead of growing the page around multiple subjects.
- Give each lesson a plain-language explanation, a connection to the current Stagehand implementation, a small practical exercise, and observable readiness criteria.
- End the course with `quiz.md`. Make it a cumulative skill check with an answer key. Test whether the learner can explain, trace, review, and safely change the package; avoid trivia and simple copying questions. For package courses, this final skill check replaces a repeated reinforcement quiz in every lesson.
- Keep the package's implementation README as the technical reference. Link to it instead of duplicating its full API documentation in the course.

## Writing for the learner

- Write for someone learning the package, not for someone who already knows its specialist vocabulary. Prefer ordinary words and short, direct explanations.
- When an accurate technical term is necessary, introduce the plain-language idea first, then give the term and explain why it matters. For example: “A rule that checks the shape of JSON is called a JSON Schema.” Do not leave jargon unexplained.
- Use examples to make behaviour concrete. Keep examples small, synthetic, and connected to a question the learner is likely to ask.
- Use a metaphor when it genuinely makes an abstract idea easier to understand. Explain where the comparison fits and where it stops fitting so the metaphor does not become a false rule.
- Use a Mermaid diagram when relationships, ownership, sequence, or data flow would be materially harder to understand in prose. Keep diagrams small, label implemented and future pieces clearly, and follow each diagram with a short prose explanation so the lesson does not depend on the visual alone.
- Do not add a diagram, metaphor, or formal definition merely for decoration. The learner should be able to say what it clarified.

## Accuracy and maintenance

- Teach current behaviour as current, planned behaviour as planned, and historical verification as historical. Never turn a proposal or an old test count into a current implementation claim.
- Keep each lesson focused on the package. Link to phase lessons for wider architecture, milestone, or product-policy material.
- Preserve working relative links when splitting or moving material. Update `Packages/README.md` and the root Learning Plan index when a course entry point changes.
- Use Canadian English and the repository's established names exactly. Make every mentioned ADR and technical-enabler identifier a clickable link to its Planning document.
- When implementation changes, update the affected lesson, course overview, final quiz, and answer key together. A learner should not be tested on wording or behaviour the lessons no longer teach.
