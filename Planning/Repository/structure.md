# Proposed monorepo footprint

This file records Stagehand's proposed repository layout and distinguishes it from the current implementation. The root npm workspace, shared TypeScript configuration, dev container, and application/package workspaces exist. Plan-schema validates plans/cases, selects named data sets, and expands/prepares one-level shared steps with caller/inner-step identity. Runner-core dispatches those prepared shared steps at its case-session boundary and keeps that identity on preparation, hard-step, and soft-assertion failures. Full plan orchestration has not moved preflight ahead of browser startup, and result production remains future work. Plan-engine loads plans and referenced cases, enforces filesystem containment, validates parsed bundles, and calculates a source fingerprint. Result-model provides a normative v1 result schema, types, runtime validation, tests, and an example. Runner-core also provides Playwright Chromium lifecycle, isolated case contexts/pages, locators, waits, actions, assertions, and accessibility scan/collection. The earlier development-container runner-core command passed 137 mocked-browser tests; updated shared-step execution verification is pending. Mocked checks do not establish real-browser accessibility behaviour, which remains outstanding.

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
│   ├── runner-core/          # browser lifecycle, actions/assertions, waits, dispatch, and accessibility modules
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts       # explicit public exports
│   │   │   ├── defaults.ts
│   │   │   ├── locators.ts
│   │   │   ├── waits.ts
│   │   │   ├── assertions.ts
│   │   │   ├── browser/
│   │   │   │   ├── types.ts
│   │   │   │   ├── run.ts
│   │   │   │   └── case-session.ts
│   │   │   ├── actions/
│   │   │   │   ├── navigation.ts
│   │   │   │   └── interactions/
│   │   │   │       ├── click.ts
│   │   │   │       ├── type.ts
│   │   │   │       ├── fill.ts
│   │   │   │       └── select-option.ts
│   │   │   ├── steps/
│   │   │   │   ├── types.ts
│   │   │   │   └── execute.ts
│   │   │   └── accessibility/
│   │   │       ├── types.ts
│   │   │       ├── settings.ts
│   │   │       ├── scan.ts
│   │   │       ├── mapping.ts
│   │   │       └── collection.ts
│   │   ├── test/browser-run.test.js
│   │   ├── test/locator-resolution.test.js
│   │   ├── test/wait-list.test.js
│   │   ├── test/navigate.test.js
│   │   ├── test/click.test.js
│   │   ├── test/step-execution.test.js # public-entry dispatcher coverage
│   │   ├── test/accessibility-settings.test.js
│   │   ├── test/accessibility-scan.test.js
│   │   ├── test/accessibility-mapping.test.js
│   │   ├── test/accessibility-collection.test.js
│   │   ├── test/accessibility-execution.test.js
│   │   └── tsconfig.json
│   ├── plan-schema/          # plan/case schemas, validators, reference matcher, and parsed-bundle checks
│   │   ├── src/
│   │   │   ├── index.ts      # single public entry point
│   │   │   ├── json.ts       # shared JSON object and JSON Pointer helpers
│   │   │   ├── plan-v1.schema.json
│   │   │   ├── case-v1.schema.json
│   │   │   ├── validation/  # schema, semantic, and bundle validation
│   │   │   ├── references/  # case-reference matching and result types
│   │   │   └── variables/   # variable resolution and case preparation
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
