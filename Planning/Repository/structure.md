# Proposed monorepo footprint

This file is a starting point for Stagehand's repository layout discussed during planning. It is not a fully implemented application.

```text
stagehand/
├── AGENTS.md
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
├── Planning/
│   ├── Backlog/
│   │   ├── README.md
│   │   ├── product-vision.md
│   │   ├── release-plan.md
│   │   ├── story-index.md
│   │   ├── epics/
│   │   ├── technical-enablers/
│   │   ├── cross-cutting/
│   │   ├── decisions/
│   │   └── templates/
│   ├── Roadmap/
│   ├── Security/
│   └── Work Plan/
├── Learning Plan/
├── apps/
│   ├── cli/
│   ├── web/
│   ├── api/                 # optional/later
│   └── desktop/             # Electron, later
├── packages/
│   ├── runner-core/
│   ├── runner-playwright/
│   ├── plan-schema/
│   ├── plan-engine/
│   ├── result-model/
│   ├── reporters/
│   └── editor-components/
├── examples/
│   └── test-plans/
├── docs/
├── website/
├── tests/
└── tools/
```

The backlog in this archive is a requirements draft. Review before treating priorities, release labels, and dependencies as committed.
