# TE-019 — Define production-target identification and warnings

**Status:** Later candidate  
**Priority:** Later

## Intent

After Stagehand defines what it means for a target to be production, decide whether and how the CLI/editor should identify the target and add a production-specific warning or require explicit acknowledgement before a production-target run. The MVP already displays a general, non-blocking execution warning for every run.

Production-specific identification and acknowledgement are not current MVP concerns. Until this item is prioritized, Stagehand does not claim it can identify production targets or enforce a production-specific acknowledgement gate. Operators remain responsible for authorizing the target and accepting operational consequences.

## Future investigation

- Define how an operator or plan identifies a target environment; do not assume URL-based inference is reliable.
- Decide whether warning/acknowledgement belongs in the CLI, editor, or both, including noninteractive pipeline behaviour.
- Define evidence/metadata recorded with a run and avoid treating acknowledgement as authorization.
- Review the workflow with security and operational stakeholders.

## Dependencies

- ATR-025 CLI execution
- Deployment and target-environment model
