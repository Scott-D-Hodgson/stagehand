<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import WaitReferences from '../../../waits/WaitReferences.vue';
import ScrollIntoViewOption from '../../ScrollIntoViewOption.vue';
import StepTimeoutOverride from '../../StepTimeoutOverride.vue';
import VariableDetails from '../../../variables/details/VariableDetails.vue';
import VariableWatermark from '../../../variables/controls/VariableWatermark.vue';
import type { VariableDefinitionDraft } from '../../../../services/planDraftService';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; inheritedTimeout: number; kind: 'type' | 'fill' | 'selectOption'; name: string; planLocale: string; role: string; scrollIntoView: boolean; selectionMode?: 'value' | 'label'; text: string | { var: string }; timeout: unknown; variables: Record<string, VariableDefinitionDraft> }>();
const emit = defineEmits<{
  'update:after': [items: unknown[]];
  'update:before': [items: unknown[]];
  'update:locator': [locator: { name?: string; role: string }];
  'update:scroll-into-view': [enabled: boolean];
  'update:selection-mode': [mode: 'value' | 'label'];
  'update:text': [text: string | { var: string }];
  'update:timeout': [timeout: number | string];
  save: [];
}>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const text = ref(typeof props.text === 'string' ? props.text : '');
const variable = ref(typeof props.text === 'object' ? props.text.var : '');
const textSource = ref<'text' | 'variable'>(typeof props.text === 'object' ? 'variable' : 'text');
const roleWasBlurred = ref(false);
const textWasBlurred = ref(false);
const showOtherVariables = ref(false);

watch(() => props.role, (value) => { role.value = value; });
watch(() => props.name, (value) => { name.value = value; });
watch(() => props.text, (value) => {
  if (typeof value === 'string') {
    text.value = value;
    textSource.value = 'text';
  } else {
    variable.value = value.var;
    textSource.value = 'variable';
  }
});

/*
Determines whether the selected text source is ready to apply.
---
Inputs: The selected source, local value, and available variable names.
---
Output: Whether the Type text value is valid.
*/
const textValid = computed(
  () => textSource.value === 'text' ? text.value.trim().length > 0 : Object.hasOwn(props.variables, variable.value)
);

/*
Lists the available Plan variables in name order.
---
Inputs: Plan-level variable definitions.
---
Output: Alphabetically ordered variable entries.
*/
const variableEntries = computed(
  () => Object.entries(props.variables).sort(([left], [right]) => left.localeCompare(right))
);

/*
Chooses which variable cards are currently visible.
---
Inputs: Available variables, the selection, and the alternatives toggle.
---
Output: The selected card or the full list of cards.
*/
const visibleVariables = computed(
  () => !Object.hasOwn(props.variables, variable.value) || showOtherVariables.value
    ? variableEntries.value
    : variableEntries.value.filter(([name]) => name === variable.value)
);

/*
Selects a variable for the local Type-step form.
---
Inputs: A selected Plan-variable name.
---
Output: A local reference and a collapsed alternatives list.
*/
function selectVariable(name: string): void {
  variable.value = name;
  textWasBlurred.value = false;
  showOtherVariables.value = false;
  updateText();
}

/*
Updates the local step with the chosen literal or variable reference.
---
Inputs: The selected source and local text or variable name.
---
Output: A local Type step text update.
*/
function updateText(): void {
  emit('update:text', textSource.value === 'text' ? text.value : { var: variable.value });
}

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
Marks the Type locator Role field as ready to show validation feedback.
---
Inputs: The Role field blur event.
---
Output: Enables localized Role feedback.
*/
function validateRole(): void {
  roleWasBlurred.value = true;
  updateLocator();
}

/*
Marks the Type text field as ready to show validation feedback.
---
Inputs: The Text field blur event.
---
Output: Enables localized Text feedback and updates the local form.
*/
function validateText(): void {
  textWasBlurred.value = true;
  updateText();
}

/*
Applies the current Type fields after synchronizing local values.
---
Inputs: The current locator and Text field values.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  updateLocator();
  updateText();
  emit('save');
}

</script>

<template>
  <section
    :aria-label="t(props.kind === 'fill' ? 'editor.fill' : props.kind === 'selectOption' ? 'editor.selectOption' : 'editor.type')"
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
        >{{ selectedTab === 'default' ? t('editor.defaultTab') : t('editor.overridesTab') }}</h2>
        <template
          v-if="props.editing && selectedTab !== 'waits'"
        >
          <section
            v-if="selectedTab === 'default'"
          >
            <label
              class="form-label"
              :for="`type-role-${props.index}`"
            >Role</label>
            <input
              :id="`type-role-${props.index}`"
              v-model="role"
              :class="['form-control', { 'is-invalid': roleWasBlurred && role.trim() === '' }]"
              required
              @blur="validateRole"
              @input="updateLocator"
            />
            <div
              v-if="roleWasBlurred && role.trim() === ''"
              class="invalid-feedback d-block"
            >{{ t('editor.roleRequired') }}</div>
            <label
              class="form-label mt-3"
              :for="`type-name-${props.index}`"
            >Accessible name</label>
            <input
              :id="`type-name-${props.index}`"
              v-model="name"
              class="form-control"
              @input="updateLocator"
            />
            <fieldset
              v-if="props.kind === 'selectOption'"
              class="mt-3"
            >
              <legend
                class="fs-6"
              >{{ t('editor.selectOptionBy') }}</legend>
              <div
                v-for="mode in (['value', 'label'] as const)"
                :key="mode"
                class="form-check form-check-inline"
              >
                <input
                  :id="`select-mode-${mode}-${props.index}`"
                  class="form-check-input"
                  type="radio"
                  :name="`select-mode-${props.index}`"
                  :checked="props.selectionMode === mode"
                  @change="emit('update:selection-mode', mode)"
                />
                <label
                  class="form-check-label"
                  :for="`select-mode-${mode}-${props.index}`"
                >{{ t(mode === 'value' ? 'editor.byValue' : 'editor.byLabel') }}</label>
              </div>
            </fieldset>
            <div
              class="form-check form-switch mt-3"
            >
              <input
                :id="`type-source-${props.index}`"
                class="form-check-input"
                type="checkbox"
                :checked="textSource === 'variable'"
                @change="textSource = ($event.target as HTMLInputElement).checked ? 'variable' : 'text'; textWasBlurred = false; updateText()"
              />
              <label
                class="form-check-label"
                :for="`type-source-${props.index}`"
              >{{ t('editor.useVariable') }}</label>
            </div>
            <label
              v-if="textSource === 'text'"
              class="form-label mt-3"
              :for="`type-text-${props.index}`"
            >{{ t(props.kind === 'selectOption' && props.selectionMode === 'label' ? 'editor.label' : props.kind === 'type' ? 'editor.text' : 'editor.value') }}</label>
            <input
              v-if="textSource === 'text'"
              :id="`type-text-${props.index}`"
              v-model="text"
              :class="['form-control', { 'is-invalid': textWasBlurred && !textValid }]"
              required
              @blur="validateText"
              @input="updateText"
            />
            <fieldset
              v-else
              class="mt-3"
            >
              <legend
                class="fs-6"
              >{{ t('editor.selectVariable') }}</legend>
              <p
                v-if="variable && !Object.hasOwn(props.variables, variable)"
                class="text-danger"
              >{{ t('editor.variableUnavailable', { name: variable }) }}</p>
              <p
                v-if="variableEntries.length === 0"
                class="text-body-secondary"
              >{{ t('editor.noVariables') }}</p>
              <div
                v-if="Object.hasOwn(props.variables, variable) && variableEntries.length > 1"
                class="form-check form-switch mb-3"
              >
                <input
                  :id="`type-other-variables-${props.index}`"
                  v-model="showOtherVariables"
                  class="form-check-input"
                  type="checkbox"
                />
                <label
                  class="form-check-label"
                  :for="`type-other-variables-${props.index}`"
                >{{ t('editor.showOtherVariables') }}</label>
              </div>
              <div
                class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3"
              >
                <div
                  v-for="[variableName, definition] in visibleVariables"
                  :key="variableName"
                  class="col"
                >
                  <label
                    :class="['card h-100 bg-body shadow-sm overflow-hidden', { 'border-primary': variableName === variable }]"
                  >
                    <VariableWatermark
                      :definition="definition"
                    />
                    <div
                      class="card-body position-relative"
                    >
                      <input
                        class="form-check-input float-end"
                        type="radio"
                        :name="`type-variable-${props.index}`"
                        :value="variableName"
                        :checked="variable === variableName"
                        @blur="textWasBlurred = true"
                        @change="selectVariable(variableName)"
                      />
                      <VariableDetails
                        :definition="definition"
                        :name="variableName"
                        :plan-locale="props.planLocale"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </fieldset>
            <div
              v-if="textWasBlurred && !textValid"
              class="invalid-feedback d-block"
            >{{ textSource === 'text' ? t(props.kind === 'selectOption' && props.selectionMode === 'label' ? 'editor.labelRequired' : props.kind === 'type' ? 'editor.textRequired' : 'editor.valueRequired') : t('editor.variableRequired') }}</div>
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="role.trim() === '' || !textValid"
              @click="applyDefault"
            >{{ t('editor.apply') }}</button>
          </section>
          <section
            v-else
          >
            <StepTimeoutOverride
              :id-prefix="`type-${props.index}`"
              :inherited-timeout="props.inheritedTimeout"
              :timeout="props.timeout"
              @update:timeout="emit('update:timeout', $event)"
            />
            <ScrollIntoViewOption
              :editing="true"
              :id-prefix="`type-${props.index}`"
              :scroll-into-view="props.scrollIntoView"
              @update:scroll-into-view="emit('update:scroll-into-view', $event)"
            />
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="typeof props.timeout === 'number' && (!Number.isInteger(props.timeout) || props.timeout < 1)"
              @click="emit('save')"
            >{{ t('editor.apply') }}</button>
          </section>
        </template>
        <dl v-else-if="selectedTab === 'default'" class="mb-0">
          <dt>Role</dt>
          <dd>{{ props.role }}</dd>
          <dt>{{ t('editor.accessibleName') }}</dt>
          <dd><template v-if="props.name">{{ props.name }}</template><template v-else>&mdash;</template></dd>
          <dt>{{ t(props.kind === 'selectOption' && props.selectionMode === 'label' ? 'editor.label' : props.kind === 'type' ? 'editor.text' : 'editor.value') }}</dt>
          <dd class="mb-0 text-break">{{ typeof props.text === 'string' ? props.text : `${t('editor.variable')}: ${props.text.var}` }}</dd>
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
