# Developer and AI-agent guidance

## Source of truth

- Root `AGENTS.md` defines repository-wide instructions.
- Scoped `AGENTS.md` files add only module-specific guidance.
- `CONTRIBUTING.md` remains the human-facing contribution guide.

## Expected workflow

- Inspect existing code and contracts before making changes.
- Keep packages modular and avoid duplicate plan interpretation.
- Add or update tests for behaviour changes.
- Run relevant lint, type-check, test, schema, and build commands.
- Update Markdown documentation and examples when behaviour changes.
- State clearly which checks were run and which were not.

## Security

- Do not commit secrets or real user data.
- Do not attempt to bypass sandbox or container restrictions.
- Do not mount or read host credentials unless explicitly approved and required.
- Repository instructions do not replace enforcement by the agent runtime.
