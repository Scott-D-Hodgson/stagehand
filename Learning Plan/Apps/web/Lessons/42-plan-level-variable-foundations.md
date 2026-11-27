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

A variable reference is a separate capability. Navigate, Type, Fill, and Select option
Steps can select a Plan variable and save a whole-field object such as
`{ "var": "userName" }`.
Other supported Step fields still need their authoring controls.

Navigate stores a `protocol` of `https://` or `http://` separately from its
`url` address. The selector defaults to HTTPS. Enter an address such as
`example.test/sign-in` without a protocol, or choose a Text or environment
Plan variable containing that address. Boolean and Number variables are not
offered. Bundle validation checks known variable definitions, and preparation
checks the resolved type and address before execution. The runner joins the
protocol and resolved address; environment values are supplied to preparation,
not stored by the editor. An address still needs a valid host.

## Preserve drafts without sharing them

The draft service copies variable definitions when it creates a recovery or
other plain-data snapshot. This prevents a later form edit from mutating the
previous snapshot by reference. The same rule applies to the plan's future
shared-step data.

## Current boundary

The Variable page can add, edit, and remove localized literal values for Text,
Number, and Boolean variables. Its card previews the matching Plan locale,
falling back to the default otherwise. The default form applies changes only
after Apply, and leaving with unapplied edits requests confirmation. The
Environment form continues to accept only an environment-variable name.

This slice does not yet author data sets, shared Steps, Case- or Step-level
definitions, or references in other Step fields. Imported Cases and shared Steps may
already contain references. An unambiguous Plan-variable rename updates
matching references, and removal is blocked with their document paths while
matches remain. The check is conservative: a same-named reference may be
reported even when a narrower definition shadows the Plan variable. A rename
is also blocked if narrower definitions make its effect ambiguous. Variable
cards count distinct matching Case Steps, and the Variable page links to them;
these counts are conservative for shadowed names and exclude shared-step
definitions.

## Try it

1. Create one Text and one Number variable in the Plan route.
2. Create an environment-variable variable and confirm that the form asks only
   for the environment variable's name.
3. Refresh after the draft autosaves, restore it, and verify the definitions
   remain present.
4. Add a locale value, change the Plan locale, and inspect the Variable card.
5. Edit the default without applying it and try to leave the Variable page.
6. Select the variable on a Type Step, apply it, and follow the matching Step
   link from the Variable page.
7. With a synthetic imported bundle that references a Plan variable, try its
   removal and inspect the paths shown before renaming it.
8. Add a Navigate step, choose HTTP and then HTTPS, and select a Text variable
   whose value is `example.test`. Confirm Number and Boolean variables are not
   offered. Apply, revisit the Step card, and check recovery and ZIP export.

## You are ready when

- You can distinguish an ordinary variable default, an environment-variable
  name, and a Type Step variable reference.
- You can explain why preserving the scalar type matters.
- You can explain how Navigate combines a protocol and address, and why its
  variable choices differ from Type and Fill.
- You can identify the remaining M12.1 work without treating it as shipped.

[Previous: Web editor source organization](41-web-editor-source-organization.md) · [Course outline](../README.md) · [Next: Skill check](../quiz.md)
