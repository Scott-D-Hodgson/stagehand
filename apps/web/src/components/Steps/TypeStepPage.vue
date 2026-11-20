<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import WaitReferences from '../Waits/WaitReferences.vue';
import ScrollIntoViewOption from './ScrollIntoViewOption.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; name: string; role: string; scrollIntoView: boolean; text: string; timeout: unknown }>();
const emit = defineEmits<{
  'update:after': [items: unknown[]];
  'update:before': [items: unknown[]];
  'update:locator': [locator: { name?: string; role: string }];
  'update:scroll-into-view': [enabled: boolean];
  'update:text': [text: string];
  'update:timeout': [timeout: number | string];
}>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const text = ref(props.text);

watch(() => props.role, (value) => { role.value = value; });
watch(() => props.name, (value) => { name.value = value; });
watch(() => props.text, (value) => { text.value = value; });

/*
Emits the current locator fields from the dedicated Type page.
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
  <section aria-label="Type step details">
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
            <label class="form-label" :for="`type-role-${props.index}`">Role</label>
            <input :id="`type-role-${props.index}`" v-model="role" class="form-control" required @change="updateLocator" />
            <label class="form-label mt-3" :for="`type-name-${props.index}`">Accessible name</label>
            <input :id="`type-name-${props.index}`" v-model="name" class="form-control" @change="updateLocator" />
            <label class="form-label mt-3" :for="`type-text-${props.index}`">Text</label>
            <input :id="`type-text-${props.index}`" v-model="text" class="form-control" required @change="emit('update:text', text)" />
          </section>
          <section v-else>
            <label class="form-label" :for="`type-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
            <input :id="`type-timeout-${props.index}`" class="form-control" min="1" type="number" :value="props.timeout" @input="emit('update:timeout', readTimeout($event))" />
            <ScrollIntoViewOption :editing="true" :id-prefix="`type-${props.index}`" :scroll-into-view="props.scrollIntoView" @update:scroll-into-view="emit('update:scroll-into-view', $event)" />
          </section>
        </template>
        <dl v-else-if="selectedTab === 'default'" class="mb-0">
          <dt>Role</dt>
          <dd>{{ props.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd><template v-if="props.name">{{ props.name }}</template><template v-else>&mdash;</template></dd>
          <dt>Text</dt>
          <dd class="mb-0 text-break">{{ props.text }}</dd>
        </dl>
        <dl v-else-if="selectedTab === 'overrides'" class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd>{{ props.timeout ?? t('editor.inherited') }}</dd>
          <ScrollIntoViewOption :editing="false" :id-prefix="`type-${props.index}`" :scroll-into-view="props.scrollIntoView" />
        </dl>
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
