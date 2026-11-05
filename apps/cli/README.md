# CLI workspace scaffold

This folder contains only the initial npm workspace manifest. CLI behaviour is not implemented yet.

- Future application entry file: `src/main.ts`.
- Future entry-point check: verify the documented CLI entry can be invoked by a consumer and exposes the intended command interface.
- Add the source entry and its check in a dedicated CLI implementation change.

## Planned execution signals

When the CLI is implemented, its exit codes will distinguish a completed-but-failed test run from a runner that could not execute safely:

| Exit code | Meaning |
| --- | --- |
| `0` | Passed. |
| `1` | Completed with test failures. |
| `2` | Cancelled. |
| `3` | Invalid input or preflight failure prevented execution. |
| `4` | Operational or result-output error. |

Before every run, the CLI will display a non-blocking warning: the operator is responsible for target authorization and for accepting possible side effects, egress/downloads, limits, and costs. It will not ask for confirmation, identify production targets, or block the run. Production-target identification and production-specific acknowledgement remain deferred to [TE-019](../../Planning/Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).
