# 1. Monorepo structure and package boundaries

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, skim it and do the exercise to test your architecture reasoning.

- [ ] I can explain what a monorepo is and when it may help a project.
- [ ] I can distinguish an application, a reusable package, and a workspace.
- [ ] I can explain why callers should use a package's public interface instead of importing private files.
- [ ] I can draw a dependency direction that keeps low-level contracts independent of user interfaces.
- [ ] I can name the costs of splitting code into more packages as well as the benefits.

## What you will learn

- What a monorepo is and why a project may choose one.
- How applications, reusable packages, and documentation differ.
- How package boundaries reduce accidental coupling while allowing coordinated changes.
- How to evaluate whether code belongs in a shared package or an application.

## Core ideas

A **monorepo** stores multiple related applications and libraries in one version-controlled repository. A **workspace** is the package-manager mechanism that lets packages in that repository depend on one another during development. A **package boundary** is the documented interface between components: callers should rely on that interface rather than reach into another package's private files.

Think of the repository as a workshop with several specialized workbenches. The runner, CLI, editor, and shared libraries can work near one another, but each bench should have clearly marked tools and handoff rules. Without boundaries, every bench starts borrowing loose parts from every other bench and changes become hard to predict.

Stagehand's accepted starting architecture uses an npm monorepo. Its initial workspaces are `apps/cli`, `apps/web`, and separate packages for the plan schema, plan engine, runner core, result model, and provisionally reporters. The Vue editor is the application in `apps/web`; there is no separate editor-components package. The runner core uses Playwright directly, keeping the initial design lean while Playwright is the only supported browser automation library. See [ADR-004](../../Planning/Backlog/decisions/ADR-004-initial-workspace-and-package-boundaries.md) and [TE-002](../../Planning/Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md).

## Concepts to understand

- **Dependency direction:** lower-level reusable code should not depend on user interfaces that depend on it. For example, a plan schema should not need to import the Vue editor.
- **Public API:** the supported exports and behaviour a package promises to consumers.
- **Internal implementation:** files consumers should not import directly because they may change without notice.
- **Workspace dependency:** a local package dependency managed as part of the same repository.
- **Change ownership:** a change crossing package boundaries should update callers, docs, and relevant fixtures in the same review.
- **Build and test scope:** CI can verify affected packages, but must still verify shared contracts and cross-package integration.
- **Lockstep versioning:** the reusable packages, CLI, and web editor share one Stagehand version. Before the first release candidate, breaking changes may increment the minor version while the major remains `0`; the usual major/minor/patch meanings apply from the first release candidate onward.

## Apply this to Stagehand

The initial workspace manifests and root lockfile now provide the repository scaffold. Source entry files, package `exports`, and checks of each public entry point are deliberately left for incremental package implementation. The design uses one documented public entry point per package at first; add named subpaths only when a concrete need appears. For each package, identify:

1. Its single primary responsibility.
2. The callers that need it.
3. Its public entry point and owned types/contracts.
4. Dependencies it is allowed to use.
5. What checks should run when it changes.

The agreed responsibilities and dependency directions are:

| Workspace | Responsibility and allowed dependencies |
|---|---|
| Plan schema | Owns plan structure and validation; works in Node.js and the browser; remains independent of applications, runner core, and Playwright. |
| Plan engine | Interprets valid plans and may depend on the plan schema; contains no execution logic. |
| Runner core | Owns execution; may depend on the plan engine and result model and uses Playwright directly. |
| Result model | Owns the common result contract; remains independent of applications, runner core, and Playwright. |
| Reporters | Provisionally separate; formats the common result model. |
| CLI | Owns command-line input/output, calls runner core, chooses and writes output, and composes a reporter. |
| Vue editor (`apps/web`) | Edits plans and may depend on the browser-compatible plan schema; it does not pull execution logic into the browser. |

JSON is the first supported output. The common result model is the input to formatting; later optional converters may generate formats such as JUnit XML or HTML. Keep shared contracts independent and avoid circular dependencies. Do not add structure just in case: refine these boundaries when implementation provides a concrete reason.

## Exercise

Review the [M1 component dependency graph](../../Planning/Diagrams/M1-component-dependency-graph.md). Draw the same dependencies from memory, then explain why the runner core can use Playwright directly, why the editor uses the schema without execution logic, and how the CLI routes the common result model to JSON. Write one sentence describing each workspace's responsibility and one example of a file that should remain private.

## You are ready when

- You can explain why Stagehand initially benefits from a monorepo and what evidence might justify splitting it later.
- Each initial workspace has a distinct responsibility and follows the allowed dependency directions in [TE-002](../../Planning/Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md).
- You can explain lockstep versioning and the pre-release-candidate rule for breaking changes.
- You can distinguish the existing workspace scaffolds from source entry files and public-entry checks that will be added with incremental implementation.
- You can explain how a schema change should be reviewed across editor, runner, examples, and CI.

## Read next

- [ADR-001 — Use a monorepo](../../Planning/Backlog/decisions/ADR-001-monorepo.md)
- [TE-002 — Reusable Node.js/TypeScript package structure](../../Planning/Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md)
- [ADR-004 — Initial workspace and package boundaries](../../Planning/Backlog/decisions/ADR-004-initial-workspace-and-package-boundaries.md)
- [M1 component dependency graph](../../Planning/Diagrams/M1-component-dependency-graph.md)

## Reinforcement quiz

Try to answer from memory, then open the answer key.

1. What makes a repository a monorepo?
2. What job does a package boundary do?
3. Should the plan-schema package depend on the Vue editor? Explain the dependency direction.
4. When should a caller rely on a public API rather than an internal file path?
5. What does the common result model provide, and what output does Stagehand support first?
6. Name one reason to share code in a package and one cost that another package adds.

<details>
<summary>Answer key</summary>

1. It stores multiple related applications and/or libraries in one version-controlled repository.
2. It defines an interface and ownership boundary so callers depend on supported behaviour instead of internal details.
3. No. The schema is a lower-level contract consumed by the editor; making it depend on the editor reverses the useful dependency direction and couples the contract to a UI.
4. When consuming another package's supported behaviour. Private implementation files may change without preserving compatibility.
5. It provides the shared structure for run results; JSON is the first output, with optional format converters left for later.
6. Sharing may avoid duplication and keep related changes coordinated. Another package adds build, dependency, API, testing, and maintenance overhead.

</details>
