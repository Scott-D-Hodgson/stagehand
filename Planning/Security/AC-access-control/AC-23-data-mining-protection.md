# AC-23 — Data Mining Protection

**Source:** [ITSG-33 Annex 3A, AC-23](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Employ organisation-defined data-mining prevention and detection techniques for organisation-defined storage objects to detect and protect against unauthorized data-mining activity.

**Organisation-defined parameters to review:** techniques to employ and the storage objects in scope. **Suggested starting point for review:** apply monitoring and access analytics to repositories containing sensitive user, customer, or operational data; select methods with privacy and legal review.

## Supplemental guidance

Data mining can combine or analyse stored information to infer sensitive facts or extract data beyond an authorized purpose. Protection depends on the data, storage environment, expected use, and applicable privacy rules. Detection should be proportionate and should not be confused with ordinary analytics that are authorized.

## In plain language

Even if each drawer is locked, someone could learn a lot by comparing many files. Watch for unusual patterns of looking through drawers, not just forced entry.

## Stagehand initial assessment

Stagehand is not assessed as a data-mining detection system. Its browser automation could access and collect records at scale if granted broad access. Restrict automation identities and data scope, rate-limit bulk operations where appropriate, log access, alert on anomalous collection, and use approved test datasets. Operators should keep analytics and monitoring lawful and aligned with data-use agreements.

## Control enhancements

No enhancements are listed for this control in the Annex 3A catalogue.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

