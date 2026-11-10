<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{
  name: string;
  prefix: string;
  role: string;
  validationMessage?: string;
  validationVisible: boolean;
}>();

const emit = defineEmits<{
  blur: [];
  'update:name': [name: string];
  'update:role': [role: string];
}>();

const { t } = useTranslation();
const roleInput = ref<HTMLInputElement>();

/*
Focuses the locator Role field after its containing dialog opens.
---
Inputs: None.
---
Output: Focus on the Role field when it is available.
*/
function focusRoleInput(): void {
  roleInput.value?.focus();
}

defineExpose({ focusRoleInput });
</script>

<template>
  <label class="form-label" :for="`${props.prefix}-role`">{{ t('editor.role') }}</label>
  <input
    :id="`${props.prefix}-role`"
    ref="roleInput"
    :value="props.role"
    class="form-control"
    :class="{ 'is-invalid': props.validationVisible && props.validationMessage !== undefined }"
    required
    @blur="emit('blur')"
    @input="emit('update:role', ($event.target as HTMLInputElement).value)"
  />
  <div v-if="props.validationVisible && props.validationMessage" class="invalid-feedback d-block">{{ props.validationMessage }}</div>
  <label class="form-label mt-3" :for="`${props.prefix}-name`">{{ t('editor.accessibleName') }}</label>
  <input
    :id="`${props.prefix}-name`"
    :value="props.name"
    class="form-control"
    @input="emit('update:name', ($event.target as HTMLInputElement).value)"
  />
</template>
