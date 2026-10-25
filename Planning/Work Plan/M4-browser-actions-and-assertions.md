# M4 — Browser configuration, actions, and assertions

**Estimate:** 3–5 person-days  
**Depends on:** M2, M3  
**Roadmap item:** Browser configuration, action vocabulary, assertion semantics

## Tasks

- [ ] Review [ATR-003](../Backlog/epics/E01-plan-definition/stories/ATR-003.md) and the execution-related stories before fixing the contract.
- [ ] Define the MVP support matrix: Windows with Playwright-managed Chromium, using the Node.js version selected in M2; schedule Linux runner and Edge support after the MVP. During development, prefer designs that work on both Windows and Linux when practical.
- [ ] Record the initial runner target as Windows with Playwright-managed Chromium; branded Google Chrome is not a separate initial support target.
- [ ] Specify browser mode, timezone format, locale format, viewport units/ranges, defaults, and validation rules.
- [ ] Define URL navigation and optional bounded post-navigation waits, including the supported DOM-ready and network-idle states.
- [ ] Define selector-based item selection and click, character-by-character typing, direct field-value setting (Playwright `fill`-style), and dropdown option selection.
- [ ] Define optional pre/post action waits for selector existence, fixed delays, navigation states, and bringing an offscreen target into the viewport. Specify valid action combinations, execution order, timeout behaviour, and errors.
- [ ] Define markup assertions comparing selector-matched inner text or inner HTML with an expected value.
- [ ] Define input value assertions and optional soft checks for associated label inner text or inner HTML, including how label association is resolved and handled when absent.
- [ ] Keep reload/back/forward, standalone URL waits, distinct click variants, and additional assertion types (visibility, enabled/disabled, checked state, attributes, URL, and page title) out of MVP; track them in [ATR-042](../Backlog/epics/E02-execution-engine/stories/ATR-042.md).
- [ ] Define expected values, timeout behaviour, diagnostics, and hard/soft control-flow effects for each selected assertion.
- [ ] Encode the agreed precedence baseline: plan JSON supplies plan defaults, cases inherit plan values, explicit case values override inherited values, and CLI configuration overrides JSON at the targeted scope. Define the precise argument and variable-injection model.
- [ ] Update plan schema, examples, and invalid fixtures to represent the decisions.
- [ ] Represent accessibility configuration and scan behaviour consistently in the schema and examples: optional scans after each completed step, deduplicated finding collection, and plan defaults with case overrides. M6 defines how configured failure policies affect case/run outcomes and continuation.

## Completion evidence

- A plan author can determine valid settings and actions from the contract alone.
- The initial action set covers URL navigation, the requested selector-based interactions, bounded optional waits/delays, and viewport handling; each option's applicability and ordering are explicit.
- The initial assertions cover inner text/HTML and input value comparisons, with associated-label soft checks specified or explicitly deferred.
- Invalid settings and unknown actions fail clearly before execution where possible.
- Hard and soft assertion control flow is stated unambiguously. M6 defines how those outcomes map to test/run status and affect later execution.
- Examples and fixtures reflect the documented rules.

## Learning reference

[Browser configuration, action vocabulary, and assertion semantics](../../Learning%20Plan/Phase%201/04-browser-actions-and-assertions.md)
