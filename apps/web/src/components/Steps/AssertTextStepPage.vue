<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import LocaleOverridesTab from './LocaleOverridesTab.vue';

interface LocaleOverride {
  locale: string;
  value: string;
}

const props = defineProps<{
  expected: string;
  index: number;
  name: string;
  role: string;
  timeout: unknown;
  overrides: LocaleOverride[];
}>();
const emit = defineEmits<{
  'add:override': [];
  'edit:override': [override: LocaleOverride];
  'remove:override': [override: LocaleOverride];
  'update:expected': [expected: string];
  'update:locator': [locator: { name?: string; role: string }];
  'update:timeout': [timeout: number | string];
}>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'locales' | 'overrides'>('default');
const role = ref(props.role);
const name = ref(props.name);
const expected = ref(props.expected);

watch(() => props.role, (value) => { role.value = value; });
watch(() => props.name, (value) => { name.value = value; });
watch(() => props.expected, (value) => { expected.value = value; });

/*
Emits the current locator fields from the dedicated Assert text page.
---
Inputs: A changed Role or Accessible name field.
---
Output: A replacement role/name locator.
*/
function updateLocator(): void {
  emit('update:locator', { name: name.value || undefined, role: role.value });
}

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
  <section aria-label="Assert text step details">
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'default' }]" type="button" @click="selectedTab = 'default'">{{ t('editor.defaultTab') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'overrides' }]" type="button" @click="selectedTab = 'overrides'">{{ t('editor.overridesTab') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'locales' }]" type="button" @click="selectedTab = 'locales'">{{ t('editor.localeOverrides') }}</button>
      </li>
    </ul>
    <section v-if="selectedTab === 'default'">
      <label class="form-label" :for="`assert-text-role-${props.index}`">Role</label>
      <input :id="`assert-text-role-${props.index}`" v-model="role" class="form-control" required @change="updateLocator" />
      <label class="form-label mt-3" :for="`assert-text-name-${props.index}`">Accessible name</label>
      <input :id="`assert-text-name-${props.index}`" v-model="name" class="form-control" @change="updateLocator" />
      <label class="form-label mt-3" :for="`assert-text-expected-${props.index}`">Expected text</label>
      <input :id="`assert-text-expected-${props.index}`" v-model="expected" class="form-control" required @change="emit('update:expected', expected)" />
    </section>
    <section v-else-if="selectedTab === 'overrides'">
      <label class="form-label" :for="`assert-text-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
      <input :id="`assert-text-timeout-${props.index}`" class="form-control" min="1" type="number" :value="props.timeout" @input="emit('update:timeout', readTimeout($event))" />
    </section>
    <LocaleOverridesTab v-else :overrides="props.overrides" @add="emit('add:override')" @edit="emit('edit:override', $event)" @remove="emit('remove:override', $event)" />
  </section>
</template>
