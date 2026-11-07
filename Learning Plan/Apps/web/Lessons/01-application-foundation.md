# Lesson 1: Application foundation

> “What does the smallest useful Vue editor foundation prove?” — Vivian “Vite” Chen, Developer

[← Previous: course outline](../README.md) · [Course outline](../README.md) · [Next: browser-safe contracts →](02-browser-safe-contracts.md)

`@stagehand/web` is a separate npm workspace application. Vite runs its development server and produces the production browser bundle; Vue renders the interface; TypeScript checks the source before the bundle is created. The application pins these tools exactly so a later install does not silently adopt a different toolchain.

M8.1 established this foundation with Vue 3.5.44, Vite 8.3.6, and TypeScript 6.0.3. The build first builds `@stagehand/plan-schema`, then type-checks the editor, then asks Vite to create `apps/web/dist/`. `dist/` is generated output, not source to edit or commit.

## Try it

From the repository root, read `apps/web/package.json` and explain the order of the `build` script. Then run the documented type check or build in the development container.

## You are ready when

- You can name the responsibilities of Vite, Vue, and TypeScript.
- You can explain why the schema package builds before the browser application.
- You know that M8.1 is a foundation, not finished authoring functionality.

[← Previous: course outline](../README.md) · [Course outline](../README.md) · [Next: browser-safe contracts →](02-browser-safe-contracts.md)
