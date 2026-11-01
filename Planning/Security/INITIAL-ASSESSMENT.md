# Stagehand initial security assessment

**Assessment type:** Planned-state, product-level screening against the legacy ITSG-33 Annex 3A family taxonomy  
**Date:** 17 October 2026  
**Status:** Preliminary scoping; implementation context reviewed 1 November 2026, control satisfaction not assessed
**Decision:** No control is rated implemented or compliant

## 1. Purpose and limits

This is an initial engineering assessment to guide Stagehand's anticipated development and help teams identify controls that will need a product feature, an operator procedure, or both. As of the assessment date above, it was based on the repository's proposed architecture and backlog, not source code, a threat and risk assessment (TRA), a security categorization, a deployment design, or an assessment by an authorizer. The original document preceded the current implementation slices. The [current review](REVIEW.md) now reconciles the mappings with validation/loading, result contracts, browser actions, assertions, cleanup, automatic axe collection, dependency decisions, and recorded development checks. This is a product-context review, not verification of security-control satisfaction.

The family ratings below are scoping hypotheses, not ITSG-33 control determinations. ITSG-33 Annex 2 says controls should be selected and tailored against the applicable organisational/domain profile and system security category, with threat and risk information; controls can be allocated to the system, its environment, or both. A final decision needs the system owner, security practitioner, assessor, and authorizer for the actual deployment.

**Catalogue currency matters:** the Cyber Centre states that [ITSP.10.033](https://www.cyber.gc.ca/en/guidance/cyber-security-privacy-risk-management/itsp10033/foreword-overview-introduction), effective 31 March 2026, supersedes ITSG-33 Annex 3A. It adds privacy scope and control families, among other changes. This document follows the requested ITSG-33 family structure as a legacy-planning view only. Before this assessment is used operationally, choose the currently required catalogue and profile and create a reviewed crosswalk; do not assume that family-level similarities make controls equivalent.

## 2. Anticipated system boundary

### In scope for Stagehand product design

- Portable JSON test plans and the shared plan schema/validator.
- The planned Node.js/TypeScript runner and CLI that execute plans through Playwright and browsers.
- The planned Vue single-page editor, intended to import, edit, validate, and download plans without a Stagehand account or central plan repository.
- Execution configuration, variable and secret references, result model, logs/diagnostics, the JSON MVP result contract, and implemented optional axe findings. Full result production remains pending; JUnit/HTML reports, screenshots, and traces are deferred.
- Source code, dependencies, build/release artifacts, contributor workflow, and documentation.

### Deployment-dependent or external

Unless the architecture changes, the organisation operating Stagehand owns the CI service, developer/agent workstations, identity and access management, endpoint protection, operating-system hardening, networks and egress, target applications and test accounts, secret provider, artifact storage, retention, backups, monitoring/SIEM, incident response, physical security, personnel processes, and authorization. A user-hosted editor also depends on its web host, TLS, headers, access controls, and delivery pipeline.

The test runner is a privileged automation tool in practice: a plan can navigate to systems, submit data, and cause actions through a browser identity. Treat plan authorship and execution as security-sensitive. Recommend test and staging targets by default; only run trusted plans against authorized targets, use synthetic or approved test data, and isolate the runner from production credentials and unrelated networks unless a documented need and risk decision allow otherwise. Stagehand enables those actions but does not own target authorization, quotas, network-egress/download limits, costs, or operational consequences. Operators must understand and accept those conditions; production use is possible but must be deliberate.

## 3. Rating vocabulary

| Rating | Meaning at this planning stage |
| --- | --- |
| **Product: planned** | A Stagehand design or implementation requirement is plausible, but not built or verified. |
| **Shared** | Stagehand can provide a capability or documentation; the operating organisation must supply policy, configuration, process, or evidence. |
| **Environment / inherited** | Primarily provided by the host, CI, cloud, endpoint, network, or organisational program; verify the provider and inheritance boundary. |
| **Conditional** | Applies only if a deployment adds the relevant feature or technology (for example accounts, remote service, wireless, or hosted execution). |
| **Open** | Scope, threat model, implementation, or evidence is not yet sufficient to decide. |

These labels do not indicate satisfaction. “Inherited” is not a pass: document the provider, service boundary, assurance evidence, shared responsibilities, and residual risk.

## 4. Family-level initial assessment

| Family | Initial applicability | Planned Stagehand work | Operator / end-user action |
| --- | --- | --- | --- |
| **AC — Access Control** | **Shared; conditional.** Relevant to who can author, approve, execute, and read plans/results. A local-first editor has no planned Stagehand account service; CI and repository permissions remain external. | Define trust boundaries and safe plan handling. If a hosted service is introduced, design authorization, tenant separation, privileged access, session handling, and public-content protections before implementation. Avoid implying that local files are access-controlled by Stagehand. | Restrict repository, CI, secret, and artifact permissions by role; require review for plan changes and production-target execution. Protect workstation accounts and test identities. |
| **AT — Awareness and Training** | **Environment / inherited.** Primarily organisational process; Stagehand documentation can support it. | Document secure plan authoring, secret handling, target authorization, safe report sharing, and incident contacts. | Train authors/operators; define who may create plans, approve targets, and handle sensitive test artifacts. |
| **AU — Audit and Accountability** | **Shared; open.** Runner diagnostics and the result contract now exist; full result production remains pending. They are not a security audit system or tamper-resistant audit trail. | Specify event fields and redaction; distinguish security-relevant runner events from functional test results. Avoid storing secret values. Decide whether structured logs are needed and how to report security failures. | Capture CI, repository, identity, cloud, and endpoint audit records centrally; restrict and monitor access; set retention and alerting based on policy and risk. Treat test reports as sensitive. |
| **CA — Security Assessment and Authorization** | **Environment / shared.** Authorization is for a system and deployment, not conferred by a tool. | Maintain architecture, security requirements, threat model, security test evidence, release notes, and known limitations as implementation advances. Support customer assessment with accurate product documentation. | Determine categorization, select the applicable profile/catalogue, assess controls and residual risk, approve connections, and obtain authorization before operation where required. |
| **CM — Configuration Management** | **Shared; product: planned.** Applies to Stagehand dependencies/builds and each deployed runner/editor/browser environment. | Versioned schemas, dependency pins, PR guidance, and a development-container baseline exist. Assess their security operation, define update/release assurance, and document deployment baselines. | Pin and review versions, maintain an approved baseline, limit configuration drift, use supported OS/browser/runtime versions, and control who can change CI and deployment settings. |
| **CP — Contingency Planning** | **Environment / inherited; product: limited.** A local runner is generally rerunnable, but availability and recovery requirements depend on business use and any future service. | Document expected behaviour on interrupted execution and safe handling of partial results. Avoid claiming backup or recovery capabilities for user plans/artifacts unless implemented. | Back up source, approved plans, configuration, and evidence according to organisational recovery objectives; test restoration of the CI and artifact environment. Keep approved recovery access. |
| **IA — Identification and Authentication** | **Conditional / environment.** The planned standalone editor and runner do not have user accounts. Authentication to CI, repositories, secret stores, target applications, and hosted resources is in scope for the deployment. | Do not invent Stagehand identity features. If an API, hosted execution, or multi-user service is proposed, revisit authentication, service identity, credential storage, re-authentication, and federation requirements before design approval. | Use organisational identity, MFA where required, unique non-shared accounts, short-lived CI identities, and managed secrets. Give test accounts minimum target-system permissions and rotate/revoke them. |
| **IR — Incident Response** | **Environment / shared.** Stagehand has no hosted service in the plan; a compromised runner, plan, dependency, or artifact can still be an incident. | Document security contact and product-level triage inputs; ensure diagnostics help identify run/version/configuration without leaking secrets. Define how to report a vulnerability once a distribution channel exists. | Establish incident roles and reporting path; retain relevant CI/endpoint/network logs; be able to disable credentials, stop jobs, quarantine artifacts/workers, and notify affected owners. Exercise the process. |
| **MA — Maintenance** | **Shared; product: planned.** Applies to Stagehand releases, dependencies, browsers, and host maintenance. | Publish supported versions and security update guidance; track dependency vulnerabilities; define release provenance and a process for unsupported components. | Patch OS, Node.js, browsers, Playwright, CI agents, and secret/hosting services; restrict remote maintenance; remove stale runners and credentials. |
| **MP — Media Protection** | **Environment / shared.** Plans and outputs are files; reports, screenshots, traces, downloads, caches, and CI artifacts may contain sensitive information. | Minimize captured data; redact secrets where technically feasible; document what artifacts can contain and avoid promising complete redaction until tested. Provide safe defaults for artifact output where the design allows. | Classify plans/results, use encrypted and access-controlled storage, limit downloads/sharing, set retention/deletion, and sanitize or destroy media under policy. Do not commit production data or credentials. |
| **PE — Physical and Environmental Protection** | **Environment / inherited.** Stagehand software cannot secure the facilities or devices on which it runs. | State deployment assumptions and avoid claiming physical safeguards. | Select approved hosting/workstations; protect physical access to endpoints, CI infrastructure, removable media, and printed or exported reports. Review provider assurance if infrastructure is outsourced. |
| **PL — Planning** | **Shared.** Product architecture and security documentation are relevant; system security plans, privacy assessments, rules of behaviour, and operational plans are organisation-specific. | Maintain a system boundary, data-flow description, security design, secure-use guidance, and a record of planned controls/risks. Review security impacts when architecture changes. | Integrate Stagehand into the organisation's system security plan and privacy/risk processes; define permitted use, data, connections, roles, and approved configurations. |
| **PS — Personnel Security** | **Environment / inherited.** Screening, transfers, termination, and sanctions are organisational duties. | Document that maintainers and contributors may affect shipped code; use repository review and access controls as technical support, not a substitute for personnel processes. | Apply organisational screening and onboarding/offboarding rules; promptly remove repository, CI, cloud, and secret-store access when roles change. |
| **RA — Risk Assessment** | **Shared.** Stagehand has no deployment-specific threat model or categorization yet. | Conduct threat modeling for malicious/unsafe plans, browser compromise, credential leakage, dependency compromise, report exposure, and unsafe target access. Reassess after major changes. | Categorize information and services, assess threats and vulnerabilities in the intended environment, select controls from the required profile, and document risk acceptance. |
| **SA — System and Services Acquisition** | **Shared; product: planned.** Applies to software dependencies, development practices, build pipeline, and any future service providers. | Define secure development and review practices; inventory and assess dependencies; produce reproducible/provenanced releases where feasible; document third-party components and support status. | Approve package registries, CI providers, browser binaries, and external services; assess supplier assurance and contract responsibilities; restrict build credentials and artifact publication. |
| **SC — System and Communications Protection** | **Shared; conditional.** Applies to browser-to-target and runner-to-service network traffic, editor hosting, CI boundaries, and any future remote Stagehand components. | Validate plans and constrain dangerous actions/destinations where feasible; do not assume that local execution means isolated execution. If a hosted/API component is added, design TLS, boundary controls, service isolation, and abuse resistance explicitly. | Apply egress allowlists, segmentation, approved DNS/proxy/TLS inspection policy, and isolated CI workers. Limit access from the runner to only authorized target systems and required services. |
| **SI — System and Information Integrity** | **Shared; product: planned.** Applies to input validation, software integrity, vulnerability handling, browser/runtime behaviour, and sensitive output. | Validate schemas and semantics before execution; reject unsupported execution constructs; handle errors safely; test redaction and output encoding; scan dependencies and build artifacts; define vulnerability intake and remediation. | Use endpoint protection, patching, integrity monitoring, approved browser images, vulnerability scanning, and controlled artifact handling. Review test plans and current retained DOM evidence before sharing; assess safe rendering if HTML output is later added. |

## 5. Cross-cutting design priorities

The following are design priorities for review, not claims of control implementation. Some foundations now exist (validation, dependency pins, and browser lifecycle); the current review distinguishes those from remaining safeguards:

1. **Define the runner threat boundary.** A test plan must not be treated as harmless data. Specify allowed navigation, downloads, file access, browser permissions, subprocess behaviour, and whether plans may reach production or sensitive networks. The current action vocabulary excludes arbitrary plan JavaScript; target-page scripts and subresources remain outside that restriction.
2. **Isolate execution.** Recommend ephemeral CI workers or equivalent isolation, non-privileged accounts, read-only mounts where possible, no host credential mounts, and constrained egress. Document cases where browser tests need broader access and require explicit approval.
3. **Control secrets end to end.** Implement the agreed initial environment-variable-name references and redaction before using real secrets. Resolution/redaction remain M5 work; direct secret-store integrations are later. Test errors and JSON evidence for disclosure; assess deferred screenshots/traces and other formats if introduced. Use short-lived credentials and least-privilege target accounts.
4. **Protect artifacts.** Define artifact contents, access, encryption, retention, deletion, and whether screenshots/traces are enabled. Use synthetic data unless the system owner approves a stronger classification and handling path.
5. **Secure supply and release.** Review and pin dependencies, monitor advisories, restrict publish rights, preserve release provenance, and define supported versions and a vulnerability response path.
6. **Keep the editor's privacy promise testable.** Verify no plan upload or telemetry occurs by default; document any optional external requests, hosting requirements, browser storage, and user-initiated sharing.
7. **Assess features conditionally.** Hosted accounts, APIs, remote execution, shared storage, telemetry, plugins, or multi-tenant operation materially change AC, IA, AU, SC, CP, IR, and privacy scope; require a fresh threat model and control allocation before adding them.

## 6. Suggested starting operational choices for review

These values are **project suggestions only**, not values prescribed by ITSG-33 and not substitutes for organisational parameters in individual control statements. Confirm or replace them with the system owner and security authority:

- **Execution identity:** dedicated non-administrator account per worker; separate test identities per environment; no production credentials by default.
- **Network access:** deny by default at the worker boundary; allow only required target and service destinations for each approved job.
- **Secrets:** short-lived credentials where supported; never place secret values in plans, repository files, command-line arguments, or artifacts.
- **Test data:** synthetic by default; require documented approval and handling controls before using personal, confidential, or production data.
- **Run artifacts:** private to the job/team; retain only as long as needed for the stated purpose and applicable policy; choose a concrete retention period per deployment before rollout.
- **Review cadence:** review this assessment at each material architecture or trust-boundary change and at least annually while the system is in use. This cadence is a proposed working practice, not a catalogue parameter.

No numerical retention, incident response, lockout, or patch deadline is proposed here as a universal value. Those values depend on the current catalogue/profile, risk, applicable policy, and deployment.

## 7. Evidence needed before ratings can advance

- Product implementation and architecture/data-flow diagrams.
- Defined system boundary, data classification, security categorization, applicable control profile, and threat/risk assessment.
- Threat model for plan execution and browser/target interactions.
- Secure design and code review records; security test plans and results; dependency inventory and vulnerability process.
- Demonstration that secret values are absent from logs, result files, reports, screenshots, traces, and failures under representative tests.
- Editor network/privacy review and deployment hardening guide.
- CI identity, worker isolation, network policy, artifact protection/retention, and backup configuration evidence.
- Incident, vulnerability disclosure, patching, release provenance, and access lifecycle procedures.
- Control-by-control assessment against the currently required catalogue, including enhancements, assigned responsibility, rationale for tailoring, and assessor/authorizer decisions.

## 8. Source basis

- [ITSG-33 Annex 3A — Security control catalogue](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33): family taxonomy and control catalogue requested for this folder.
- [ITSG-33 Annex 2 — Information system security risk management activities](https://www.cyber.gc.ca/en/guidance/annex-2-information-system-security-risk-management-activities-itsg-33): system lifecycle, tailoring, and allocation context.
- [ITSP.10.033 — Security and privacy controls and assurance activities catalogue](https://www.cyber.gc.ca/en/guidance/cyber-security-privacy-risk-management/itsp10033/foreword-overview-introduction): current successor, effective 31 March 2026.
- Repository basis: [`README.md`](../../README.md), [`Backlog/product-vision.md`](../Backlog/product-vision.md), [`Backlog/release-plan.md`](../Backlog/release-plan.md), and [`Backlog/cross-cutting/security.md`](../Backlog/cross-cutting/security.md).

This assessment summarizes and applies those sources to the proposed Stagehand design; it is not an official control interpretation. Validate control statements, enhancements, organisation-defined parameters, and deployment applicability against the current authoritative publication and organisational direction.
