<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import AssertionBehaviour from '../controls/AssertionBehaviour.vue';
import LocaleOverridesTab from '../controls/LocaleOverridesTab.vue';
import WaitReferences from '../../../waits/WaitReferences.vue';
import StepTimeoutOverride from '../../StepTimeoutOverride.vue';
import VariableReferencePicker from '../../../variables/controls/VariableReferencePicker.vue';
import type { VariableDefinitionDraft } from '../../../../services/planDraftService';

interface LocaleOverride {
  locale: string;
  value: string;
}

const props = defineProps<{
  editing: boolean;
  after: unknown[];
  before: unknown[];
  expected: string | { var: string };
  index: number;
  name: string;
  role: string;
  soft: boolean;
  timeout: unknown;
  inheritedTimeout: number;
  overrides: LocaleOverride[];
  planLocale: string;
  variables: Record<string, VariableDefinitionDraft>;
}>();
const emit = defineEmits<{
  'add:override': [];
  'edit:override': [override: LocaleOverride];
  'remove:override': [override: LocaleOverride];
  'update:expected': [expected: string | { var: string }];
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
const expected = ref(typeof props.expected === 'string' ? props.expected : '');
const variable = ref(typeof props.expected === 'string' ? '' : props.expected.var);
const useVariable = ref(typeof props.expected !== 'string');
const roleWasBlurred = ref(false);
const expectedWasBlurred = ref(false);

watch(() => props.role, (value) => { role.value = value; });
watch(() => props.name, (value) => { name.value = value; });
watch(() => props.expected, (value) => {
  if (typeof value === 'string') {
    expected.value = value;
    useVariable.value = false;
  } else {
    variable.value = value.var;
    useVariable.value = true;
  }
});

/*
Checks whether the expected value can be applied.
---
Inputs: The selected source, literal text, and Plan variables.
---
Output: Whether the current expectation is valid.
*/
const expectedValid = computed(
  () => useVariable.value ? Object.hasOwn(props.variables, variable.value) : expected.value.trim() !== ''
);

/*
Updates the local assertion expectation.
---
Inputs: The selected source and its current value.
---
Output: A literal value or whole-field variable reference.
*/
function updateExpected(): void {
  emit('update:expected', useVariable.value ? { var: variable.value } : expected.value);
}

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
Marks the Assert text Role field as ready to show validation feedback.
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
Marks the Assert text expected-value field as ready to show validation feedback.
---
Inputs: The Expected text field blur event.
---
Output: Enables localized expected-text feedback and updates the local form.
*/
function validateExpected(): void {
  expectedWasBlurred.value = true;
  updateExpected();
}

/*
Applies the current Assert text fields after synchronizing local values.
---
Inputs: The current locator and Expected text field values.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  updateLocator();
  updateExpected();
  emit('save');
}

</script>

<template>
  <section
    aria-label="Assert text step details"
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
              :for="`assert-text-role-${props.index}`"
            >Role</label>
            <input
              :id="`assert-text-role-${props.index}`"
              v-model="role"
              :class="['form-control', { 'is-invalid': roleWasBlurred && role.trim() === '' }]"
              required
              @blur="validateRole"
              @change="updateLocator"
            />
            <div
              v-if="roleWasBlurred && role.trim() === ''"
              class="invalid-feedback d-block"
            >{{ t('editor.roleRequired') }}</div>
            <label
              class="form-label mt-3"
              :for="`assert-text-name-${props.index}`"
            >Accessible name</label>
            <input
              :id="`assert-text-name-${props.index}`"
              v-model="name"
              class="form-control"
              @change="updateLocator"
            />
            <div
              class="form-check form-switch mt-3"
            >
              <input
                :id="`assert-text-variable-${props.index}`"
                v-model="useVariable"
                class="form-check-input"
                type="checkbox"
                @change="expectedWasBlurred = false; updateExpected()"
              />
              <label
                class="form-check-label"
                :for="`assert-text-variable-${props.index}`"
              >{{ t('editor.useVariable') }}</label>
            </div>
            <label
              v-if="!useVariable"
              class="form-label mt-3"
              :for="`assert-text-expected-${props.index}`"
            >Expected text</label>
            <input
              v-if="!useVariable"
              :id="`assert-text-expected-${props.index}`"
              v-model="expected"
              :class="['form-control', { 'is-invalid': expectedWasBlurred && expected.trim() === '' }]"
              required
              @blur="validateExpected"
              @input="updateExpected"
            />
            <VariableReferencePicker
              v-else
              :id="`assert-text-variable-picker-${props.index}`"
              v-model="variable"
              :locale="props.planLocale"
              :variables="props.variables"
              @update:model-value="updateExpected"
            />
            <div
              v-if="expectedWasBlurred && !expectedValid"
              class="invalid-feedback d-block"
            >{{ t(useVariable ? 'editor.variableRequired' : 'editor.expectedTextRequired') }}</div>
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="role.trim() === '' || !expectedValid"
              @click="applyDefault"
            >{{ t('editor.apply') }}</button>
          </section>
          <section
            v-else
          >
            <StepTimeoutOverride
              :id-prefix="`assert-text-${props.index}`"
              :inherited-timeout="props.inheritedTimeout"
              :timeout="props.timeout"
              @update:timeout="emit('update:timeout', $event)"
            />
            <AssertionBehaviour
              :editing="true"
              :id-prefix="`assert-text-${props.index}`"
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
          <dt>{{ t('editor.expectedText') }}</dt>
          <dd class="mb-0 text-break">{{ typeof props.expected === 'string' ? props.expected : `${t('editor.variable')}: ${props.expected.var}` }}</dd>
        </dl>
        <template v-else-if="!props.editing && selectedTab === 'overrides'">
          <dl class="mb-0">
            <dt>{{ t('editor.stepTimeout') }}</dt>
            <dd class="mb-0">{{ props.timeout ?? t('editor.inherited') }}</dd>
          </dl>
          <AssertionBehaviour :editing="false" :id-prefix="`assert-text-${props.index}`" :soft="props.soft" />
        </template>
        <LocaleOverridesTab v-else-if="selectedTab === 'locales'" :editing="props.editing" :overrides="props.overrides" @add="emit('add:override')" @edit="emit('edit:override', $event)" @remove="emit('remove:override', $event)" />
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
