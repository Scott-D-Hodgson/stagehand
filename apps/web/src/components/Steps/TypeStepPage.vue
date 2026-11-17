<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{ editing: boolean; index: number; name: string; role: string; text: string; timeout: unknown }>();
const emit = defineEmits<{
  'update:locator': [locator: { name?: string; role: string }];
  'update:text': [text: string];
  'update:timeout': [timeout: number | string];
}>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides'>('default');
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
    </ul>
    <div class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="props.editing">
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
        <dl v-else class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd class="mb-0">{{ props.timeout ?? t('editor.inherited') }}</dd>
        </dl>
      </div>
    </div>
  </section>
</template>
