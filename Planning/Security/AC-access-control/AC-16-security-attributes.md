# AC-16 — Security Attributes

**Source:** [ITSG-33 Annex 3A, AC-16](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33) (legacy catalogue; see [Security overview](../README.md)).

## Control definition

Associate security attributes with information, users, or processes as required by the organisation; establish and maintain those associations; and ensure the attributes remain accurate and usable by the information system.

**Organisation-defined parameters to review:** attribute types and values; information, users, and processes to which they apply; authorized roles/processes for assigning or changing attributes; the binding and integrity protections; and any output markings or handling instructions.

## Supplemental guidance

Attributes are labels used by access and information-flow decisions, such as sensitivity, classification, releasability, or permitted handling. They may be associated with users, devices, processes, and data. The organisation defines their meaning and ensures components interpret them consistently. Labels alone do not enforce a policy; mechanisms must consume them correctly.

## In plain language

Think of baggage tags at an airport: a tag tells staff where a bag may go and how it must be handled. A wrong or missing tag can send it to the wrong place, so the tag must stay attached and mean the same thing to every handler.

## Stagehand initial assessment

Stagehand’s planned desktop/web automation may read and manipulate information through a browser, but no verified, enterprise-wide information-labelling or attribute-enforcement system is established by this assessment. Do not treat page titles, filenames, or UI labels as security attributes. If deployments handle classified or otherwise labelled data, operators should define authoritative labels, enforce them in the identity, storage, endpoint, and network layers, and prevent Stagehand from moving data across labels unless an approved policy mechanism mediates the transfer. Validate how browser automation, screenshots, logs, and exports preserve or shed labels.

## Control enhancements

The catalogue lists enhancements covering dynamic attribute association; authorized attribute changes; system-maintained association and integrity; user association; output labels and handling instructions; organisation-maintained association; consistent interpretation across components; assurance for association techniques; reassignment following validated re-grading; and attribute-based access or flow decisions. Determine applicability from the authoritative catalogue and the deployment’s data-classification model. These are not claimed as implemented Stagehand capabilities.
