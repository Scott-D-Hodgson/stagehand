# Plan engine workspace scaffold

This folder contains only the initial npm workspace manifest. The plan engine is not implemented yet.

- Future public source entry file: `src/index.ts`.
- Future entry-point check: import the package by its public package name and verify the intended plan interpretation API is available without importing internal paths.
- Add the source entry, `package.json` `exports` field, and check in a dedicated plan engine implementation change.
