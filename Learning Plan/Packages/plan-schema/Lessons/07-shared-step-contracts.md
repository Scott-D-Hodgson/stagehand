# Lesson 7: Shared-step contracts

> “How can a case name a reusable group without accidentally creating a loop?” — Greta “Group Guardian” Grant, Developer

A shared-step group is a plan-level list of reusable steps with a stable `id`. An ordinary case calls it with a small marker step:

```json
{ "action": "callSharedSteps", "id": "sign-in" }
```

The package now checks the map, not the journey: IDs must be unique, every case call must name a known group, and a group cannot call another group. Group steps cannot define private variable defaults because they must eventually use the calling case's values.

Think of the group as a bookmarked page in a manual. A case may open that page, but the bookmarked page cannot open another bookmark and cannot bring its own private input form.

Expansion and execution are later work. This slice does not yet validate ordinary steps inside a group as executable steps, insert them into a case, or run them in a browser.

## Try it

Write one `sharedStepGroups` entry with ID `sign-in`, then write a case call to it. Identify the validation path for a call to `sign-inn`.

## You are ready when

- You can distinguish a stable group ID from a case's ordinary steps.
- You know why nested group calls and private group variables are rejected.
- You do not describe a validated call as executed behaviour.
