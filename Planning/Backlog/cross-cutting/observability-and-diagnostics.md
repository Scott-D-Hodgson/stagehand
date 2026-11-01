# Observability and diagnostics

## Requirements

- Track run and case context, step position within each case. Loop-iteration context is deferred beyond MVP.
- Distinguish validation errors, hard assertion failures, soft assertion failures, action errors, timeouts, axe execution errors, accessibility findings, report errors, and runner-level failures.
- Include durations and stable plan/case identifiers; identify steps by case ID and zero-based sequence index rather than an author-assigned step ID.
- Record total run duration and per-case duration; distinguish timeout, configured duration-threshold failure, operator cancellation, and ordinary test failure.
- Associate failure screenshots/artifacts with the affected case and zero-based step index when capture is enabled.
- Preserve original errors when cleanup or report generation also fails.
- Avoid leaking secrets into logs or reports.
- Do not report success when required work was incomplete.
