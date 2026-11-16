<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{
  index: number;
  timeout: unknown;
  url: string;
}>();
const emit = defineEmits<{ 'update:timeout': [timeout: number | string]; 'update:url': [url: string] }>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides'>('default');
const timeoutWasBlurred = ref(false);
const url = ref(props.url);

watch(() => props.url, (value) => {
  url.value = value;
});

/*
Reads a raw timeout override without coercing an empty field to zero.
---
Inputs: A timeout number-input event.
---
Output: A numeric timeout or raw empty text.
*/
function readTimeout(event: Event): number | string {
  const input = event.target as HTMLInputElement;
  return input.value === '' ? '' : Number(input.value);
}
</script>

<template>
  <section aria-label="Navigate step details">
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'default' }]" type="button" @click="selectedTab = 'default'">{{ t('editor.defaultTab') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'overrides' }]" type="button" @click="selectedTab = 'overrides'">{{ t('editor.overridesTab') }}</button>
      </li>
    </ul>
    <section v-if="selectedTab === 'default'">
      <label class="form-label" :for="`navigate-url-${props.index}`">URL</label>
      <input :id="`navigate-url-${props.index}`" v-model="url" class="form-control" type="url" @change="emit('update:url', url)" />
    </section>
    <section v-else>
      <label class="form-label" :for="`navigate-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
      <input :id="`navigate-timeout-${props.index}`" :class="['form-control', { 'is-invalid': timeoutWasBlurred && (typeof props.timeout !== 'number' || props.timeout < 1) }]" min="1" type="number" :value="props.timeout" @blur="timeoutWasBlurred = true" @input="emit('update:timeout', readTimeout($event))" />
      <div v-if="timeoutWasBlurred && (typeof props.timeout !== 'number' || props.timeout < 1)" class="invalid-feedback d-block">{{ t('editor.stepTimeoutInvalid') }}</div>
    </section>
  </section>
</template>
