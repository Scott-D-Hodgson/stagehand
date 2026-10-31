# TE-010 — axe integration

**Status:** In Progress

**Priority:** Must  
**Related stories:** ATR-019

## Objective

Integrate axe scanning after each completed step when enabled, keep findings attached to their case, and keep accessibility findings distinct from functional status.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Failure modes and security implications are addressed where relevant.

## Notes

Refine this enabler into smaller tasks if implementation reveals independent workstreams.

## Dependency review

**Accepted by the owner on 31 October 2026:** use Deque's `@axe-core/playwright@4.14.0` as a production dependency of `@stagehand/runner-core`, with `axe-core@4.14.0` resolved in the lockfile. The owner accepts the MPL-2.0 obligations and will use the upstream packages without modifying their covered files. Both packages are installed; scanning remains unimplemented.

### Options considered

| Option | Fit for Stagehand | Trade-off |
| --- | --- | --- |
| `@axe-core/playwright` | Accepts the existing Playwright page and coordinates axe injection and frame analysis. | Adds the adapter and engine under MPL-2.0; Stagehand must still own scan cadence, settings, finding collection, and errors. |
| Direct `axe-core` injection | Uses the same engine with one fewer npm package. | Stagehand would own more injection, frame, and navigation lifecycle logic; it does not avoid the engine's MPL-2.0 obligations. |

The adapter is the accepted starting point because Stagehand already owns Playwright case sessions. Keep the integration inside runner-core; do not add a second browser process, CLI tool, test framework, or adapter package to Stagehand's architecture merely to run scans. The adapter can use helper pages internally, so its cleanup behaviour still needs verification.

### Published-package evidence

Reviewed the npm archives for both packages using `npm pack --ignore-scripts`; no package lifecycle scripts were executed. Inspected each archive's `package.json` and `LICENSE`, plus the engine's `LICENSE-3RD-PARTY.txt`. Registry metadata identified 4.14.0 as the adapter's current published version at review time.

| Package | Licence | Runtime dependencies | Compatibility metadata |
| --- | --- | --- | --- |
| `@axe-core/playwright@4.14.0` | MPL-2.0 | `axe-core ~4.14.0`; peer `playwright-core >=1.0.0` | Node.js `>=22.12.0`; ESM and CommonJS exports with TypeScript declarations. |
| `axe-core@4.14.0` | MPL-2.0 | No declared runtime npm dependencies. | Node.js `>=4`; ships the engine and TypeScript declarations. |

Stagehand's Node.js 26.12.1 and existing Playwright/playwright-core 1.64.1 satisfy those declared ranges. These declared ranges match the installed dependency tree; real-browser scanning remains unverified. The adapter's versioning follows the engine's major/minor line; review patch updates deliberately as well. The direct dependency is pinned exactly, the lockfile resolves the engine to 4.14.0, and the existing playwright-core peer is reused.

### Licence and bundled notices

MPL-2.0 applies to both packages. Mozilla describes it as file-level copyleft: separate Stagehand files can retain MIT, while covered files and modifications to them remain subject to MPL. Redistribution requires preserving applicable notices and making the covered source available to recipients, including telling executable recipients how to obtain it. The accepted approach is to use upstream packages without modifying their covered files, retain their licence files, and document exact-version source locations. A release packaging check must verify that the shipped artifact provides those notices and source instructions.

The engine also bundles code covered by MIT and ISC. Its published third-party notice lists:

- MIT: `colorjs.io`, `core-js-pure`, `css-selector-parser`, `doT.js` (including jQote2 portions), `emoji-regex`, `es6-iterator`, `es6-promise`, `event-emitter`, `is-promise`, `lru-queue`, `typedarray`, and `weakmap-polyfill`.
- ISC: `d`, `es5-ext`, `es6-symbol`, `es6-weak-map`, `ext`, `memoizee`, `next-tick`, `timers-ext`, and `type`.

These are bundled components, not additional resolved runtime npm dependencies. Retain the complete shipped `LICENSE-3RD-PARTY.txt`, including all copyright statements and licence text. A dependency-tree licence scan alone would miss this distinction.

[Third-party notices](../../../THIRD-PARTY-NOTICES.md) now identifies both installed MPL packages and reproduces the MPL text, the engine copyright header, trademark attribution, and complete bundled MIT/ISC notices. It includes exact-version source instructions. Package files are used unchanged; future release packaging still needs to verify notice and source-instruction inclusion in shipped artifacts.

### Remaining decisions and verification

- [x] Owner accepts the adapter choice and MPL-2.0 obligations, using upstream covered files unchanged.
- [x] Install/pin the dependency and record the actual resolved tree and notices.
- [x] Verify the ESM import and a TypeScript compile using `AxeBuilder` with Playwright's `Page` type; both passed locally on Windows with the pinned toolchain.
- [x] Run the runner-core build and existing mocked-browser suite after installation; all 81 tests passed locally on Windows.
- [ ] Verify real-browser scanning, including frames and cleanup.
- [ ] Verify notices and covered-source instructions in future release artifacts.
- [x] Settle the retained accessibility fields before the M4 result-model extension: the owner selected `html`, `target`, `failureSummary`, `impact`, `xpath` when available, `relatedNodes`, and `tags`.

### Accepted retained fields

The owner selected these fields on 31 October 2026. The result schema, TypeScript types, synthetic example, and validation tests now implement this retention contract. Scanner mapping and collection remain outstanding.

| Scope | Fields | Mapping notes |
| --- | --- | --- |
| Finding | `tags` | Retain axe's rule tags alongside the existing rule ID, impact, description, help text/link, and the finding URL. |
| Affected node | `html`, `target`, `failureSummary`, `impact`, `xpath`, `relatedNodes` | Retain problematic markup, structured selectors, available failure summaries and node severity, optional XPath, and related elements. Preserve frame/shadow-DOM selector structure. |
| Related node | `html`, `target`, optional `xpath` | Axe supplies related elements inside individual checks in `any`, `all`, and `none`; retain the related-node information from those checks. |

Retain optional upstream information when available; do not invent failure summaries, XPath, or severity when absent. Tags belong to the finding, not each affected node. Full check records/messages, arbitrary check `data`, ancestry paths, and live DOM element references are outside this selected field set. Result v1 now uses `affectedNodes` and a required flat `relatedNodes` array per affected node. Related elements are projected from `any`/`all`/`none` checks, retaining one exact html/structured-target/optional-xpath tuple per node; the validator rejects duplicate related objects without collecting or deduplicating them. Finding impact permits null for unknown severity; optional node impact may be absent or null. Empty upstream target arrays are preserved. Required case accessibility settings record enabled, failOnViolation, and resolved tags even without findings. Producer-side mapping/count consistency remains scanner work; this decision does not change the agreed case-level grouping by URL/description and problematic-markup deduplication.

Keep violations separate from functional assertions. A rejected scan is an execution error, not an accessibility finding; handling incomplete results also needs deliberate treatment. M6 continues to own outcome and continuation policy. This review does not implement scanning or establish accessibility conformance. The accepted companion tag option below allows authors to choose scan scope without Stagehand imposing a fixed rule subset.

### Accepted scan-scope option

A run requesting axe assessment must also offer an optional rule-tag list. A non-empty list limits the scan to rules matching any selected tag. At plan scope, omitted or empty tags mean no tag restriction: use axe's native defaults and report the resulting findings. Cases inherit the plan list when tags are omitted; an explicit empty case list clears the filter, and a non-empty case list replaces the plan list. Do not interpret this as enabling every experimental/disabled rule or adding passed/inapplicable results to Stagehand's violation findings.

The scanner should apply a non-empty list through `AxeBuilder.withTags(...)`; for an omitted or empty list, leave tag filtering unset. This is scan configuration, distinct from retaining each finding's rule `tags`. The owner accepted `accessibility.tags`, case list replacement/inheritance, explicit-empty clearing, and rejection of unknown tags. The plan and case schemas now validate unique, exact tag strings against the axe-core 4.14.0 inventory; malformed values and unknown tags fail before scanning. Validation preserves input and does not apply inheritance. Exact CLI flag names remain deferred to CLI implementation. Record the effective filter in results so reviewers can interpret assessment scope; the result schema now requires `effectiveSettings.accessibility.tags` on each case, independently of finding tags.

- [x] Agree to an optional companion run-level tag filter, defaulting to axe's unrestricted default rule selection when no tags are specified.
- [x] Extend configuration schemas/examples/validation for `accessibility.tags`; plan-schema builds and all 39 tests pass locally on Windows. The dependent plan-engine build/check passes with 14 tests passing and 3 Windows symlink tests skipped. Dev-container and CI results are not yet established for this slice.
- [x] Extend the result v1 schema/types/example with required effective tags and selected evidence. The build and all 22 result-model tests passed locally on Windows, plus a TypeScript public-import check. This is shape/type validation, not scanner integration.
- [ ] Verify this result-model slice in the dev container/CI.
- [ ] Test scanner behaviour for a selected tag, multiple tags, omitted tags, and an empty list; verify filtering controls the scan, not just its output.

Future upstream release/tag discovery, deterministic catalogue refresh, and checks for drift against the pinned engine are tracked separately under [TE-022](te-022-axe-tag-catalogue-update-detection.md). That maintenance mechanism is proposed and does not block this schema slice.

See [axe tag filtering](https://github.com/dequelabs/axe-core-npm/blob/v4.14.0/packages/playwright/README.md#axebuilderwithtagstags-stringarray) and [axe default rule selection](https://github.com/dequelabs/axe-core/blob/v4.14.0/doc/API.md#options-parameter).

### Sources

- [Deque adapter documentation, version 4.14.0](https://github.com/dequelabs/axe-core-npm/tree/v4.14.0/packages/playwright)
- [Adapter source at the published package's gitHead](https://github.com/dequelabs/axe-core-npm/tree/2375f7f5523a2accaeef91a3cb12e30a46e7fbea/packages/playwright)
- [axe-core source, version 4.14.0](https://github.com/dequelabs/axe-core/tree/v4.14.0)
- [Engine bundled notices, version 4.14.0](https://github.com/dequelabs/axe-core/blob/v4.14.0/LICENSE-3RD-PARTY.txt)
- [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/)
- [Mozilla's MPL FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)
