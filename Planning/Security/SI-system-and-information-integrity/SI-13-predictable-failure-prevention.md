# SI-13 - Predictable Failure Prevention

**Source:** [ITSG-33 Annex 3A, SI-13](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Determine mean time to failure for defined components in their operating environments; provide substitute components and exchange them when defined substitution criteria are reached.

**Organisation-defined parameters:** components, environment, substitution criteria. **Suggestion for review:** apply to critical services/platform components with reliability data; set failover thresholds based on impact and tested recovery capability.

## Supplemental guidance

Although MTTF is a reliability measure, this control concerns failures affecting security capabilities. Use installation-specific data, consider potential harm, and ensure transfer to standby components preserves safety, readiness, state, and security.

## Plain-language metaphor

Like replacing a worn part before it is likely to break, while keeping a tested spare ready.

## Stagehand and operator guidance

This applies mainly to infrastructure/services. Operators should assess availability of CI, identity, storage, and network services; plan tested failover where required. A local Stagehand runner has no inherent standby capability.

## Control enhancements

(1) transfer responsibilities before a defined fraction of MTTF; (2) unsupervised process execution time limit withdrawn into SI-7(16); (3) manually initiate transfer at defined intervals when MTTF exceeds a threshold; (4) install standby components within a defined time and alarm/shut down on detected failure; (5) provide real-time or near-real-time failover.

## Assessment status

**Planned / infrastructure-dependent; not verified.**
