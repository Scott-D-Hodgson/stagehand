# 2. Azure Pipelines and artifact-based integration

## Self-assessment: do I need this lesson?

- [ ] I can explain the purpose of a pipeline agent and a pipeline artifact.
- [ ] I know how a command's exit code affects a pipeline step.
- [ ] I can distinguish retaining JSON output from publishing test cases to a test-results interface.
- [ ] I understand why secrets should be configured through protected pipeline variables or a secret store.
- [ ] I can describe how to keep an example pipeline adaptable to the user's environment.

## What you will learn

- How Stagehand fits into a CI job at a conceptual level.
- How to run the CLI and retain its JSON result as an artifact.
- How to separate functional failures from pipeline plumbing failures.
- How to document values users must supply themselves.

## Core ideas

A CI pipeline runs steps on an agent. Stagehand's integration example should prepare the runtime, install the supported dependencies, invoke the CLI against a user-provided test/staging target, and retain the JSON result. A pipeline artifact is a named file or directory attached to a run so people can inspect or download it later.

Retaining a JSON file is not the same as publishing individual tests to Azure DevOps Test Results. The MVP does the former. JUnit-compatible conversion and test-view publishing are later work. Keep this distinction clear so users do not expect a dashboard integration that does not exist.

Pipeline examples are templates, not turnkey access to a user's systems. The user supplies target URLs, credentials, agent capabilities, and authorization. Store secrets using the provider's protected secret mechanism and map them into environment variables at runtime. Do not commit credentials or print them in logs.

## Apply this to Stagehand

The example should show where the plan file comes from, how the target is configured, how to pass CLI options, where the JSON result is written, and how that result is published. It should preserve the CLI exit code so failed tests cause the intended pipeline outcome. If the result file is useful even after a failure, configure artifact publication to run under the appropriate failure conditions.

Keep provider-specific YAML in examples/documentation rather than embedding Azure assumptions into the execution engine. Explain that the production warning is general and that the operator owns authorization, side effects, and costs. Phase 4 does not define production targeting or special acknowledgement.

## Exercise

Sketch pipeline stages for checkout, setup, secret mapping, Stagehand execution, and JSON artifact publication. Identify which step's failure should fail the job and how the JSON artifact remains available after a failed test run. Mark all environment-specific values as placeholders.

## You are ready when

- A reader can adapt the example without mistaking placeholders for real credentials or URLs.
- The CLI's outcome is reflected in pipeline status and its JSON result is retained.
- The example does not imply Azure Test Results publishing or a production-specific gate.

## Read next

- [Publish and download pipeline artifacts](https://learn.microsoft.com/en-us/azure/devops/pipelines/artifacts/pipeline-artifacts?view=azure-devops)
- [E06: CI/CD and external integrations](../../Planning/Backlog/epics/E06-integrations/README.md)
- [E03: Results and reporting](../../Planning/Backlog/epics/E03-results-and-reporting/README.md)
- [Phase 4 roadmap](../../Planning/Roadmap/Phase-4-reporting-integrations-and-adoption/README.md)

## Reinforcement quiz

1. What is the purpose of retaining Stagehand JSON as a pipeline artifact?
2. Does this MVP publish individual test cases into Azure DevOps Test Results?
3. Where should pipeline credentials come from?
4. Why should the pipeline preserve the CLI's exit status?
5. Who supplies the target URL and confirms authorization to test it?

<details>
<summary>Answer key</summary>

1. To retain and retrieve the structured run output associated with that pipeline run.
2. No. It retains JSON; test-results publishing and JUnit conversion are later work.
3. Protected pipeline secrets or an appropriate secret store, exposed to the process as needed.
4. So test outcomes affect automation accurately instead of being hidden by a later successful step.
5. The operator/user configuring the pipeline.

</details>
