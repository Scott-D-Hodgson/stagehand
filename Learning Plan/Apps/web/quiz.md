# Web editor course skill check

Use this quiz after completing the web editor course. Check answers against the application source and the linked work-plan documents rather than relying on memory alone.

1. Why does the web build build `@stagehand/plan-schema` before Vite bundles the editor?
2. Why must the browser editor use the public schema entry instead of the Node-side plan engine?
3. What extra flag and development-environment step make a Vite server reachable from the host browser?
4. What does the first Vitest test establish, and what does it not establish?
5. Which existing contract field is the first editable M8.2 field, and what now supplies its supported UI choices?
6. Name the four kinds of data that must not be confused as M8 develops.
7. What information does the v1 recovery record contain, and why is an unsupported stored record not deleted automatically?
8. Why must the recovery gate run before autosave?
9. What does the current M9 case-reference dialog save, and what does it not create?
10. Why does the Click-step dialog show a dedicated Role message instead of all schema failures for every locator alternative?
11. Which Type-step fields are currently authorable, and how can its text refer to a Plan variable?
12. Why do dedicated Step pages keep their locator and action-specific fields together instead of adding another shared form component?
13. Why does the Select option dialog use a Value-or-Label mode rather than show both fields at once?
14. What is the current Assert text expected-value shape, and how does its Locale overrides panel select the value previewed on the card?
15. How does Assert HTML reuse the localized expected-value pattern while preserving practical HTML authoring?
16. How does Assert value use localized expected values, and which optional contract check remains deferred?
17. Why does step reordering use a copied list and stable card keys rather than list indexes?
18. Why does the editor use one expandable case-reference workspace at a time, and what must a collapsed card still communicate?
19. Why does selected-step validation map shared issue paths to step indexes instead of showing every schema message on a card?
20. Why does a two-tab save conflict now require a blocking resolution dialog instead of an inline warning?
21. What does the M10.1 portable bundle codec validate, and what browser workflow does it deliberately not provide?
22. Why does M10.2 keep a valid imported bundle separate from active editor state until confirmation?
23. Why does M10.3 prepare and validate the portable ZIP before it asks for a download filename?
24. Why does Edit/View mode belong to temporary interface state rather than a plan or recovery record?
25. What does the M10 round-trip walkthrough establish that isolated import and export tests cannot?
26. Why can a case override viewport and time zone but not headless mode, and why does enabling the override begin with copied plan values?
27. Why should `StepReferences` coordinate ordered data and dialogs while step-detail components compose their cards?
28. What is the difference between enabling accessibility scans and failing on violations, and how do plan and case rule-tag selections differ?
29. What is the timeout precedence for an action or assertion, and why does an omitted plan timeout still display 30,000 ms in the editor?
30. Why does View mode preserve the selected tab while replacing form controls with read-only summaries?
31. Why does the editor Pages project build from the repository root, and which files must its build-watch paths include?
32. Why does route-specific Plan, Case, and Step authoring avoid nested-card density, and where does temporary View/Edit state belong?
33. Why must an icon-only editor action keep a localized accessible name even when it has no visible text?
34. Why does a Step page use plain summaries instead of disabled controls in View mode?
35. Which supported Step types can author Before and After waits, and why does the editor omit Timeout for a Delay wait while retaining independent timeouts for Locator and Page-state waits?
36. Why does the editor omit `soft` for a Hard assertion and store it only for a Soft assertion?
37. Why does the editor omit `scrollIntoView` when interaction scrolling is enabled, and which actions currently expose that override?
38. Why does Wait removal require a confirmation dialog before changing a Before or After list?
39. Which plan-variable types support localized literal values, and which Step fields can currently select a Plan variable?
40. What happens when a Plan variable with existing references is renamed or removed, and why might protection be conservative?

## Answer key

1. The editor consumes the built public schema package; building it first keeps the browser bundle aligned with the shared validation contract.
2. The schema package validates values without filesystem work. The plan engine is Node-side and owns file loading, containment, and fingerprints.
3. Start Vite with `--host 0.0.0.0`, then forward port 5173 and use the forwarded URL.
4. It establishes that the editor validation boundary accepts a minimal valid plan and rejects one missing `cases`. It does not establish form behaviour, accessibility, browser storage, or recovery.
5. `defaults.locale` is the first editable field. Its select uses the maintained JSON locale catalogue, which is separate from the editor interface-language choices; an out-of-catalogue recovered value remains visible rather than being silently changed.
6. Exportable contract data, incomplete form values, interface state, and local preferences.
7. It contains the raw plan draft, a non-negative revision, and an ISO 8601 saved time. An unsupported record may still contain recoverable user work, so it remains unreadable until a later explicit discard choice.
8. Otherwise, the bundled sample could overwrite a recovery record before the person can restore or discard it.
9. It saves an editable `cases[].path` value in the in-memory and recoverable plan draft. It does not create, read, or export a case JSON document.
10. The current form can author only the Role/Accessible-name locator shape. Showing failures for unsupported `label`, `css`, and `xpath` alternatives would be misleading. The editor therefore gives one localized Role message, while full shared-schema validation still checks saved case content.
11. The form authors Role, an optional Accessible name, and either literal Text or a selected Plan-variable reference. Apply stores the reference as `{ "var": "name" }` rather than embedding its resolved value.
12. A dedicated Step page has one action-specific editing context. Keeping its locator and action-specific fields together makes the editable and read-only presentations easier to understand without introducing a second form-owner boundary.
13. A Select option contract step must contain exactly one selection form. The mode presents either Value or Label and ensures the saved step has one field, never both. Either field can hold a literal or Plan-variable reference.
14. Assert text saves a literal `expected.default` and may add an `expected.locales` map through its dedicated Step page's Locales tab. A matching Plan Locale emphasizes that override; otherwise the default is emphasized. Interface language does not select the expected value.
15. Assert HTML retains its literal `expected.default` and optional `expected.locales` map, Step-page Locale management, and Plan-Locale preview. Its base and override inputs are multiline because HTML commonly contains markup over multiple lines.
16. Assert value authors a Role/Accessible-name locator, literal `expected.default`, and optional `expected.locales` values through its dedicated Step page's Locales tab. Its optional associated-label check is not authorable yet because the conditional form needs a separate design decision.
17. A copied list preserves the prior draft for callers and lets the existing recovery path observe one normal draft update. Stable keys let Vue identify the same cards after their positions change, so it can animate the cards moving instead of treating them as unrelated indexed content.
18. One workspace at a time keeps the editing context clear and avoids a long page of simultaneous forms. A collapsed card still identifies its reference and communicates its localized step count; the header exposes its expanded state to assistive technology.
19. The schema can report several low-level alternative-branch failures for one incomplete step. Mapping its paths to unique indexes lets the editor show one concise, localized, actionable message on each affected card and a danger border on the enclosing case.
20. A paused local draft can otherwise be missed below the fold while the author continues to edit stale state. The static dialog puts the choice in focus and prevents further page actions until the author discards the paused local edits or replaces the newer saved draft.
21. It accepts or produces one ZIP archive with root `plan.json` and case entries at the plan's referenced relative paths. It checks ZIP entry safety, JSON parsing, shared reference matching, and plan/case bundle validity. It deliberately does not open a file picker, replace the active draft, or trigger a browser download; later M10 slices own those user flows.
22. Selecting a valid archive does not prove the author meant to discard the currently loaded plan. M10.2 therefore keeps it as a candidate, then opens a static confirmation dialog before replacement. A rejected archive also uses a blocking dialog, so validation feedback cannot be missed below the fold and the active draft remains unchanged.
23. Filename choice cannot make an invalid plan/case bundle portable. M10.3 first prepares the ZIP through the shared codec, blocks invalid drafts with a localized dialog, then suggests a plan-derived filename for the valid browser download. The browser, rather than the editor footer, communicates the completed download; local recovery remains a separate concern.
24. It changes only how the current bundle is presented. Saving it in the plan would alter portable contract data, while saving it in recovery would make a momentary inspection preference part of draft-restoration behaviour. The toolbar therefore starts in Edit and keeps the mode in the current interface session only.
25. It checks the transitions between browser file selection, active draft replacement, editing, filename confirmation, browser download, re-import, recovery, conflicts, and localized dialog behaviour. Focused tests protect individual boundaries, but cannot by themselves demonstrate that the complete author workflow preserves the intended state.
26. Headless mode is selected when the run-wide Chromium process launches, while viewport and time zone can vary by case. Copying the effective plan values gives an explicit override a valid, understandable starting point rather than leaving fields blank.
27. `StepReferences` gives the editor one place for ordered immutable updates, dialogs, and recovery-facing events, while each step type keeps its own presentation, tabs, and route details close to the data it displays.
28. Enablement determines whether scans run; failure policy determines whether detected violations fail the execution. Plan tags use axe defaults when omitted or empty; a case inherits omitted tags, replaces them with a non-empty selection, or explicitly clears the inherited filter with an empty list.
29. A step timeout wins over a case timeout, which wins over a plan timeout; when none is stored, runner-core uses its 30,000 ms fallback. The editor displays that fallback so authors can understand execution behaviour without silently adding a plan setting to the portable document.
30. Retaining the selected tab preserves the author's current context. View mode changes the selected panel from authoring controls to a plain read-only summary without storing the temporary mode or tab choice in the plan or recovery record.
31. The editor is an npm workspace and its build first runs `npm ci` from the repository root, where the lockfile and workspace links are defined. Its watch paths include `apps/web/*`, `packages/plan-schema/*`, `package.json`, `package-lock.json`, and `tsconfig.base.json`, so changes that can affect the editor build trigger a preview while unrelated work does not.
32. Each route gives a phone-sized viewport one editing context: Plan cards link to Cases, and Case cards link to Steps instead of containing their descendant forms. View/Edit is temporary interface state, so it must not be stored in the portable plan, case, or recovery document.
33. A visible icon alone does not provide a reliable accessible name. The component keeps localized visually hidden text for assistive technology without adding separate interactive state or lifecycle handling.
34. Disabled controls still look like unavailable forms and make compact pages harder to scan. A definition list communicates inspection clearly while preserving the selected tab and leaving no editable control behind.
35. Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value can author Before and After waits. A fixed Delay wait needs only its duration; a timeout beside it can only make it fail earlier. Locator and Page-state waits instead need an independent bound while they await an external condition. The editor preserves, but does not display or edit, an imported version 1 Delay-wait timeout until the deliberate versioned change in [ATR-043](../../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-043.md).
36. Hard is the contract default, so omitting `soft` produces the smaller canonical representation without changing behaviour. Selecting Soft deliberately stores `soft: true`, which tells execution to record the failure and continue the case.
37. Enabled is the schema default, so omitting `scrollIntoView` preserves the canonical behaviour without adding redundant portable data. Click, Type, Fill, and Select option Step pages expose the override; disabling it stores `scrollIntoView: false`.
38. Removing a Wait is destructive and easy to invoke from a compact card. The static Bootstrap dialog makes the choice visible and requires an explicit confirmation, while Cancel preserves the list unchanged.
39. Text, Number, and Boolean variables can have localized literal values of the same type. Environment variables store a default environment-variable name. Type Text, Fill Value, and Select option Value or Label can select a Plan variable. Navigate's address can select a Text or environment variable, with the HTTP or HTTPS protocol stored separately; other supported Step fields remain later work.
40. An unambiguous rename updates matching Case and shared-Step references; removal is blocked and their paths are shown. Narrower definitions can shadow Plan variables, so ambiguous renames are blocked and removal can also be blocked by a same-named reference that resolves to a narrower definition.
