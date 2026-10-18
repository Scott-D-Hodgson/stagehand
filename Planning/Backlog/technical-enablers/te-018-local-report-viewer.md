# TE-018 — Consider a local Vue report viewer

**Status:** Later candidate  
**Priority:** Later

## Intent

After the core MVP is complete, consider extending the Vue application with a polished, local-first viewer for Stagehand run results. This is a post-MVP “victory lap” enhancement, not a prerequisite for authoring, execution, or Azure DevOps publishing.

## Possible capabilities to evaluate

- Open a local JSON result and show a readable run summary and per-case outcomes/durations.
- Expand into step and assertion diagnostics, accessibility findings, and effective non-secret configuration.
- Link to screenshots and other diagnostic artifacts using safe local file-access behaviour.
- Preserve the local-first model; do not upload result files by default.
- Provide helpful errors for unsupported result versions or missing artifacts.

## Dependencies

- ATR-020 versioned result contract
- ATR-021 JSON report output
- ATR-024 diagnostic artifacts, if screenshot display is included
- MVP completion and user feedback
