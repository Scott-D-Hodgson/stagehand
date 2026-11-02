# Lesson 4: Azure Pipelines

> “How does a Stagehand result survive after a pipeline job ends?” — Piper “Pipeline Pilot” Powell, Developer

Azure Pipelines can run a command, inspect its exit code, and publish files as build artifacts. Publishing preserves the authoritative JSON result so it can be downloaded and reviewed later.

Pipeline integration is planned work. A JUnit report may be useful later, but it should be derived from—not replace—the Stagehand result.

## Try it

Sketch a pipeline with install, validate, run, and publish steps. Ensure publishing still occurs after a test failure.

## You are ready when

You can preserve results reliably without confusing pipeline status with the contents of the result document.
