# SC-34 - Non-Modifiable Executable Programs

**Source:** [ITSG-33 Annex 3A, SC-34](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

For assigned components, load/execute the operating environment and applications from hardware-enforced read-only media.

**Organisation-defined parameters:** components, applications. **Suggestion for review:** apply to specialized high-assurance appliances or immutable infrastructure where feasible.

## Supplemental guidance

Read-only media can preserve executable integrity from image creation. Reprogrammable read-only media requires integrity protection before installation and hardware controls against reprogramming while installed.

## Plain-language metaphor

Like running from a sealed master copy that ordinary users cannot rewrite.

## Stagehand and operator guidance

Stagehand itself does not enforce immutable hosts. Operators may use signed immutable runner images and controlled deployment pipelines; protect the image before provisioning.

## Control enhancements

(1) components with no persistent writable storage; (2) protect integrity before recording to read-only media and control that media afterward; (3) hardware write-protection for defined firmware with controlled procedures to disable/re-enable it during authorized changes.

## Assessment status

**Planned / specialized platform-dependent; not verified.**
