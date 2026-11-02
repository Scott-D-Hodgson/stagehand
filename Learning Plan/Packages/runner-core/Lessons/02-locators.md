# Lesson 2: Locators

> “How does runner-core turn a Stagehand locator into exactly one browser target?” — Larry “Locator Lookout” Lewis, Developer

The current locator forms are role, label, CSS, and XPath. Role and label names match exactly. `resolveUniqueLocator` waits for one match, fails immediately on multiple matches, and retries a missing target up to three attempts when the timeout allows.

A locator is an address, not an action. Finding exactly one door does not mean Stagehand has opened it yet. Actions reuse locator resolution and then spend the remaining shared timeout on browser actionability or reading.

## Try it

Follow [`locators.ts`](../../../../packages/runner-core/src/locators.ts) and its tests. Compare the missing, unique, and ambiguous outcomes.

## You are ready when

- You can explain exact matching and ambiguity failure.
- You know how retry gaps fit inside the total timeout.

