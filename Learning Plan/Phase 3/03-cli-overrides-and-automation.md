# 3. CLI configuration, secrets, and automation behaviour

## Self-assessment: do I need this lesson?

- [ ] I can explain why command-line options should override plan defaults predictably.
- [ ] I understand why options need validation and help text.
- [ ] I know how environment variables can supply secret values without putting them in plans.
- [ ] I can explain the role of process exit codes in scripts and CI.
- [ ] I can distinguish a general production-target warning from a production-specific policy.

## What you will learn

- How a thin CLI invokes the reusable execution library.
- How to define and validate override precedence.
- How secrets and configuration enter from the environment.
- How automation interprets output, exit status, cancellation, and warnings.

## Core ideas

A CLI is the front door to the execution engine. Keep parsing arguments and printing help separate from plan execution so other callers can reuse the engine. Options should have consistent names, defaults, examples, and validation. An override should clearly identify whether it changes plan-level settings, selected case settings, or run-time dataset selection.

The plan describes defaults. CLI configuration overrides plan and case settings according to the established precedence. Run-time dataset selection overrides a case's default dataset, importing the selected values into that execution. Environment variables are enough for initial secret references; missing required secrets fail before browser startup. Never echo secret values into logs or JSON output.

Exit codes are a compact interface for shell scripts and CI. JSON is the MVP output format. Human-facing warnings should be visible without corrupting JSON output when the user requests a machine-readable result. Stagehand displays a general warning about target authorization, side effects, and costs; identifying production targets or adding production-specific acknowledgement is deferred.

## Apply this to Stagehand

Define a clear option table: name, scope, type, default, precedence, and error. Reject misspelled or conflicting options rather than silently ignoring them. Preserve the parsed effective non-secret configuration in the result where appropriate. Keep stdout suitable for JSON output and direct progress messages to an explicitly chosen channel so pipelines can consume results.

Document examples for local runs and CI runs, including where to configure environment variables securely in the CI provider. Do not promise that Stagehand owns the target system's authorization or operational responsibility. Users remain accountable for the environment they choose to test.

## Exercise

Given a plan timeout of 8 minutes, a case timeout of 4 minutes, and a CLI case override of 6 minutes, write the effective value and explain the precedence. Then draft CLI help for a runtime dataset selector and a secret environment-variable reference. State which values may safely appear in JSON output.

## You are ready when

- Every CLI option has documented type, scope, validation, and precedence.
- Secrets resolve before browser startup and are never emitted as values.
- A CI script can determine the outcome from the exit code and consume the JSON result.

## Read next

- [CLI epic E04](../../Planning/Backlog/epics/E04-cli/README.md)
- [Variable and secret resolution TE-005](../../Planning/Backlog/technical-enablers/te-005-variable-and-secret-resolution.md)
- [Node.js process exit codes](https://nodejs.org/api/process.html#exit-codes)
- [Phase 3 roadmap](../../Planning/Roadmap/Phase-3-execution-engine-and-cli/README.md)

## Reinforcement quiz

1. Why should the CLI remain a thin wrapper around a reusable execution core?
2. What takes precedence when the run selects a different dataset than a case default?
3. When should a missing required secret be detected?
4. Why must secrets stay out of result JSON?
5. What does an exit code tell a CI job?

<details>
<summary>Answer key</summary>

1. So execution can be reused by other callers and CLI parsing does not become entangled with browser behaviour.
2. The run-time selection; its named values are imported for that case execution.
3. Before browser startup.
4. Results are often retained or shared as artifacts; including secrets would disclose credentials.
5. The documented process outcome in a compact form the pipeline can use for success/failure decisions.

</details>
