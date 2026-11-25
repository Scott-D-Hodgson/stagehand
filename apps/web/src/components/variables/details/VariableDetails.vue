<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { VariableDefinitionDraft } from '../../../services/planDraftService';

const props = defineProps<{
  definition: VariableDefinitionDraft;
  name: string;
  planLocale?: string;
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
    : String(activeLocale.value === undefined ? props.definition.default : props.definition.locales?.[activeLocale.value])
);

/*
Finds the authored locale matching the configured Plan locale.
---
Inputs: The Plan locale and variable locale overrides.
---
Output: The matching authored locale tag, if any.
*/
const activeLocale = computed(
  () => Object.keys(props.definition.locales ?? {}).find((locale) => locale.toLowerCase() === props.planLocale?.toLowerCase())
);
</script>

<template>
  <dl
    class="mb-0"
  >
    <dt
      class="h4 mb-2 text-primary"
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
    >{{ defaultValue }} <span
      v-if="activeLocale"
      class="badge rounded-pill text-bg-light"
    >{{ activeLocale }}</span></dd>
  </dl>
</template>
