<script setup lang="ts">
import { useTranslation } from 'i18next-vue'
import type { PlanDraft } from '../document/plan-draft'

defineProps<{
  cases: PlanDraft['cases']
}>()

const { t } = useTranslation()
</script>

<template>
  <section class="card mb-3 shadow-sm" aria-labelledby="case-references-heading">
    <div class="card-body">
      <h2 id="case-references-heading" class="h5">{{ t('editor.caseReferences') }}</h2>
      <ul class="mb-0">
        <li v-for="caseReference in cases" :key="caseReference.path" class="font-monospace">{{ caseReference.path }}</li>
      </ul>
    </div>
  </section>
</template>
