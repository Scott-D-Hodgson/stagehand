<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

const props = defineProps<{ editing: boolean; idPrefix: string; scrollIntoView: boolean }>();
const emit = defineEmits<{ 'update:scroll-into-view': [enabled: boolean] }>();
const { t } = useTranslation();

/*
Emits the selected scrolling behaviour from the override checkbox.
---
Inputs: A checkbox change event.
---
Output: The replacement enabled state.
*/
function updateScrollIntoView(event: Event): void {
  emit('update:scroll-into-view', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <div
    v-if="props.editing"
    class="form-check mt-3"
  >
    <input
      :id="`${props.idPrefix}-scroll-into-view`"
      :checked="props.scrollIntoView"
      class="form-check-input"
      type="checkbox"
      @change="updateScrollIntoView"
    />
    <label
      class="form-check-label"
      :for="`${props.idPrefix}-scroll-into-view`"
    >{{ t('editor.scrollIntoView') }}</label>
  </div>
  <template
    v-else
  >
    <dt>{{ t('editor.scrollIntoView') }}</dt>
    <dd
      class="mb-0"
    >{{ props.scrollIntoView ? t('editor.enabled') : t('editor.disabled') }}</dd>
  </template>
</template>
