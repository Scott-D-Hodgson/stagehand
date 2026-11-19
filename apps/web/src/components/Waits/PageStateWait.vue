<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import type { PageStateWaitDraft } from './wait-draft';

const props = defineProps<{ editing: boolean; idPrefix: string; item: PageStateWaitDraft }>();
const emit = defineEmits<{ update: [item: PageStateWaitDraft] }>();
const { t } = useTranslation();
</script>

<template>
  <template v-if="props.editing">
    <label class="form-label" :for="`${props.idPrefix}-state`">{{ t('editor.waitForState') }}</label>
    <select :id="`${props.idPrefix}-state`" class="form-select" :value="props.item.waitForState" @change="emit('update', { ...props.item, waitForState: ($event.target as HTMLSelectElement).value as 'domcontentloaded' | 'networkidle' })">
      <option value="domcontentloaded">domcontentloaded</option>
      <option value="networkidle">networkidle</option>
    </select>
  </template>
  <dl v-else class="mb-0">
    <dt>{{ t('editor.waitForState') }}</dt>
    <dd class="mb-0">{{ props.item.waitForState }}</dd>
  </dl>
</template>
