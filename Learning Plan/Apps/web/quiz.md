# Web editor course skill check

Use this quiz after completing the web editor course. Check answers against the application source and the linked work-plan documents rather than relying on memory alone.

1. Why does the web build build `@stagehand/plan-schema` before Vite bundles the editor?
2. Why must the browser editor use the public schema entry instead of the Node-side plan engine?
3. What extra flag and development-environment step make a Vite server reachable from the host browser?
4. What does the first Vitest test establish, and what does it not establish?
5. Which unresolved M8.2 decision must be made before basic form editing begins?
6. Name the four kinds of data that must not be confused as M8 develops.

## Answer key

1. The editor consumes the built public schema package; building it first keeps the browser bundle aligned with the shared validation contract.
2. The schema package validates values without filesystem work. The plan engine is Node-side and owns file loading, containment, and fingerprints.
3. Start Vite with `--host 0.0.0.0`, then forward port 5173 and use the forwarded URL.
4. It establishes that the editor validation boundary accepts a minimal valid plan and rejects one missing `cases`. It does not establish form behaviour, accessibility, browser storage, or recovery.
5. Choose an existing first editable contract field or explicitly permit editing an identifier; do not invent a title or description.
6. Exportable contract data, incomplete form values, interface state, and local preferences.
