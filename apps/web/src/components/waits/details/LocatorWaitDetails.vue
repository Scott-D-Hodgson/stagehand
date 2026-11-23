<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { LocatorWaitDraft } from '../models/wait-draft';

const props = defineProps<{ editing: boolean; idPrefix: string; item: LocatorWaitDraft; validationRequested?: boolean }>();
const emit = defineEmits<{ update: [item: LocatorWaitDraft] }>();
const { t } = useTranslation();
const roleWasBlurred = ref(false);

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

/*
Marks the locator role field as ready to display validation feedback.
---
Inputs: The Role field blur event.
---
Output: Enables Role feedback for the local wait form.
*/
function validateRole(): void {
  roleWasBlurred.value = true;
}
</script>

<template>
  <template
    v-if="props.editing"
  >
    <label
      class="form-label"
      :for="`${props.idPrefix}-role`"
    >{{ t('editor.role') }}</label>
    <input
      :id="`${props.idPrefix}-role`"
      :class="['form-control', { 'is-invalid': (props.validationRequested || roleWasBlurred) && props.item.waitFor.role.trim() === '' }]"
      :value="props.item.waitFor.role"
      @blur="validateRole"
      @input="updateLocator('role', ($event.target as HTMLInputElement).value)"
    />
    <div
      v-if="(props.validationRequested || roleWasBlurred) && props.item.waitFor.role.trim() === ''"
      class="invalid-feedback d-block"
    >{{ t('editor.roleRequired') }}</div>
    <label
      class="form-label mt-3"
      :for="`${props.idPrefix}-name`"
    >{{ t('editor.accessibleName') }}</label>
    <input
      :id="`${props.idPrefix}-name`"
      class="form-control"
      :value="props.item.waitFor.name"
      @input="updateLocator('name', ($event.target as HTMLInputElement).value)"
    />
  </template>
  <dl v-else class="mb-0">
    <dt>{{ t('editor.role') }}</dt>
    <dd>{{ props.item.waitFor.role }}</dd>
    <dt>{{ t('editor.accessibleName') }}</dt>
    <dd class="mb-0"><template v-if="props.item.waitFor.name">{{ props.item.waitFor.name }}</template><template v-else>&mdash;</template></dd>
  </dl>
</template>
