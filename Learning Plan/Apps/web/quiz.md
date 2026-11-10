# Web editor course skill check

Use this quiz after completing the web editor course. Check answers against the application source and the linked work-plan documents rather than relying on memory alone.

1. Why does the web build build `@stagehand/plan-schema` before Vite bundles the editor?
2. Why must the browser editor use the public schema entry instead of the Node-side plan engine?
3. What extra flag and development-environment step make a Vite server reachable from the host browser?
4. What does the first Vitest test establish, and what does it not establish?
5. Which existing contract field is the first editable M8.2 field, and why is its input kept raw?
6. Name the four kinds of data that must not be confused as M8 develops.
7. What information does the v1 recovery record contain, and why is an unsupported stored record not deleted automatically?
8. Why must the recovery gate run before autosave?
9. What does the current M9 case-reference dialog save, and what does it not create?
10. Why does the Click-step dialog show a dedicated Role message instead of all schema failures for every locator alternative?
11. Which Type-step fields are currently authorable, and which supported text form remains deferred?
12. Why is `LocatorFields.vue` shared by Click, Type, and Fill while their action-specific fields remain separate?
13. Why does the Select option dialog use a Value-or-Label mode rather than show both fields at once?

## Answer key

1. The editor consumes the built public schema package; building it first keeps the browser bundle aligned with the shared validation contract.
2. The schema package validates values without filesystem work. The plan engine is Node-side and owns file loading, containment, and fingerprints.
3. Start Vite with `--host 0.0.0.0`, then forward port 5173 and use the forwarded URL.
4. It establishes that the editor validation boundary accepts a minimal valid plan and rejects one missing `cases`. It does not establish form behaviour, accessibility, browser storage, or recovery.
5. `defaults.locale` is the first editable field. Its input stays raw so shared validation can report an invalid value without silently changing the user's draft.
6. Exportable contract data, incomplete form values, interface state, and local preferences.
7. It contains the raw plan draft, a non-negative revision, and an ISO 8601 saved time. An unsupported record may still contain recoverable user work, so it remains unreadable until a later explicit discard choice.
8. Otherwise, the bundled sample could overwrite a recovery record before the person can restore or discard it.
9. It saves an editable `cases[].path` value in the in-memory and recoverable plan draft. It does not create, read, or export a case JSON document.
10. The current form can author only the Role/Accessible-name locator shape. Showing failures for unsupported `label`, `css`, and `xpath` alternatives would be misleading. The editor therefore gives one localized Role message, while full shared-schema validation still checks saved case content.
11. The form authors Role, an optional Accessible name, and required literal Text. The shared contract also supports a variable reference for text, but variables and their authoring UI are deferred to M12.
12. The three forms now repeat the same Role/Accessible-name target behaviour, so one component keeps it consistent. Text and Value have different meanings and separate validation states, so their owning dialogs retain those fields.
13. A Select option contract step must contain exactly one selection form. The mode presents one required literal field at a time and ensures the saved step has either `value` or `label`, never both.
