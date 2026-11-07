<script setup lang="ts">
import { validateEditorPlan } from './document/validation'

const bundledPlan = {
  version: 1,
  id: 'editor-foundation',
  cases: [],
}

const validation = validateEditorPlan(bundledPlan)
const validationSummary = validation.valid
  ? 'The bundled sample satisfies the shared plan contract.'
  : `${validation.issues.length} validation issue(s) found in the bundled sample.`
</script>

<template>
  <div class="min-vh-100 bg-body">
    <header class="border-bottom bg-body-tertiary">
      <div class="container py-3">
        <p class="mb-0 fw-semibold">Stagehand editor</p>
      </div>
    </header>

    <main class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <p class="text-body-secondary">M8 editor foundation</p>
          <h1 class="mb-3">Plan authoring starts here.</h1>
          <p class="lead">
            The editor will help authors create valid Stagehand plans without hand-editing JSON.
          </p>

          <section class="card shadow-sm" aria-labelledby="contract-status-heading">
            <div class="card-body">
              <h2 id="contract-status-heading" class="h5">Shared contract</h2>
              <p class="mb-0" aria-live="polite">{{ validationSummary }}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
