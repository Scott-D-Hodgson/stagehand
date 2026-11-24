<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { VariableDefinitionDraft } from '../../../services/planDraftService';

const props = defineProps<{
  definition: VariableDefinitionDraft;
  name: string;
}>();

const { t } = useTranslation();

/*
Determines the author-facing variable type from its default value.
---
Inputs: One plan-variable definition.
---
Output: A localized text, number, or boolean type name.
*/
const variableType = computed(
  () => typeof props.definition.default === 'boolean'
    ? t('editor.variableTypeBoolean')
    : typeof props.definition.default === 'number'
      ? t('editor.variableTypeNumber')
      : typeof props.definition.default === 'object'
        ? t('editor.variableTypeEnvironment')
        : t('editor.variableTypeText')
);

/*
Determines the visible default-value summary for a variable.
---
Inputs: One plan-variable definition.
---
Output: Its literal default or the selected environment-variable name.
*/
const defaultValue = computed(
  () => typeof props.definition.default === 'object'
    ? `$${props.definition.default.env}`
    : String(props.definition.default)
);
</script>

<template>
  <dl
    class="mb-0"
  >
    <dt
      class="h4 mb-2"
    >{{ props.name }}</dt>
    <dt
      class="visually-hidden"
    >{{ t('editor.variableType') }}</dt>
    <dd
      class="mb-1 text-body-secondary"
    >{{ variableType }}</dd>
    <dt
      class="visually-hidden"
    >{{ t('editor.defaultValue') }}</dt>
    <dd
      class="mb-0"
    >{{ defaultValue }}</dd>
  </dl>
</template>
