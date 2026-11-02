# Lesson 1: Contracts

> “What promise does `plan-schema` make about Stagehand documents?” — Connie “Contract Curious” Carter, Developer

A **contract** is an agreed shape and meaning. Think of it as a form: it states which boxes exist, which are required, and what may be written in them. Stagehand's v1 plan and case contracts live in [`plan-v1.schema.json`](../../../../packages/plan-schema/src/plan-v1.schema.json) and [`case-v1.schema.json`](../../../../packages/plan-schema/src/case-v1.schema.json).

`schemaVersion: 1` identifies Stagehand's contract version. JSON Schema Draft 2020-12 is different: it is the language used to write the rules. One is the form's edition; the other is the grammar used to describe the form.

The schema says what a document may contain. It does not read a file, find a browser element, or prove a test will succeed.

## Try it

Find the required top-level fields in both schemas. Explain why plan and case documents each carry their own version.

## You are ready when

- You can distinguish Stagehand schema version 1 from JSON Schema Draft 2020-12.
- You can explain why a valid document is not necessarily executable.

