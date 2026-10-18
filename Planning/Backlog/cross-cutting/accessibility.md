# Accessibility requirements

## Product behaviour

- axe scanning is configurable at plan and case level; case configuration can override the plan default.
- When enabled for a run/case, scans occur after every completed step.
- Within one run, group a violation by page URL and violation description, and track its problematic markup entries. At the same URL with the same violation description, ignore markup already recorded; append newly observed problematic markup to that existing finding. A different URL or violation description creates a different finding.
- Findings are captured independently from functional assertion results.
- Findings include URL, rule ID, impact, description, and affected-node details/problematic markup where available.
- Findings do not fail functional test status by default. Plan/case configuration can explicitly make violations fail the relevant case; the resulting run status follows the documented aggregation rule.
- Axe execution errors remain separate from violations and follow the runner error policy.

## Reporting

JSON is the authoritative rich result. XML and HTML should include accessibility information to the extent supported by their formats. Do not conflate an axe execution error with a detected accessibility violation.
