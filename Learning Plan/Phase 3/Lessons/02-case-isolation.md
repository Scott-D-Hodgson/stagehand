# Lesson 2: Case isolation

> “How do we stop one case's cookies and page state from leaking into another?” — Cora “Context Captain” Chen, Developer

An isolated browser context is like a fresh private browser profile. Each case gets its own cookies, storage, and pages, so one case cannot quietly influence the next.

Isolation improves repeatability but costs resources. The runner must create and close these boundaries deliberately, including after failure.

## Try it

Describe a two-case test where shared cookies would create a false pass. Then show how separate contexts prevent it.

## You are ready when

You can identify what must be isolated per case and what may safely be shared for the run.
