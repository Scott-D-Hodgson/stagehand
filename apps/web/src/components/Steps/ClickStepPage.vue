<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{ index: number; name: string; role: string; timeout: unknown }>();
const emit = defineEmits<{ 'update:locator': [locator: { name?: string; role: string }]; 'update:timeout': [timeout: number | string] }>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides'>('default');
const role = ref(props.role);
const name = ref(props.name);

watch(() => props.role, (value) => {
  role.value = value;
});
watch(() => props.name, (value) => {
  name.value = value;
});

/*
Emits the current locator fields from the dedicated Click page.
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
  <section aria-label="Click step details">
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'default' }]" type="button" @click="selectedTab = 'default'">{{ t('editor.defaultTab') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'overrides' }]" type="button" @click="selectedTab = 'overrides'">{{ t('editor.overridesTab') }}</button>
      </li>
    </ul>
    <section v-if="selectedTab === 'default'">
      <label class="form-label" :for="`click-role-${props.index}`">Role</label>
      <input :id="`click-role-${props.index}`" v-model="role" class="form-control" required @change="updateLocator" />
      <label class="form-label mt-3" :for="`click-name-${props.index}`">Accessible name</label>
      <input :id="`click-name-${props.index}`" v-model="name" class="form-control" @change="updateLocator" />
    </section>
    <section v-else>
      <label class="form-label" :for="`click-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
      <input :id="`click-timeout-${props.index}`" class="form-control" min="1" type="number" :value="props.timeout" @input="emit('update:timeout', readTimeout($event))" />
    </section>
  </section>
</template>
