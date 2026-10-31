# Proposed monorepo footprint

This file records Stagehand's proposed repository layout and distinguishes it from the current implementation. The root npm workspace, shared TypeScript configuration, dev container, and application/package workspaces exist. The plan-schema workspace contains the plan/case schemas and shared validation, including absolute HTTP/HTTPS navigation URL checks; the plan-engine workspace loads plan files and referenced case files, checks that resolved files stay in the plan folder, validates parsed bundles, and computes a source fingerprint from the raw inputs. The result-model workspace contains the normative result v1 JSON Schema, TypeScript types, a runtime validator, tests, and a synthetic example. The runner-core workspace starts Playwright-managed Chromium, manages per-case contexts and pages, resolves case locators, runs ordered wait lists, navigates case sessions to absolute HTTP/HTTPS URLs, performs direct clicks and character typing, and initially dispatches validated `navigate`, `click`, and `type` steps. Type-step tests are included in the suite, and all 37 runner-core tests passed; other action handlers, assertions, result production, and full plan integration remain future work.

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
│   ├── runner-core/          # Chromium lifecycle, per-case sessions, locator resolution, waits, navigation, clicks, and initial step dispatch
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src/index.ts
│   │   ├── test/browser-run.test.js
│   │   ├── test/locator-resolution.test.js
│   │   ├── test/wait-list.test.js
│   │   ├── test/navigate.test.js
│   │   ├── test/click.test.js
│   │   ├── test/step-execution.test.js # public-entry dispatcher coverage
│   │   └── tsconfig.json
│   ├── plan-schema/          # plan/case schemas, validators, reference matcher, and parsed-bundle checks
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
│   ├── plan-engine/          # Node plan/case loader and source fingerprint; no step execution
│   │   ├── src/index.ts
│   │   ├── test/load-plan.test.js
│   │   └── tsconfig.json
│   ├── result-model/         # result v1 schema, types, validator, and tests
│   │   ├── src/index.ts
│   │   ├── src/result-v1.schema.json
│   │   ├── examples/checkout-result.json
│   │   ├── test/validation.test.js
│   │   └── tsconfig.json
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
