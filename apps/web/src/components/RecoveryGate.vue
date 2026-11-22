<script setup lang="ts">
import { useTranslation } from 'i18next-vue'
import type { RecoveryGateState } from '../recovery/recovery-gate'

const props = defineProps<{ pending: boolean; state: RecoveryGateState }>()
const emit = defineEmits<{ discard: []; continue: [] }>()
const { t } = useTranslation()
</script>

<template>
  <section v-if="state.kind === 'loading'" class="card shadow-sm" aria-live="polite">
    <div class="card-body">{{ t('editor.checkingRecovery') }}</div>
  </section>
  <section v-else-if="state.kind === 'unreadable'" class="card border-warning shadow-sm" aria-labelledby="recovery-heading">
    <div class="card-body">
      <h1 id="recovery-heading" class="h5">{{ t('editor.unreadableRecovery') }}</h1>
      <p>{{ t('editor.unreadableRecoveryDetail') }}</p>
      <div class="btn-group btn-group-sm" role="group">
        <button class="btn btn-outline-danger" :disabled="pending" type="button" @click="emit('discard')">{{ pending ? t('editor.discardingRecovery') : t('editor.discardRecovery') }}</button>
      </div>
    </div>
  </section>
  <section v-else-if="state.kind === 'unavailable'" class="card border-warning shadow-sm" aria-labelledby="recovery-heading">
    <div class="card-body">
      <h1 id="recovery-heading" class="h5">{{ t('editor.recoveryUnavailable') }}</h1>
      <p>{{ t('editor.recoveryUnavailableDetail') }}</p>
      <div class="btn-group btn-group-sm" role="group">
        <button class="btn btn-outline-primary" type="button" @click="emit('continue')">{{ t('editor.continueWithoutRecovery') }}</button>
      </div>
    </div>
  </section>
</template>
