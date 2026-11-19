<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import LocaleOverridesTab, { type LocaleOverrideItem } from './LocaleOverridesTab.vue';

const props = defineProps<{ editing: boolean; expected: string; index: number; name: string; overrides: LocaleOverrideItem[]; role: string; timeout: unknown }>();
const emit = defineEmits<{
  'add:override': [];
  'edit:override': [override: LocaleOverrideItem];
  'remove:override': [override: LocaleOverrideItem];
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
Emits the current locator fields from the dedicated Assert HTML page.
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
  <section aria-label="Assert HTML step details">
    <ul class="nav nav-pills my-3" role="tablist">
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
    <div class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <h2 class="h3">{{ selectedTab === 'default' ? t('editor.defaultTab') : selectedTab === 'overrides' ? t('editor.overridesTab') : t('editor.localeOverrides') }}</h2>
        <template v-if="props.editing && selectedTab !== 'locales'">
          <section v-if="selectedTab === 'default'">
            <label class="form-label" :for="`assert-html-role-${props.index}`">Role</label>
            <input :id="`assert-html-role-${props.index}`" v-model="role" class="form-control" required @change="updateLocator" />
            <label class="form-label mt-3" :for="`assert-html-name-${props.index}`">Accessible name</label>
            <input :id="`assert-html-name-${props.index}`" v-model="name" class="form-control" @change="updateLocator" />
            <label class="form-label mt-3" :for="`assert-html-expected-${props.index}`">Expected HTML</label>
            <textarea :id="`assert-html-expected-${props.index}`" v-model="expected" class="form-control" rows="6" required @change="emit('update:expected', expected)"></textarea>
          </section>
          <section v-else>
            <label class="form-label" :for="`assert-html-timeout-${props.index}`">{{ t('editor.stepTimeout') }}</label>
            <input :id="`assert-html-timeout-${props.index}`" class="form-control" min="1" type="number" :value="props.timeout" @input="emit('update:timeout', readTimeout($event))" />
          </section>
        </template>
        <dl v-else-if="!props.editing && selectedTab === 'default'" class="mb-0">
          <dt>Role</dt>
          <dd>{{ props.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd><template v-if="props.name">{{ props.name }}</template><template v-else>&mdash;</template></dd>
          <dt>{{ t('editor.expectedHtml') }}</dt>
          <dd class="mb-0 text-break">{{ props.expected }}</dd>
        </dl>
        <dl v-else-if="!props.editing && selectedTab === 'overrides'" class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd class="mb-0">{{ props.timeout ?? t('editor.inherited') }}</dd>
        </dl>
        <LocaleOverridesTab v-else :editing="props.editing" :overrides="props.overrides" @add="emit('add:override')" @edit="emit('edit:override', $event)" @remove="emit('remove:override', $event)" />
      </div>
    </div>
  </section>
</template>
