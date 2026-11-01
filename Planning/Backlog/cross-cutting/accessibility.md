# Accessibility requirements

## Product behaviour

- axe scanning is configurable at plan and case level; case configuration can override the plan default.
- A request to assess accessibility on a run has a companion optional rule-tag list to manage scan scope. Selected tags restrict the assessment to matching rules; at plan scope omitted or empty tags leave axe's default rule selection unrestricted. Cases inherit omitted tags, replace the plan list with a non-empty list, or clear it with an explicit empty list. Default selection does not force-enable experimental or otherwise disabled rules. The `accessibility.tags` configuration shape is implemented in plan/case schemas, with unknown/non-exact tags rejected against axe-core 4.14.0. Runner-core resolves validated accessibility settings and exposes per-case snapshots; explicit direct scans now apply those settings; automatic after-step scanning is not implemented. Finding-level `tags` are output metadata, separate from this input filter.
- When enabled for a run/case, scans occur after every completed step.
- Keep findings attached to their case. Within each case, group a violation by page URL and violation description, and track its problematic markup entries. At the same URL with the same violation description, ignore markup already recorded; append newly observed problematic markup to that existing finding. A different URL or violation description creates a different finding. Identical findings in separate cases remain attached to each case.
- Findings are captured independently from functional assertion results.
- Findings include URL, rule ID, impact, description, and affected-node details/problematic markup where available. The result records each case's effective scan-enabled setting, failure-policy setting, and scan-tag scope.
- The accepted retained fields are finding-level `tags` and affected-node `html`, structured `target`, available `failureSummary` and `impact`, optional `xpath`, and `relatedNodes`. See the [field selection under TE-010](../technical-enablers/te-010-axe-integration.md#accepted-retained-fields). The result-model schema/types/example now represent this evidence and required per-case enabled/failOnViolation/resolved-tags settings. Effective settings resolution is implemented in runner-core; explicit case-session scans return raw axe observations, and a separate pure mapper projects violations with selected evidence and node counts. Automatic cadence, automatic session/collector integration, and result production remain unimplemented.
- Findings do not fail functional test status by default. Plan/case configuration can explicitly make violations fail the relevant case; the resulting run status follows the documented aggregation rule.
- Axe execution errors remain separate from violations and follow the runner error policy.

## Reporting

JSON is the authoritative rich result. XML and HTML should include accessibility information to the extent supported by their formats. Do not conflate an axe execution error with a detected accessibility violation.

Caller-owned per-case collection is implemented in runner-core; automatic session integration remains pending. The local Windows suite passes all 117 tests, including eight collection tests using synthetic observations/documents.
