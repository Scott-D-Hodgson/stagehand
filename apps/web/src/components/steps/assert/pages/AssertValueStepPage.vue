<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import AssertionBehaviour from '../controls/AssertionBehaviour.vue';
import LocaleOverridesTab, { type LocaleOverrideItem } from '../controls/LocaleOverridesTab.vue';
import StepTimeoutOverride from '../../StepTimeoutOverride.vue';
import WaitReferences from '../../../waits/WaitReferences.vue';
import VariableReferencePicker from '../../../variables/controls/VariableReferencePicker.vue';
import type { VariableDefinitionDraft } from '../../../../services/planDraftService';

const props = defineProps<{ after: unknown[]; associatedLabel?: { default?: string; locales?: Record<string, string> }; associatedLabelOverrides: LocaleOverrideItem[]; before: unknown[]; editing: boolean; expected: string | { var: string }; index: number; inheritedTimeout: number; name: string; overrides: LocaleOverrideItem[]; planLocale: string; role: string; soft: boolean; timeout: unknown; variables: Record<string, VariableDefinitionDraft> }>();
const emit = defineEmits<{ 'add:associated-label-override': []; 'add:override': []; 'edit:associated-label-override': [override: LocaleOverrideItem]; 'edit:override': [override: LocaleOverrideItem]; 'remove:associated-label-override': [override: LocaleOverrideItem]; 'remove:override': [override: LocaleOverrideItem]; 'update:after': [items: unknown[]]; 'update:associated-label': [expected: { default: string; locales?: Record<string, string> } | undefined]; 'update:before': [items: unknown[]]; 'update:expected': [expected: string | { var: string }]; 'update:locator': [locator: { name?: string; role: string }]; 'update:soft': [soft: boolean]; 'update:timeout': [timeout: number | string]; save: [] }>();
const { t } = useTranslation();
const selectedTab = ref<'associatedLabel' | 'default' | 'locales' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const expected = ref(typeof props.expected === 'string' ? props.expected : '');
const variable = ref(typeof props.expected === 'string' ? '' : props.expected.var);
const useVariable = ref(typeof props.expected !== 'string');
const roleWasBlurred = ref(false);
const expectedWasBlurred = ref(false);
const associatedLabelExpected = ref(props.associatedLabel?.default ?? '');
const associatedLabelWasBlurred = ref(false);
const associatedLabelEnabled = ref(props.associatedLabel !== undefined);

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
watch(() => props.associatedLabel, (value) => { associatedLabelEnabled.value = value !== undefined; associatedLabelExpected.value = value?.default ?? ''; });

/*
Checks whether the expected value can be applied.
---
Inputs: The selected source, literal value, and Plan variables.
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
Emits the current locator fields from the dedicated Assert value page.
---
Inputs: A changed Role or Accessible name field.
---
Output: A replacement role/name locator.
*/
function updateLocator(): void {
  emit('update:locator', { name: name.value || undefined, role: role.value });
}

/*
Validates the required Assert value fields after focus leaves them.
---
Inputs: A Role or Expected value field name.
---
Output: Local feedback and synchronized local form data.
*/
function validateDefaultField(field: 'expected' | 'role'): void {
  if (field === 'role') {
    roleWasBlurred.value = true;
    updateLocator();
    return;
  }
  expectedWasBlurred.value = true;
  updateExpected();
}

/*
Applies the current Assert value fields after synchronizing local values.
---
Inputs: The current locator and Expected value field values.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  updateLocator();
  updateExpected();
  emit('save');
}

/*
Applies the optional associated-label assertion from its local form.
---
Inputs: The enabled state and expected associated-label text.
---
Output: A synchronized optional label assertion followed by an Apply request.
*/
function applyAssociatedLabel(enabled: boolean): void {
  associatedLabelWasBlurred.value = true;
  if (enabled && associatedLabelExpected.value.trim() === '') {
    return;
  }
  emit('update:associated-label', enabled ? { default: associatedLabelExpected.value, locales: props.associatedLabel?.locales } : undefined);
  emit('save');
}

</script>

<template>
  <section
    aria-label="Assert value step details"
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
          :class="['nav-link', { active: selectedTab === 'associatedLabel' }]"
          type="button"
          @click="selectedTab = 'associatedLabel'"
        >{{ t('editor.associatedLabel') }}</button>
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
        >{{ selectedTab === 'default' ? t('editor.defaultTab') : selectedTab === 'overrides' ? t('editor.overridesTab') : selectedTab === 'associatedLabel' ? t('editor.associatedLabel') : t('editor.localeOverrides') }}</h2>
        <template
          v-if="props.editing && selectedTab !== 'locales' && selectedTab !== 'waits' && selectedTab !== 'associatedLabel'"
        >
          <section
            v-if="selectedTab === 'default'"
          >
            <label
              class="form-label"
              :for="`assert-value-role-${props.index}`"
            >Role</label>
            <input
              :id="`assert-value-role-${props.index}`"
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
              :for="`assert-value-name-${props.index}`"
            >Accessible name</label>
            <input
              :id="`assert-value-name-${props.index}`"
              v-model="name"
              class="form-control"
              @change="updateLocator"
            />
            <div
              class="form-check form-switch mt-3"
            >
              <input
                :id="`assert-value-variable-${props.index}`"
                v-model="useVariable"
                class="form-check-input"
                type="checkbox"
                @change="expectedWasBlurred = false; updateExpected()"
              />
              <label
                class="form-check-label"
                :for="`assert-value-variable-${props.index}`"
              >{{ t('editor.useVariable') }}</label>
            </div>
            <label
              v-if="!useVariable"
              class="form-label mt-3"
              :for="`assert-value-expected-${props.index}`"
            >Expected value</label>
            <input
              v-if="!useVariable"
              :id="`assert-value-expected-${props.index}`"
              v-model="expected"
              :class="['form-control', { 'is-invalid': expectedWasBlurred && expected.trim() === '' }]"
              required
              @blur="validateDefaultField('expected')"
              @input="updateExpected"
            />
            <VariableReferencePicker
              v-else
              :id="`assert-value-variable-picker-${props.index}`"
              v-model="variable"
              :locale="props.planLocale"
              :variables="props.variables"
              @update:model-value="updateExpected"
            />
            <div
              v-if="expectedWasBlurred && !expectedValid"
              class="invalid-feedback d-block"
            >{{ t(useVariable ? 'editor.variableRequired' : 'editor.expectedValueRequired') }}</div>
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
              :id-prefix="`assert-value-${props.index}`"
              :inherited-timeout="props.inheritedTimeout"
              :timeout="props.timeout"
              @update:timeout="emit('update:timeout', $event)"
            />
            <AssertionBehaviour
              :editing="true"
              :id-prefix="`assert-value-${props.index}`"
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
        <template v-else-if="props.editing && selectedTab === 'associatedLabel'">
          <div class="form-check">
            <input :id="`assert-value-associated-label-enabled-${props.index}`" v-model="associatedLabelEnabled" class="form-check-input" type="checkbox" />
            <label class="form-check-label" :for="`assert-value-associated-label-enabled-${props.index}`">{{ t('editor.checkAssociatedLabel') }}</label>
          </div>
          <template v-if="associatedLabelEnabled">
            <label class="form-label mt-3" :for="`assert-value-associated-label-${props.index}`">{{ t('editor.expectedLabel') }}</label>
            <input :id="`assert-value-associated-label-${props.index}`" v-model="associatedLabelExpected" :class="['form-control', { 'is-invalid': associatedLabelWasBlurred && associatedLabelExpected.trim() === '' }]" @blur="associatedLabelWasBlurred = true" />
            <div v-if="associatedLabelWasBlurred && associatedLabelExpected.trim() === ''" class="invalid-feedback d-block">{{ t('editor.expectedLabelRequired') }}</div>
            <LocaleOverridesTab :editing="props.editing" :overrides="props.associatedLabelOverrides" @add="emit('add:associated-label-override')" @edit="emit('edit:associated-label-override', $event)" @remove="emit('remove:associated-label-override', $event)" />
          </template>
          <button class="btn btn-primary mt-3" type="button" :disabled="associatedLabelEnabled && associatedLabelExpected.trim() === ''" @click="applyAssociatedLabel(associatedLabelEnabled)">{{ t('editor.apply') }}</button>
        </template>
        <dl v-else-if="!props.editing && selectedTab === 'default'" class="mb-0">
          <dt>Role</dt>
          <dd>{{ props.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd><template v-if="props.name">{{ props.name }}</template><template v-else>&mdash;</template></dd>
          <dt>{{ t('editor.expectedValue') }}</dt>
          <dd class="mb-0 text-break">{{ typeof props.expected === 'string' ? props.expected : `${t('editor.variable')}: ${props.expected.var}` }}</dd>
        </dl>
        <template v-else-if="!props.editing && selectedTab === 'overrides'">
          <dl class="mb-0">
            <dt>{{ t('editor.stepTimeout') }}</dt>
            <dd class="mb-0">{{ props.timeout ?? t('editor.inherited') }}</dd>
          </dl>
          <AssertionBehaviour :editing="false" :id-prefix="`assert-value-${props.index}`" :soft="props.soft" />
        </template>
        <template v-else-if="!props.editing && selectedTab === 'associatedLabel'">
          <p v-if="props.associatedLabel === undefined" class="mb-0 text-body-secondary">{{ t('editor.associatedLabelNotChecked') }}</p>
          <template v-else>
            <dl class="mb-3">
              <dt>{{ t('editor.expectedLabel') }}</dt>
              <dd class="mb-0 text-break">{{ props.associatedLabel.default }}</dd>
            </dl>
            <LocaleOverridesTab :editing="false" :overrides="props.associatedLabelOverrides" />
          </template>
        </template>
        <LocaleOverridesTab v-else-if="selectedTab === 'locales'" :editing="props.editing" :overrides="props.overrides" @add="emit('add:override')" @edit="emit('edit:override', $event)" @remove="emit('remove:override', $event)" />
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
