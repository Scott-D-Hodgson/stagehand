# Lesson 2: Package architecture

> “Why is Stagehand divided into apps and reusable packages instead of one large project?” — Monica “Module Mapper” Morgan, Developer

A monorepo stores related apps and packages together while keeping responsibility boundaries. Apps provide user-facing entry points; packages provide reusable contracts and behaviour.

The important boundary is dependency direction: shared contracts should not depend on browser or filesystem code. For example, `plan-schema` remains usable by Node and browser consumers, while `plan-engine` owns Node file access and `runner-core` owns browser execution.

## Try it

Place a new filesystem containment check, JSON contract rule, and browser click implementation into the package that should own each one.

## You are ready when

- You can explain why a monorepo does not mean one undivided codebase.
- You can choose a package by responsibility rather than convenience.

