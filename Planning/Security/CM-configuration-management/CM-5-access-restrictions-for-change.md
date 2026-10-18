# CM-5 — Access Restrictions for Change

**Source:** [ITSG-33 Annex 3A, CM-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Define, document, approve, and enforce physical and logical access restrictions for changing the system.

**Organisation-defined parameters to review:** change privileges and their review frequency; software/firmware subject to signature verification; components requiring dual control; operational privileges; and software-library write access.

## Supplemental guidance

Only qualified, authorized people should make changes because changes can affect overall security. Access records support change control and investigations. Restrictions may use account permissions, workflows, protected libraries, and change windows.

## In plain language

Only approved mechanics should be allowed to alter the engine, and the workshop should record who touched it.

## Stagehand initial assessment

Protect repository branches, release credentials, package publication, signing keys, production configuration, and deployment environments with least privilege and reviewable access. Separate development from production privileges. Operators should constrain who can modify runner images, browser profiles, secrets, and network policy.

## Control enhancements

1. **CM-5(1), automated enforcement/auditing:** enforce change restrictions and log enforcement.
2. **CM-5(2), review system changes:** review at defined frequencies and circumstances for unauthorized changes.
3. **CM-5(3), signed components:** block defined software/firmware unless a recognized organisational signature is verified.
4. **CM-5(4), dual authorization:** require two qualified people for defined high-impact changes.
5. **CM-5(5), limit production privileges:** restrict and periodically re-evaluate production change privileges.
6. **CM-5(6), limit library privileges:** restrict write privileges to software libraries.
7. **CM-5(7), automatic security safeguards:** withdrawn and incorporated into SI-7.
