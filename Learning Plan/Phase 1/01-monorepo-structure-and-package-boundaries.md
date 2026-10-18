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

Stagehand's proposed components include a Node.js/TypeScript runner, a Playwright adapter, a CLI, a Vue editor, schemas, result/reporting code, and documentation. Shared contracts may change alongside the tools that consume them, which is the main reason the proposed architecture starts in one repository. The monorepo decision is proposed and can be revisited if ownership or release needs change.

## Concepts to understand

- **Dependency direction:** lower-level reusable code should not depend on user interfaces that depend on it. For example, a plan schema should not need to import the Vue editor.
- **Public API:** the supported exports and behaviour a package promises to consumers.
- **Internal implementation:** files consumers should not import directly because they may change without notice.
- **Workspace dependency:** a local package dependency managed as part of the same repository.
- **Change ownership:** a change crossing package boundaries should update callers, docs, and relevant fixtures in the same review.
- **Build and test scope:** CI can verify affected packages, but must still verify shared contracts and cross-package integration.

## Apply this to Stagehand

Start by drawing the dependency graph before choosing directories. Candidate components are described in [TE-002](../../Planning/Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md); the repo-level rationale is in [ADR-001](../../Planning/Backlog/decisions/ADR-001-monorepo.md). For each proposed package, identify:

1. Its single primary responsibility.
2. The callers that need it.
3. Its public entry point and owned types/contracts.
4. Dependencies it is allowed to use.
5. What checks should run when it changes.

Do not create a package merely because a folder exists. Split a component when independent reuse, ownership, or a stable interface justifies the extra build, versioning, and maintenance work.

## Exercise

Sketch a dependency diagram for the plan schema, plan engine, runner core, Playwright adapter, CLI, Vue editor, result model, reporters, and documentation. Draw arrows from consumers to dependencies. Mark any proposed dependency that would make a low-level contract depend on an application. Write one sentence describing each package's responsibility and one example of a file that should remain private.

## You are ready when

- You can explain why Stagehand initially benefits from a monorepo and what evidence might justify splitting it later.
- Each candidate package has a distinct responsibility and a clear direction of dependency.
- You can explain how a schema change should be reviewed across editor, runner, examples, and CI.

## Read next

- [ADR-001 — Use a monorepo](../../Planning/Backlog/decisions/ADR-001-monorepo.md)
- [TE-002 — Reusable Node.js/TypeScript package structure](../../Planning/Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md)

## Reinforcement quiz

Try to answer from memory, then open the answer key.

1. What makes a repository a monorepo?
2. What job does a package boundary do?
3. Should the plan-schema package depend on the Vue editor? Explain the dependency direction.
4. When should a caller rely on a public API rather than an internal file path?
5. Name one reason to share code in a package and one cost that another package adds.

<details>
<summary>Answer key</summary>

1. It stores multiple related applications and/or libraries in one version-controlled repository.
2. It defines an interface and ownership boundary so callers depend on supported behaviour instead of internal details.
3. No. The schema is a lower-level contract consumed by the editor; making it depend on the editor reverses the useful dependency direction and couples the contract to a UI.
4. When consuming another package's supported behaviour. Private implementation files may change without preserving compatibility.
5. Sharing may avoid duplication and keep related changes coordinated. Another package adds build, dependency, API, testing, and maintenance overhead.

</details>
