<script setup lang="ts">
import { useTranslation } from 'i18next-vue'
import type { ValidationResult } from '@stagehand/plan-schema'

defineProps<{
  validation: ValidationResult
}>()

const { t } = useTranslation()
</script>

<template>
  <section class="card shadow-sm" aria-labelledby="contract-status-heading">
    <div class="card-body">
      <h2 id="contract-status-heading" class="h5">{{ t('editor.sharedContract') }}</h2>
      <p class="mb-0" aria-live="polite">{{ validation.valid ? t('editor.validPlan') : t('editor.invalidPlan', { count: validation.issues.length }) }}</p>
    </div>
  </section>
</template>
