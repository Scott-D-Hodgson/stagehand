# ADR-004 — Initial workspace and package boundaries

**Status:** Accepted

## Context

Stagehand is beginning implementation from planning material. The CLI, Vue editor, shared contracts, execution logic, and reporting need clear initial workspace boundaries. The design should support incremental implementation and stay lean while package responsibilities become concrete.

## Decision

- Use npm workspaces in the monorepo, with a root manifest and one root lockfile.
- Keep the CLI and Vue editor as application workspaces under `apps/cli` and `apps/web`. The web editor is the Vue application; a separate editor-components library is not part of the initial structure.
- Use separate reusable workspaces for the plan schema, plan engine, runner core, result model, and provisionally reporters. Reconsider a separate reporters workspace only if implementation shows it is unnecessary.
- The plan schema owns plan structure and validation and must work in Node.js and the browser. The plan engine interprets valid plans without bringing execution logic into the schema.
- The runner core owns execution and uses Playwright directly. The CLI owns command-line input/output, calls the runner core, selects the output, and writes it.
- The result model is the common result contract. Reporters format it into the output selected by the CLI; JSON is the initial format.
- Keep shared contracts independent of applications, runner core, and Playwright. Use one documented public entry point per package initially and avoid circular dependencies.
- Start with workspace manifests and planning notes. Add source entry files, `exports` declarations, and public-entry checks incrementally with each package's implementation.
- Version packages and applications in lockstep. Keep the product pre-1.0 until the first release candidate; before then, breaking changes may increment the minor number while the major remains `0`. See [TE-002](../technical-enablers/te-002-reusable-node.js-typescript-package-structure.md) for the versioning convention and detailed dependency rules.

The proposed repository footprint and the current scaffold are recorded in [the repository structure](../../Repository/structure.md). This ADR records the intended architecture; it does not claim that application behaviour has been implemented.

## Alternatives considered

### Put editor components in a separate reusable package

This would create another boundary before a concrete need for shared editor components exists. Keep the Vue editor in `apps/web` and add a library later if reuse warrants it.

### Use a separate browser-only schema package

This would duplicate or wrap the shared plan contract. Start with one schema package that works in both Node.js and the browser; revisit only if implementation reveals a concrete obstacle.

### Version each package and application independently

Independent versions would add release coordination overhead while Stagehand is developed as one product. Use lockstep versions initially and revisit if independent releases become necessary.

## Consequences

- The initial workspace layout is testable by npm without implementing the runner, editor, or reporters.
- Package responsibilities and allowed dependencies are documented in [TE-002](../technical-enablers/te-002-reusable-node.js-typescript-package-structure.md) and can be refined when implementation provides evidence for a change.
- Add source entry files, package `exports`, and public-entry checks incrementally with each package implementation. The plan-schema package now has its TypeScript entry point, `exports` declaration, and build target; runtime validation and its public-entry check remain future work.
- Reporters remain a provisional separate workspace.
