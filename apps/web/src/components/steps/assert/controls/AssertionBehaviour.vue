<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

const props = defineProps<{ editing: boolean; idPrefix: string; soft: boolean }>();
const emit = defineEmits<{ 'update:soft': [soft: boolean] }>();
const { t } = useTranslation();
</script>

<template>
  <section
    :aria-labelledby="`${props.idPrefix}-behaviour-heading`"
    class="mt-4"
  >
    <h3
      :id="`${props.idPrefix}-behaviour-heading`"
      class="h5"
    >{{ t('editor.assertionBehaviour') }}</h3>
    <template
      v-if="props.editing"
    >
      <div
        class="form-check"
      >
        <input
          :id="`${props.idPrefix}-hard`"
          class="form-check-input"
          :name="`${props.idPrefix}-assertion-behaviour`"
          type="radio"
          :checked="!props.soft"
          @change="emit('update:soft', false)"
        />
        <label
          class="form-check-label"
          :for="`${props.idPrefix}-hard`"
        >{{ t('editor.hardAssertion') }}</label>
        <div
          class="form-text"
        >{{ t('editor.hardAssertionHelp') }}</div>
      </div>
      <div
        class="form-check mt-3"
      >
        <input
          :id="`${props.idPrefix}-soft`"
          class="form-check-input"
          :name="`${props.idPrefix}-assertion-behaviour`"
          type="radio"
          :checked="props.soft"
          @change="emit('update:soft', true)"
        />
        <label
          class="form-check-label"
          :for="`${props.idPrefix}-soft`"
        >{{ t('editor.softAssertion') }}</label>
        <div
          class="form-text"
        >{{ t('editor.softAssertionHelp') }}</div>
      </div>
    </template>
    <dl v-else class="mb-0">
      <dt>{{ t('editor.assertionBehaviour') }}</dt>
      <dd class="mb-0">{{ props.soft ? t('editor.softAssertion') : t('editor.hardAssertion') }}</dd>
    </dl>
  </section>
</template>
