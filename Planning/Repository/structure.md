# Proposed monorepo footprint

This file records Stagehand's proposed repository layout and distinguishes it from the current implementation. The root npm workspace, shared TypeScript configuration, dev container, and application/package workspaces exist. The plan-schema workspace contains initial plan and case schema definitions plus synchronous JSON Schema validation helpers; semantic checks and the other future paths shown here remain proposals.

```text
stagehand/
├── AGENTS.md
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── package.json
├── package-lock.json
├── tsconfig.base.json       # shared strict TypeScript compiler settings
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
│   ├── cli/                 # CLI app; npm workspace scaffold
│   ├── web/                 # Vue editor app; npm workspace package
│   ├── api/                 # optional/later
│   └── desktop/             # Electron, later
├── packages/
│   ├── runner-core/          # npm workspace scaffold
│   ├── plan-schema/          # initial plan/case schemas and synchronous schema validators
│   │   ├── src/
│   │   │   ├── index.ts      # single public entry point
│   │   │   ├── plan-v1.schema.json
│   │   │   └── case-v1.schema.json
│   │   ├── examples/
│   │   │   ├── checkout-plan.json
│   │   │   └── cases/sign-in.json
│   │   ├── test/
│   │   │   └── validation.test.js
│   │   └── tsconfig.json
│   ├── plan-engine/          # npm workspace scaffold
│   ├── result-model/         # npm workspace scaffold
│   └── reporters/            # provisional npm workspace scaffold
├── examples/
│   └── test-plans/
├── docs/
├── website/
├── tests/
└── tools/
```

The backlog in this archive is a requirements draft. Review before treating priorities, release labels, and dependencies as committed.

For M1, npm is the selected workspace/package manager. The reusable packages are the plan schema, plan engine, runner core, result model, and provisionally reporters. The Vue editor is the `apps/web` application and an npm workspace package; a separate editor-components library is not planned unless a concrete reuse need appears. The plan schema should work in both Node.js and the browser, and each package should start with one documented public entry point. Shared contracts remain independent of applications, runner core, and Playwright. The CLI owns command-line input/output and calls the runner core; reporters format results selected by the CLI. Start with a lean design and add complexity when implementation demonstrates a need. [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md) records the initial package responsibilities, allowed dependency directions, and lockstep versioning direction for packages and applications. Before the first release candidate, breaking changes may increment the minor number while the major number remains `0`; normal major/minor/patch meanings apply from the first release candidate onward.
