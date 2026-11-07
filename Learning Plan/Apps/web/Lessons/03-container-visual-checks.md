# Lesson 3: Development-container visual checks

> “Why can the dev server be healthy while my desktop browser sees nothing?” — Portia “Port” Singh, Developer

[← Previous: browser-safe contracts](02-browser-safe-contracts.md) · [Course outline](../README.md) · [Next: focused editor tests →](04-focused-editor-tests.md)

A development container is a separate network environment. Vite may be running correctly at `localhost:5173` inside that container while the host browser has no route to it. Binding Vite to all container interfaces and forwarding the port bridges that gap for development.

Run the normal server with:

```bash
npm run dev --workspace @stagehand/web -- --host 0.0.0.0
```

Then forward port 5173 through the development environment and open the forwarded URL it provides. Do not treat that forwarding as a production hosting configuration; it is a local visual-check aid.

As screens become stable, an automated browser runner can capture a fixed screenshot for each named route and viewport. Keep each capture's route, viewport, browser, and commit metadata with it. This is useful visual history, but it is not a replacement for accessible, semantic, and behavioural tests.

## Try it

Start the server, forward port 5173, and identify the editor heading and shared contract status in the rendered shell. Stop the server when finished.

## You are ready when

- You can distinguish a container-local address from a forwarded browser URL.
- You can perform a local visual smoke check without changing production code.
- You know that automated browser coverage remains later work.

[← Previous: browser-safe contracts](02-browser-safe-contracts.md) · [Course outline](../README.md) · [Next: focused editor tests →](04-focused-editor-tests.md)
