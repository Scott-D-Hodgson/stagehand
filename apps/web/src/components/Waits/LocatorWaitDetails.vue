<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import type { LocatorWaitDraft } from './wait-draft';

const props = defineProps<{ editing: boolean; idPrefix: string; item: LocatorWaitDraft }>();
const emit = defineEmits<{ update: [item: LocatorWaitDraft] }>();
const { t } = useTranslation();

/*
Updates one locator field while preserving the rest of the wait draft.
---
Inputs: A locator role or accessible-name field and its raw text.
---
Output: A replacement locator wait draft.
*/
function updateLocator(field: 'name' | 'role', value: string): void {
  const locator = { ...props.item.waitFor, [field]: value };
  if (field === 'name' && value === '') {
    delete locator.name;
  }
  emit('update', { ...props.item, waitFor: locator });
}
</script>

<template>
  <template v-if="props.editing">
    <label class="form-label" :for="`${props.idPrefix}-role`">{{ t('editor.role') }}</label>
    <input :id="`${props.idPrefix}-role`" class="form-control" :value="props.item.waitFor.role" @input="updateLocator('role', ($event.target as HTMLInputElement).value)" />
    <label class="form-label mt-3" :for="`${props.idPrefix}-name`">{{ t('editor.accessibleName') }}</label>
    <input :id="`${props.idPrefix}-name`" class="form-control" :value="props.item.waitFor.name" @input="updateLocator('name', ($event.target as HTMLInputElement).value)" />
  </template>
  <dl v-else class="mb-0">
    <dt>{{ t('editor.role') }}</dt>
    <dd>{{ props.item.waitFor.role }}</dd>
    <dt>{{ t('editor.accessibleName') }}</dt>
    <dd class="mb-0"><template v-if="props.item.waitFor.name">{{ props.item.waitFor.name }}</template><template v-else>&mdash;</template></dd>
  </dl>
</template>
