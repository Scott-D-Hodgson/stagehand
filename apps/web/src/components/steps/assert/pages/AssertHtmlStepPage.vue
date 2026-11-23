<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import AssertionBehaviour from '../controls/AssertionBehaviour.vue';
import LocaleOverridesTab, { type LocaleOverrideItem } from '../controls/LocaleOverridesTab.vue';
import WaitReferences from '../../../waits/WaitReferences.vue';
import StepTimeoutOverride from '../../StepTimeoutOverride.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; expected: string; index: number; inheritedTimeout: number; name: string; overrides: LocaleOverrideItem[]; role: string; soft: boolean; timeout: unknown }>();
const emit = defineEmits<{
  'add:override': [];
  'edit:override': [override: LocaleOverrideItem];
  'remove:override': [override: LocaleOverrideItem];
  'update:expected': [expected: string];
  'update:after': [items: unknown[]];
  'update:before': [items: unknown[]];
  'update:locator': [locator: { name?: string; role: string }];
  'update:soft': [soft: boolean];
  'update:timeout': [timeout: number | string];
  save: [];
}>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'locales' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const expected = ref(props.expected);
const roleWasBlurred = ref(false);
const expectedWasBlurred = ref(false);

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
Validates the Assert HTML required fields after focus leaves them.
---
Inputs: A Role or Expected HTML blur event.
---
Output: Local field feedback and a synchronized local form value.
*/
function validateDefaultField(field: 'expected' | 'role'): void {
  if (field === 'role') {
    roleWasBlurred.value = true;
    updateLocator();
    return;
  }
  expectedWasBlurred.value = true;
  emit('update:expected', expected.value);
}

/*
Applies the current Assert HTML fields after synchronizing local values.
---
Inputs: The current locator and Expected HTML field values.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  updateLocator();
  emit('update:expected', expected.value);
  emit('save');
}

</script>

<template>
  <section
    aria-label="Assert HTML step details"
  >
    <ul
      class="nav nav-pills my-3"
      role="tablist"
    >
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'default' }]"
          type="button"
          @click="selectedTab = 'default'"
        >{{ t('editor.defaultTab') }}</button>
      </li>
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'overrides' }]"
          type="button"
          @click="selectedTab = 'overrides'"
        >{{ t('editor.overridesTab') }}</button>
      </li>
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'locales' }]"
          type="button"
          @click="selectedTab = 'locales'"
        >{{ t('editor.localeOverrides') }}</button>
      </li>
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'waits' }]"
          type="button"
          @click="selectedTab = 'waits'"
        >{{ t('editor.waits') }}</button>
      </li>
    </ul>
    <div
      class="card shadow-sm bg-body-tertiary"
    >
      <div
        class="card-body"
      >
        <h2
          v-if="selectedTab !== 'waits'"
          class="h3"
        >{{ selectedTab === 'default' ? t('editor.defaultTab') : selectedTab === 'overrides' ? t('editor.overridesTab') : t('editor.localeOverrides') }}</h2>
        <template
          v-if="props.editing && selectedTab !== 'locales' && selectedTab !== 'waits'"
        >
          <section
            v-if="selectedTab === 'default'"
          >
            <label
              class="form-label"
              :for="`assert-html-role-${props.index}`"
            >Role</label>
            <input
              :id="`assert-html-role-${props.index}`"
              v-model="role"
              :class="['form-control', { 'is-invalid': roleWasBlurred && role.trim() === '' }]"
              required
              @blur="validateDefaultField('role')"
              @change="updateLocator"
            />
            <div
              v-if="roleWasBlurred && role.trim() === ''"
              class="invalid-feedback d-block"
            >{{ t('editor.roleRequired') }}</div>
            <label
              class="form-label mt-3"
              :for="`assert-html-name-${props.index}`"
            >Accessible name</label>
            <input
              :id="`assert-html-name-${props.index}`"
              v-model="name"
              class="form-control"
              @change="updateLocator"
            />
            <label
              class="form-label mt-3"
              :for="`assert-html-expected-${props.index}`"
            >Expected HTML</label>
            <textarea
              :id="`assert-html-expected-${props.index}`"
              v-model="expected"
              :class="['form-control', { 'is-invalid': expectedWasBlurred && expected.trim() === '' }]"
              rows="6"
              required
              @blur="validateDefaultField('expected')"
              @change="emit('update:expected', expected)"
            ></textarea>
            <div
              v-if="expectedWasBlurred && expected.trim() === ''"
              class="invalid-feedback d-block"
            >{{ t('editor.expectedHtmlRequired') }}</div>
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="role.trim() === '' || expected.trim() === ''"
              @click="applyDefault"
            >{{ t('editor.apply') }}</button>
          </section>
          <section
            v-else
          >
            <StepTimeoutOverride
              :id-prefix="`assert-html-${props.index}`"
              :inherited-timeout="props.inheritedTimeout"
              :timeout="props.timeout"
              @update:timeout="emit('update:timeout', $event)"
            />
            <AssertionBehaviour
              :editing="true"
              :id-prefix="`assert-html-${props.index}`"
              :soft="props.soft"
              @update:soft="emit('update:soft', $event)"
            />
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="typeof props.timeout === 'number' && (!Number.isInteger(props.timeout) || props.timeout < 1)"
              @click="emit('save')"
            >{{ t('editor.apply') }}</button>
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
        <template v-else-if="!props.editing && selectedTab === 'overrides'">
          <dl class="mb-0">
            <dt>{{ t('editor.stepTimeout') }}</dt>
            <dd class="mb-0">{{ props.timeout ?? t('editor.inherited') }}</dd>
          </dl>
          <AssertionBehaviour :editing="false" :id-prefix="`assert-html-${props.index}`" :soft="props.soft" />
        </template>
        <LocaleOverridesTab v-else-if="selectedTab === 'locales'" :editing="props.editing" :overrides="props.overrides" @add="emit('add:override')" @edit="emit('edit:override', $event)" @remove="emit('remove:override', $event)" />
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
