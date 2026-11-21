<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import WaitReferences from '../Waits/WaitReferences.vue';
import ScrollIntoViewOption from './ScrollIntoViewOption.vue';
import StepTimeoutOverride from './StepTimeoutOverride.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; inheritedTimeout: number; name: string; role: string; scrollIntoView: boolean; timeout: unknown }>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:locator': [locator: { name?: string; role: string }]; 'update:scroll-into-view': [enabled: boolean]; 'update:timeout': [timeout: number | string]; save: [] }>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const roleWasBlurred = ref(false);

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
Marks the Click locator Role field as ready to show validation feedback.
---
Inputs: The Role field blur event.
---
Output: Enables localized Role feedback and updates the local form.
*/
function validateRole(): void {
  roleWasBlurred.value = true;
  updateLocator();
}

/*
Applies the current Click locator after synchronizing local fields.
---
Inputs: The current Role and Accessible name field values.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  updateLocator();
  emit('save');
}

</script>

<template>
  <section aria-label="Click step details">
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
            <label class="form-label" :for="`click-role-${props.index}`">Role</label>
            <input :id="`click-role-${props.index}`" v-model="role" :class="['form-control', { 'is-invalid': roleWasBlurred && role.trim() === '' }]" required @blur="validateRole" @change="updateLocator" />
            <div v-if="roleWasBlurred && role.trim() === ''" class="invalid-feedback d-block">{{ t('editor.roleRequired') }}</div>
            <label class="form-label mt-3" :for="`click-name-${props.index}`">Accessible name</label>
            <input :id="`click-name-${props.index}`" v-model="name" class="form-control" @change="updateLocator" />
            <button class="btn btn-primary mt-3" type="button" :disabled="role.trim() === ''" @click="applyDefault">{{ t('editor.apply') }}</button>
          </section>
          <section v-else>
            <StepTimeoutOverride :id-prefix="`click-${props.index}`" :inherited-timeout="props.inheritedTimeout" :timeout="props.timeout" @update:timeout="emit('update:timeout', $event)" />
            <ScrollIntoViewOption :editing="true" :id-prefix="`click-${props.index}`" :scroll-into-view="props.scrollIntoView" @update:scroll-into-view="emit('update:scroll-into-view', $event)" />
            <button class="btn btn-primary mt-3" type="button" :disabled="typeof props.timeout === 'number' && (!Number.isInteger(props.timeout) || props.timeout < 1)" @click="emit('save')">{{ t('editor.apply') }}</button>
          </section>
        </template>
        <dl v-else-if="selectedTab === 'default'" class="mb-0">
          <dt>Role</dt>
          <dd>{{ props.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd class="mb-0"><template v-if="props.name">{{ props.name }}</template><template v-else>&mdash;</template></dd>
        </dl>
        <dl v-else-if="selectedTab === 'overrides'" class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd>{{ props.timeout ?? t('editor.inherited') }}</dd>
          <ScrollIntoViewOption :editing="false" :id-prefix="`click-${props.index}`" :scroll-into-view="props.scrollIntoView" />
        </dl>
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
