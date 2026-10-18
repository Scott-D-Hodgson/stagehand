# Security and sensitive data

## Principles

- Do not commit credentials, tokens, real user data, or production secrets.
- Plans reference protected values by environment-variable name or another explicitly approved external secret provider; they do not contain secret values.
- Resolved secrets must be redacted from logs, errors, result files, screenshots where feasible, and reports.
- Validate plan input before execution and do not support arbitrary JavaScript execution in JSON plans for the initial release.
- Keep browser/runner permissions least-privileged.
- The local-first editor must not upload plans by default.
- Any future API must explicitly define authentication, authorization, file access, and execution boundaries.
- Treat screenshots, traces, HTML reports, and accessibility findings as potentially sensitive artifacts.
- The MVP displays a general, non-blocking execution warning about authorization, side effects, network/download use, limits, and costs. Production-target identification and a production-specific acknowledgement gate are deferred; see [TE-019](../technical-enablers/te-019-production-target-identification-and-warning.md). Operators remain responsible for target authorization and operational decisions.
- Recommend test and staging targets by default, but do not imply those environments are free of quotas, egress/download limits, or costs. Stagehand enables browser actions but does not own target-system authorization, limits, costs, or operational consequences; operators are responsible for choosing authorized targets and understanding/accepting those conditions. Production use is possible but must be a deliberate operator decision.

## Agent containment

Agent instructions are not a security boundary by themselves. Use runtime sandboxing, controlled mounts, least privilege, and network restrictions where supported. Do not mount host credentials or production secrets by default.

## Acceptance themes

- Secret values are not written into plans or normal result outputs.
- Missing secrets fail clearly without disclosing values.
- Example files use synthetic credentials and domains.
- Security-sensitive changes include tests and documentation.
- User guidance recommends test/staging targets by default and explains operator responsibility for target authorization, side effects, network/download limits, and costs. The CLI displays a general non-blocking warning; production-target identification and a production-specific acknowledgement gate remain future work.
