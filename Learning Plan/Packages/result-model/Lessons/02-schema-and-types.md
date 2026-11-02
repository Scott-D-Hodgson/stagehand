# Lesson 2: Schema and TypeScript

> “Why does the package contain both JSON Schema and TypeScript types?” — Tyler “Type Twin” Tate, Developer

TypeScript checks code while developers build it. JSON Schema checks actual values at runtime, including data read from JSON. They are two safety nets at different times.

Think of TypeScript as a drafting ruler used at the design desk and JSON Schema as the gauge at the receiving door. The ruler helps produce the intended shape; the gauge still checks what actually arrives.

The schema is normative for emitted JSON. Matching types make implementation work easier, but changing only a TypeScript interface does not change what runtime validation accepts.

## Try it

Find one required field in the schema and its matching TypeScript property. Explain what would happen if only one side changed.

## You are ready when

- You can describe compile-time versus runtime checking.
- You know why schema and types must be reviewed together.

