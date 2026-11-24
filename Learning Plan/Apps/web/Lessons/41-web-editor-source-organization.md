# Lesson 41: Web editor source organization

[Previous: M11 configuration round trips](40-m11-configuration-round-trips.md) · [Course outline](../README.md) · [Next: Plan-level variable foundations](42-plan-level-variable-foundations.md)

## Goal

Understand how the editor's directory structure communicates ownership without
turning every helper into a component or a global utility.

## Three useful boundaries

Vue presentation belongs in `src/components/`, grouped by the feature it
describes. Plan, Case, Step, and Wait components retain their route pages,
details, dialogs, models, and feature-local controls close to that feature.
Generic visual controls belong in `components/controls/`.

`src/services/` contains shared application and document behaviour. For
example, `planDraftService` changes a document draft and
`validationService` asks the shared schema package whether it is valid. They
are not owned by one presentation feature.

`src/modules/` contains bounded capabilities that do have a feature owner.
Recovery owns IndexedDB storage and recovery controls; portable bundles own
archive import/export; accessibility owns its rule catalogue; preferences own
remembered interface choices. A module may contain data, services, tests, and
controls when all of them serve that capability.

## Try it

1. Find the route page for an Assert text Step under `components/steps/assert/`.
2. Find the draft update it uses in `services/planDraftService.ts`.
3. Find the portable ZIP boundary under `modules/portableBundle/`.
4. Explain why moving the ZIP codec into `services/` would hide its feature
   ownership.

## You are ready when

- You can decide whether a new file belongs to a feature component, module, or
  shared service.
- You can explain why a feature-local helper should not be promoted to a global
  service without a second consumer.
- You can locate an editor route page without searching the entire source tree.

[Previous: M11 configuration round trips](40-m11-configuration-round-trips.md) · [Course outline](../README.md) · [Next: Plan-level variable foundations](42-plan-level-variable-foundations.md)
