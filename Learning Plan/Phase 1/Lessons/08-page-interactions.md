# Lesson 8: Locators, waits, and actions

> “How does Stagehand find one target and interact with it predictably?” — Wade “Wait-and-Work” Wilson, Developer

Locators identify one role, label, CSS, or XPath target. Multiple matches fail; missing targets retry within a bounded timeout. Wait lists run in order before or after interactions.

Current actions navigate, click, type characters, fill fields, and select one option. Locator lookup and the browser operation share a timeout. Scrolling is normally automatic but can be disabled.

## Try it

Trace a click with a before locator wait and an after network-idle wait. Mark every failure point.

## You are ready when

- You can explain unique locator resolution.
- You can distinguish type, fill, and option selection.

