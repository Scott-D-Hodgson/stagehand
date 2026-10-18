# SC-31 - Covert Channel Analysis

**Source:** [ITSG-33 Annex 3A, SC-31](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Analyse communications for potential storage or timing covert channels and estimate their maximum bandwidth.

## Supplemental guidance

Developers are best placed to identify potential covert-channel paths. Analysis is especially relevant where unauthorized flows may cross security domains, including multilevel or cross-domain systems.

## Plain-language metaphor

Like checking whether someone can pass hidden notes through the timing or pattern of ordinary work.

## Stagehand and operator guidance

This is unlikely to be a primary concern for ordinary single-domain Stagehand use. If deployed across security domains, operators need specialist analysis; maintainers should document trust boundaries and avoid claims of covert-channel resistance without evidence.

## Control enhancements

(1) test a subset of identified channels for exploitability; (2) reduce bandwidth of selected storage/timing channels to defined values; (3) measure selected channel bandwidth in the operational environment.

## Assessment status

**Planned / specialized environment-dependent; not verified.**

## Organisation-defined parameter suggestions

The analysis selects channel types and bandwidth limits. **Suggestion for review:** perform specialist analysis only where multiple security domains or sensitive cross-domain flows are in scope; document selected channels and risk-based bandwidth thresholds with the authorizing official.
