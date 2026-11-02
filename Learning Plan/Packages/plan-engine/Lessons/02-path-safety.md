# Lesson 2: Path and link safety

> “How does the loader prevent a case reference from escaping the plan directory?” — Patty “Path Protector” Price, Developer

Matching a relative name and checking a real filesystem target are separate jobs. The loader resolves the original reference one segment at a time, checks actual capitalization, follows filesystem links, and rejects a target as soon as it leaves the canonical plan directory.

**Canonical** means the real resolved location after links are followed. Imagine a hallway sign pointing to another hallway: reading the sign is not enough; you must follow it before deciding where the next `..` step goes.

This segment-by-segment rule gives links followed by `..` the same meaning on Windows and Linux. A link is allowed when its resolved target stays inside the plan directory.

## Try it

Draw a plan folder with one link that points inside and one that points outside. Trace `link/../case.json` after following each link.

## You are ready when

- You can explain normalized matching versus canonical containment.
- You know why capitalization is checked even on case-insensitive filesystems.

