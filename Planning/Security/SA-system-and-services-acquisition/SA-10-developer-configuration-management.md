# SA-10 - Developer Configuration Management

**Source:** [ITSG-33 Annex 3A, SA-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Require developers to perform configuration management during selected lifecycle phases; control integrity of defined configuration items; make only approved changes; document changes and possible security impacts; and track and report security flaws and their resolution.

**Organisation-defined parameters:** lifecycle phases, controlled configuration items, and flaw-report recipients. **Suggestion for review:** cover source, dependency lockfiles, build configuration, release assets, and security-relevant documentation; route flaw reports to product/security owners.

## Supplemental guidance

Applies to internal development and integration as well as contracted developers. Configuration management protects master materials and tracks authorized changes throughout the lifecycle. Relevant items can include designs, source, object code, tools, test fixtures, and documentation.

## Plain-language metaphor

Like keeping a controlled master blueprint and a signed record of every approved change to it.

## Stagehand and operator guidance

The repository and its version history can support change tracking, but do not alone prove approvals, protected build inputs, flaw tracking, or trusted release distribution. Maintainers should document review/approval and release provenance. Operators should verify release integrity and maintain a local change-approval process when accepting updates.

## Control enhancements

(1) enable software/firmware integrity verification; (2) provide an organisational configuration-management process where no dedicated developer team exists; (3) enable hardware integrity verification; (4) compare newly generated security-relevant versions with previous versions; (5) maintain integrity mapping between master build data and on-site operational master copies; (6) ensure distributed security-relevant updates exactly match developer master copies. Hardware-specific enhancement (3) is generally outside this software product's boundary; evaluate the others against evidence and deployment model.

## Assessment status

**Planned / not verified.** Repository presence is not sufficient evidence of full configuration-management control operation.
