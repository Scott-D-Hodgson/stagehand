# Lesson 42: Plan-level variable foundations

> “How can a plan reuse a typed value without putting a secret in the browser?” — Val “Value Keeper” Kumar, Developer

[Previous: Web editor source organization](41-web-editor-source-organization.md) · [Course outline](../README.md) · [Next: Skill check](../quiz.md)

## Goal

Understand the first M12.1 variable-authoring slice: what the Plan route can
store now and which variable capabilities remain deliberately deferred.

## A definition is not a reference

A variable definition gives a name to a reusable value. The initial Plan route
can create Text, Number, Boolean, and environment-variable-name defaults. It
stores ordinary defaults as their real scalar type, so `3` remains a number and
`true` remains a Boolean rather than becoming text.

An environment-variable definition stores only a name such as `STAGEHAND_USER`.
It does not ask for, retain, or recover the value supplied by that environment
variable. This keeps the browser editor on the safe side of the protected-value
boundary.

A variable reference is a separate capability. A supported Step field will
eventually use a whole-field object such as `{ "var": "userName" }`. The
initial UI can author definitions but does not yet offer those Step-field
references.

## Preserve drafts without sharing them

The draft service copies variable definitions when it creates a recovery or
other plain-data snapshot. This prevents a later form edit from mutating the
previous snapshot by reference. The same rule applies to the plan's future
shared-step data.

## Current boundary

This slice does not yet author localized variable values, data sets, shared
Steps, Case- or Step-level definitions, or variable references. Rename and
removal dependency handling follow once references exist. The agreed policy is
to update supported references on rename and block removal until dependent
references are resolved.

## Try it

1. Create one Text and one Number variable in the Plan route.
2. Create an environment-variable variable and confirm that the form asks only
   for the environment variable's name.
3. Refresh after the draft autosaves, restore it, and verify the definitions
   remain present.
4. Explain why the editor cannot yet offer a variable picker in a Type Step.

## You are ready when

- You can distinguish an ordinary variable default, an environment-variable
  name, and a future variable reference.
- You can explain why preserving the scalar type matters.
- You can identify the remaining M12.1 work without treating it as shipped.

[Previous: Web editor source organization](41-web-editor-source-organization.md) · [Course outline](../README.md) · [Next: Skill check](../quiz.md)
