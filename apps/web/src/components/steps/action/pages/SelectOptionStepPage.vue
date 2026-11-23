<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import WaitReferences from '../../../waits/WaitReferences.vue';
import ScrollIntoViewOption from '../../ScrollIntoViewOption.vue';
import StepTimeoutOverride from '../../StepTimeoutOverride.vue';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean; index: number; inheritedTimeout: number; label: string | undefined; name: string; role: string; scrollIntoView: boolean; timeout: unknown; value: string | undefined }>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:locator': [locator: { name?: string; role: string }]; 'update:scroll-into-view': [enabled: boolean]; 'update:selection': [selection: { label?: string; value?: string }]; 'update:timeout': [timeout: number | string]; save: [] }>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides' | 'waits'>('default');
const role = ref(props.role);
const name = ref(props.name);
const selectionMode = ref<'label' | 'value'>(props.value === undefined ? 'label' : 'value');
const selection = ref(props.value ?? props.label ?? '');

/*
Determines the label for the active option-selection field.
---
Inputs: The selected option selection mode.
---
Output: The localized-independent field label for the active mode.
*/
const selectionLabel = computed(
  () => selectionMode.value === 'value' ? 'Value' : 'Label'
);
const roleWasBlurred = ref(false);
const selectionWasBlurred = ref(false);

watch(() => props.role, (next) => { role.value = next; });
watch(() => props.name, (next) => { name.value = next; });

/*
Emits the current locator fields from the dedicated Select option page.
---
Inputs: A changed Role or Accessible name field.
---
Output: A replacement role/name locator.
*/
function updateLocator(): void {
  emit('update:locator', { name: name.value || undefined, role: role.value });
}

/*
Emits the selected option using exactly one supported selection mode.
---
Inputs: A selected Value-or-Label mode and its literal text.
---
Output: A replacement option selection.
*/
function updateSelection(): void {
  emit('update:selection', selectionMode.value === 'value' ? { value: selection.value } : { label: selection.value });
}

/*
Marks the Select option Role field as ready to show validation feedback.
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
Marks the Select option selection field as ready to show validation feedback.
---
Inputs: The Value-or-Label field blur event.
---
Output: Enables localized selection feedback and updates the local form.
*/
function validateSelection(): void {
  selectionWasBlurred.value = true;
  updateSelection();
}

/*
Applies the current Select option fields after synchronizing local values.
---
Inputs: The current locator, selection mode, and selection field values.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  updateLocator();
  updateSelection();
  emit('save');
}

</script>

<template>
  <section
    aria-label="Select option step details"
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
              :for="`select-role-${props.index}`"
            >Role</label>
            <input
              :id="`select-role-${props.index}`"
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
              :for="`select-name-${props.index}`"
            >Accessible name</label>
            <input
              :id="`select-name-${props.index}`"
              v-model="name"
              class="form-control"
              @change="updateLocator"
            />
            <div
              class="mt-3"
            >
              <div
                class="form-check form-check-inline"
              ><input id="select-by-value" v-model="selectionMode" class="form-check-input" type="radio" value="value" @change="updateSelection" /><label class="form-check-label" for="select-by-value">Value</label></div>
              <div
                class="form-check form-check-inline"
              ><input id="select-by-label" v-model="selectionMode" class="form-check-input" type="radio" value="label" @change="updateSelection" /><label class="form-check-label" for="select-by-label">Label</label></div>
            </div>
            <label
              class="form-label mt-3"
              :for="`select-selection-${props.index}`"
            >{{ selectionLabel }}</label>
            <input
              :id="`select-selection-${props.index}`"
              v-model="selection"
              :class="['form-control', { 'is-invalid': selectionWasBlurred && selection.trim() === '' }]"
              required
              @blur="validateSelection"
              @change="updateSelection"
            />
            <div
              v-if="selectionWasBlurred && selection.trim() === ''"
              class="invalid-feedback d-block"
            >{{ t('editor.valueRequired') }}</div>
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="role.trim() === '' || selection.trim() === ''"
              @click="applyDefault"
            >{{ t('editor.apply') }}</button>
          </section>
          <section
            v-else
          >
            <StepTimeoutOverride
              :id-prefix="`select-${props.index}`"
              :inherited-timeout="props.inheritedTimeout"
              :timeout="props.timeout"
              @update:timeout="emit('update:timeout', $event)"
            />
            <ScrollIntoViewOption
              :editing="true"
              :id-prefix="`select-${props.index}`"
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
          <dt>{{ selectionLabel }}</dt>
          <dd class="mb-0 text-break">{{ selection }}</dd>
        </dl>
        <dl v-else-if="selectedTab === 'overrides'" class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd>{{ props.timeout ?? t('editor.inherited') }}</dd>
          <ScrollIntoViewOption :editing="false" :id-prefix="`select-${props.index}`" :scroll-into-view="props.scrollIntoView" />
        </dl>
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
