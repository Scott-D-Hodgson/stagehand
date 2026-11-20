<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import WaitReferences from '../Waits/WaitReferences.vue';
import ScrollIntoViewOption from './ScrollIntoViewOption.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; name: string; role: string; scrollIntoView: boolean; timeout: unknown; value: string }>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:locator': [locator: { name?: string; role: string }]; 'update:scroll-into-view': [enabled: boolean]; 'update:timeout': [timeout: number | string]; 'update:value': [value: string] }>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const value = ref(props.value);

watch(() => props.role, (next) => { role.value = next; });
watch(() => props.name, (next) => { name.value = next; });
watch(() => props.value, (next) => { value.value = next; });

/*
Emits the current locator fields from the dedicated Fill page.
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
  <section aria-label="Fill step details">
    <ul class="nav nav-pills my-3" role="tablist">
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'default' }]" type="button" @click="selectedTab = 'default'">{{ t('editor.defaultTab') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'overrides' }]" type="button" @click="selectedTab = 'overrides'">{{ t('editor.overridesTab') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="['nav-link', { active: selectedTab === 'waits' }]" type="button" @click="selectedTab = 'waits'">{{ t('editor.waits') }}</button>
      </li>
    </ul>
    <div class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <h2 v-if="selectedTab !== 'waits'" class="h3">{{ selectedTab === 'default' ? t('editor.defaultTab') : t('editor.overridesTab') }}</h2>
        <template v-if="props.editing && selectedTab !== 'waits'">
          <section v-if="selectedTab === 'default'">
            <label class="form-label" :for="`fill-role-${props.index}`">Role</label>
            <input :id="`fill-role-${props.index}`" v-model="role" class="form-control" required @change="updateLocator" />
            <label class="form-label mt-3" :for="`fill-name-${props.index}`">Accessible name</label>
            <input :id="`fill-name-${props.index}`" v-model="name" class="form-control" @change="updateLocator" />
            <label class="form-label mt-3" :for="`fill-value-${props.index}`">Value</label>
            <input :id="`fill-value-${props.index}`" v-model="value" class="form-control" required @change="emit('update:value', value)" />
          </section>
          <section v-else>
            <label class="form-label" :for="`fill-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
            <input :id="`fill-timeout-${props.index}`" class="form-control" min="1" type="number" :value="props.timeout" @input="emit('update:timeout', readTimeout($event))" />
            <ScrollIntoViewOption :editing="true" :id-prefix="`fill-${props.index}`" :scroll-into-view="props.scrollIntoView" @update:scroll-into-view="emit('update:scroll-into-view', $event)" />
          </section>
        </template>
        <dl v-else-if="selectedTab === 'default'" class="mb-0">
          <dt>Role</dt>
          <dd>{{ props.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd><template v-if="props.name">{{ props.name }}</template><template v-else>&mdash;</template></dd>
          <dt>Value</dt>
          <dd class="mb-0 text-break">{{ props.value }}</dd>
        </dl>
        <dl v-else-if="selectedTab === 'overrides'" class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd>{{ props.timeout ?? t('editor.inherited') }}</dd>
          <ScrollIntoViewOption :editing="false" :id-prefix="`fill-${props.index}`" :scroll-into-view="props.scrollIntoView" />
        </dl>
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
