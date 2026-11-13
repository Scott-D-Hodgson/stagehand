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
11. Which Type-step fields are currently authorable, and which supported text form remains deferred?
12. Why is `LocatorFields.vue` shared by Click, Type, Fill, Select option, and the three current assertion forms while their action-specific fields remain separate?
13. Why does the Select option dialog use a Value-or-Label mode rather than show both fields at once?
14. What is the current Assert text expected-value shape, and how does its Locale overrides panel select the value previewed on the card?
15. How does Assert HTML reuse the localized expected-value pattern while preserving practical HTML authoring?
16. How does Assert value use localized expected values, and which optional contract check remains deferred?
17. Why does step reordering use a copied list and stable card keys rather than list indexes?
18. Why does the editor use one expandable case-reference workspace at a time, and what must a collapsed card still communicate?
19. Why does selected-step validation map shared issue paths to step indexes instead of showing every schema message on a card?
20. Why does a two-tab save conflict now require a blocking resolution dialog instead of an inline warning?
21. What does the M10.1 portable bundle codec validate, and what browser workflow does it deliberately not provide?

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
11. The form authors Role, an optional Accessible name, and required literal Text. The shared contract also supports a variable reference for text, but variables and their authoring UI are deferred to M12.
12. The seven forms repeat the same Role/Accessible-name target behaviour, so one component keeps it consistent. Their action-specific inputs have different meanings and validation states, so their owning dialogs retain those fields.
13. A Select option contract step must contain exactly one selection form. The mode presents one required literal field at a time and ensures the saved step has either `value` or `label`, never both.
14. Assert text saves a literal `expected.default` and may add an `expected.locales` map through its card-level Locale overrides panel. A matching Plan Locale emphasizes that override; otherwise the default is emphasized. Interface language does not select the expected value.
15. Assert HTML retains its literal `expected.default` and optional `expected.locales` map, card-level override management, and Plan-Locale preview. Its base and override inputs are multiline because HTML commonly contains markup over multiple lines.
16. Assert value authors a Role/Accessible-name locator, literal `expected.default`, and optional `expected.locales` values through its card-level Locale overrides panel. Its optional associated-label check is not authorable yet because the conditional form needs a separate design decision.
17. A copied list preserves the prior draft for callers and lets the existing recovery path observe one normal draft update. Stable keys let Vue identify the same cards after their positions change, so it can animate the cards moving instead of treating them as unrelated indexed content.
18. One workspace at a time keeps the editing context clear and avoids a long page of simultaneous forms. A collapsed card still identifies its reference and communicates its localized step count; the header exposes its expanded state to assistive technology.
19. The schema can report several low-level alternative-branch failures for one incomplete step. Mapping its paths to unique indexes lets the editor show one concise, localized, actionable message on each affected card and a danger border on the enclosing case.
20. A paused local draft can otherwise be missed below the fold while the author continues to edit stale state. The static dialog puts the choice in focus and prevents further page actions until the author discards the paused local edits or replaces the newer saved draft.
21. It accepts or produces one ZIP archive with root `plan.json` and case entries at the plan's referenced relative paths. It checks ZIP entry safety, JSON parsing, shared reference matching, and plan/case bundle validity. It deliberately does not open a file picker, replace the active draft, or trigger a browser download; later M10 slices own those user flows.
