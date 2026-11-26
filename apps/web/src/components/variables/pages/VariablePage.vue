<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useRouter } from 'vue-router';
import LocaleOverrideDialog from '../../steps/assert/dialogs/LocaleOverrideDialog.vue';
import IconOnlyButton from '../../controls/IconOnlyButton.vue';
import type { CaseDraft, PlanDraft, VariableDefinitionDraft } from '../../../services/planDraftService';
import { findVariableStepUsages } from '../../../services/variableReferenceService';
import VariableDetails from '../details/VariableDetails.vue';
import ConfirmationModal from '../../controls/dialogs/ConfirmationModal.vue';
import type { VariableKind } from '../dialogs/VariableDialog.vue';
import { showAppliedChanges } from '../../../modules/feedback/applyFeedback';
import StepWatermark from '../../steps/StepWatermark.vue';
import { stepActionIcons, type StepAction } from '../../steps/step-icons';

const props = defineProps<{
  definition: VariableDefinitionDraft;
  editing: boolean;
  name: string;
  plan: PlanDraft;
  caseDrafts: Record<string, CaseDraft>;
}>();

const emit = defineEmits<{
  update: [definition: VariableDefinitionDraft];
}>();

const { t } = useTranslation();
const router = useRouter();
const selectedTab = ref<'default' | 'locales'>('default');
const locale = ref('');
const value = ref('');
const localeDialogOpen = ref(false);
const originalLocale = ref<string>();
const localeToRemove = ref<string>();
const formValue = ref('');
const valueBlurred = ref(false);
const pendingNavigation = ref<string>();
let navigationConfirmed = false;

/*
Reads the editable scalar or environment name from a variable definition.
---
Inputs: A variable definition.
---
Output: The default represented as form text.
*/
function readDefault(definition: VariableDefinitionDraft): string {
  return typeof definition.default === 'object' ? definition.default.env : String(definition.default);
}

watch(() => props.definition.default, () => {
  formValue.value = readDefault(props.definition);
  valueBlurred.value = false;
}, { immediate: true });

/*
Determines whether the default form contains a valid value.
---
Inputs: The variable kind and form value.
---
Output: Whether the default can be applied.
*/
const defaultValid = computed(
  () => formValue.value.trim().length > 0 && (variableKind.value !== 'number' || Number.isFinite(Number(formValue.value)))
);

/*
Determines whether the default form differs from the applied value.
---
Inputs: The form and saved variable default.
---
Output: Whether the form contains unapplied changes.
*/
const defaultDirty = computed(
  () => formValue.value !== readDefault(props.definition)
);

const removeNavigationGuard = router.beforeEach((to) => {
  if (navigationConfirmed || !defaultDirty.value) {
    navigationConfirmed = false;
    return true;
  }
  pendingNavigation.value = to.fullPath;
  return false;
});
onBeforeUnmount(removeNavigationGuard);

/*
Continues a navigation after the user discards unapplied changes.
---
Inputs: The destination held by the navigation guard.
---
Output: Navigation to the confirmed destination.
*/
function discardChanges(): void {
  const destination = pendingNavigation.value;
  pendingNavigation.value = undefined;
  if (destination !== undefined) {
    navigationConfirmed = true;
    void router.push(destination);
  }
}

/*
Determines whether this variable can have literal locale overrides.
---
Inputs: The variable default value.
---
Output: Whether the default is not an environment-variable reference.
*/
const supportsLocales = computed(
  () => typeof props.definition.default !== 'object'
);

/*
Determines the locale overrides in alphabetical order.
---
Inputs: The variable locale map.
---
Output: Ordered locale-value entries.
*/
const localeValues = computed(
  () => Object.entries(props.definition.locales ?? {}).sort(([left], [right]) => left.localeCompare(right))
);

/*
Finds distinct Case steps with a matching variable reference.
---
Inputs: The plan, its case drafts, and the variable name.
---
Output: Ordered Case and Step locations.
*/
const usages = computed(
  () => findVariableStepUsages({ plan: props.plan, cases: props.caseDrafts }, props.name)
);

/*
Determines the variable dialog appropriate for the routed definition.
---
Inputs: The variable default value.
---
Output: The matching supported variable kind.
*/
const variableKind = computed<VariableKind>(
  () => typeof props.definition.default === 'boolean'
    ? 'boolean'
    : typeof props.definition.default === 'number'
      ? 'number'
      : typeof props.definition.default === 'object'
        ? 'environment'
        : 'text'
);

/*
Saves one typed locale value without changing the variable default.
---
Inputs: A selected locale and its raw form value.
---
Output: An updated variable definition containing the locale value.
*/
function saveLocale(): void {
  if (locale.value === '' || value.value === '') {
    return;
  }
  const defaultValue = props.definition.default;
  const localizedValue = typeof defaultValue === 'boolean'
    ? value.value === 'true'
    : typeof defaultValue === 'number'
      ? Number(value.value)
      : value.value;
  if (typeof localizedValue === 'number' && !Number.isFinite(localizedValue)) {
    return;
  }
  const locales = { ...props.definition.locales, [locale.value]: localizedValue };
  if (originalLocale.value !== undefined && originalLocale.value !== locale.value) {
    delete locales[originalLocale.value];
  }
  emit('update', {
    ...props.definition,
    locales,
  });
  locale.value = '';
  value.value = '';
}

/*
Loads one locale value into the editable locale form.
---
Inputs: A locale and its existing scalar value.
---
Output: The form is ready to replace that locale value.
*/
function editLocale(selectedLocale: string, selectedValue: boolean | number | string): void {
  locale.value = selectedLocale;
  value.value = String(selectedValue);
  originalLocale.value = selectedLocale;
  localeDialogOpen.value = true;
}

/*
Opens a blank locale-override dialog.
---
Inputs: An Add action.
---
Output: A new uncommitted locale form.
*/
function addLocale(): void {
  locale.value = '';
  value.value = '';
  originalLocale.value = undefined;
  localeDialogOpen.value = true;
}

/*
Removes one locale value without changing the variable default.
---
Inputs: A locale entry selected for removal.
---
Output: An updated definition with the entry omitted.
*/
function removeLocale(selectedLocale: string): void {
  const remainingLocales = { ...props.definition.locales };
  delete remainingLocales[selectedLocale];
  const { locales: _, ...definition } = props.definition;
  emit('update', {
    ...definition,
    ...(Object.keys(remainingLocales).length === 0 ? {} : { locales: remainingLocales }),
  });
}

/*
Opens confirmation before removing one localized literal value.
---
Inputs: A locale selected for removal.
---
Output: A pending destructive locale-removal action.
*/
function requestLocaleRemoval(selectedLocale: string): void {
  localeToRemove.value = selectedLocale;
}

/*
Removes the locale selected in the confirmation dialog.
---
Inputs: A confirmed locale-removal action.
---
Output: An updated definition and cleared pending action.
*/
function confirmLocaleRemoval(): void {
  if (localeToRemove.value !== undefined) {
    removeLocale(localeToRemove.value);
  }
  localeToRemove.value = undefined;
}

/*
Saves a changed default from the dedicated variable dialog.
---
Inputs: The variable name and replacement definition.
---
Output: A definition update that preserves existing localized values.
*/
function saveDefault(): void {
  if (!defaultValid.value || !defaultDirty.value) {
    return;
  }
  const updated = variableKind.value === 'boolean' ? formValue.value === 'true' : variableKind.value === 'number' ? Number(formValue.value) : variableKind.value === 'environment' ? { env: formValue.value.trim() } : formValue.value;
  emit('update', { ...props.definition, default: updated });
  showAppliedChanges();
}
</script>

<template>
  <section>
    <h1>{{ props.name }}</h1>
    <ul
      class="nav nav-pills mb-3"
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
        v-if="supportsLocales"
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'locales' }]"
          type="button"
          @click="selectedTab = 'locales'"
        >{{ t('editor.locales') }}</button>
      </li>
    </ul>
    <div
      v-if="selectedTab === 'default'"
      class="card shadow-sm bg-body-tertiary"
    >
      <div
        class="card-body"
      >
        <h2
          class="h3"
        >{{ t('editor.defaultTab') }}</h2>
        <VariableDetails
          v-if="!props.editing"
          :definition="props.definition"
          :name="props.name"
        />
        <form
          v-if="props.editing"
          @submit.prevent="saveDefault"
        >
          <label
            class="form-label"
            for="variable-page-value"
          >{{ variableKind === 'environment' ? t('editor.environmentVariableName') : t('editor.value') }}</label>
          <select
            v-if="variableKind === 'boolean'"
            id="variable-page-value"
            v-model="formValue"
            class="form-select"
            @blur="valueBlurred = true"
          >
            <option value="true">{{ t('editor.booleanTrue') }}</option>
            <option value="false">{{ t('editor.booleanFalse') }}</option>
          </select>
          <input
            v-else
            id="variable-page-value"
            v-model="formValue"
            :class="['form-control', { 'is-invalid': valueBlurred && !defaultValid }]"
            :type="variableKind === 'number' ? 'number' : 'text'"
            @blur="valueBlurred = true"
          />
          <div
            v-if="valueBlurred && !defaultValid"
            class="invalid-feedback d-block"
          >{{ t('editor.variableValueRequired') }}</div>
          <button
            class="btn btn-primary mt-3"
            type="submit"
            :disabled="!defaultValid || !defaultDirty"
          >{{ t('editor.apply') }}</button>
        </form>
      </div>
    </div>
    <div
      v-else
      class="card shadow-sm bg-body-tertiary"
    >
      <div
        class="card-body"
      >
        <h2
          class="h3"
        >{{ t('editor.locales') }}</h2>
        <IconOnlyButton
          v-if="props.editing"
          class="btn btn-outline-secondary mb-3"
          icon="fa-solid fa-plus"
          :label="t('editor.add')"
          @click="addLocale"
        />
        <p
          v-if="localeValues.length === 0"
          class="mb-0 text-body-secondary"
        >{{ t('editor.noLocales') }}</p>
        <ul
          v-else
          class="list-group"
        >
          <li
            v-for="[localeName, localeValue] in localeValues"
            :key="localeName"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{{ localeName }}: {{ localeValue }}</span>
            <div
              v-if="props.editing"
              class="btn-group btn-group-sm"
              role="group"
            >
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="editLocale(localeName, localeValue)"
              >{{ t('editor.edit') }}</button>
              <button
                class="btn btn-outline-danger"
                type="button"
                @click="requestLocaleRemoval(localeName)"
              >{{ t('editor.remove') }}</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <section
      class="mt-4"
      aria-labelledby="variable-usages-heading"
    >
      <h2
        id="variable-usages-heading"
        class="h3"
      >{{ t('editor.variableUsages') }}</h2>
      <p
        class="text-body-secondary"
      >{{ t('editor.variableUsagesHelp') }}</p>
      <p
        v-if="usages.length === 0"
        class="text-body-secondary"
      >{{ t('editor.variableStepCount', { count: 0 }) }}</p>
      <div
        v-else
        class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3"
      >
        <div
          v-for="usage in usages"
          :key="`${usage.caseIndex}-${usage.stepIndex}`"
          class="col"
        >
          <div
            class="card h-100 bg-body-tertiary shadow-sm overflow-hidden"
          >
            <div
              class="card-body position-relative"
            >
              <StepWatermark
                v-if="Object.hasOwn(stepActionIcons, usage.action)"
                :icon="stepActionIcons[usage.action as StepAction]"
              />
              <RouterLink
                class="stretched-link text-decoration-none position-relative z-1"
                :to="{ name: 'step', params: { cardIndex: usage.caseIndex, stepIndex: usage.stepIndex } }"
              >{{ usage.stepIndex + 1 }}. {{ usage.action }}</RouterLink>
              <p
                class="mb-0 text-body-secondary position-relative z-1"
              >{{ props.plan.id }} › {{ usage.caseName }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <RouterLink
      class="btn btn-outline-secondary mt-3"
      :to="{ name: 'plan' }"
    ><i class="fa-solid fa-arrow-turn-down-left" aria-hidden="true"></i> {{ t('editor.return') }}</RouterLink>
    <LocaleOverrideDialog
      v-if="localeDialogOpen"
      :locale="locale"
      :unavailable-locales="Object.keys(props.definition.locales ?? {}).filter((item) => item !== originalLocale)"
      :value="value"
      :value-kind="variableKind === 'environment' ? 'text' : variableKind"
      :value-label="t('editor.value')"
      :value-validation-message="t('editor.variableValueRequired')"
      @close="localeDialogOpen = false"
      @reset="locale = ''; value = ''"
      @save="saveLocale"
      @update:locale="locale = $event"
      @update:value="value = $event"
    />
    <ConfirmationModal
      v-if="pendingNavigation !== undefined"
      :cancel-label="t('editor.cancel')"
      :confirm-label="t('editor.discardLocalEdits')"
      confirm-style="danger"
      :message="t('editor.discardUnappliedChangesConfirmation')"
      :title="t('editor.confirmationTitle')"
      @cancel="pendingNavigation = undefined"
      @confirm="discardChanges"
    />
    <ConfirmationModal
      v-if="localeToRemove !== undefined"
      :cancel-label="t('editor.cancel')"
      :confirm-label="t('editor.remove')"
      confirm-style="danger"
      :message="t('editor.removeLocaleConfirmation', { locale: localeToRemove })"
      :title="t('editor.confirmationTitle')"
      @cancel="localeToRemove = undefined"
      @confirm="confirmLocaleRemoval"
    />
  </section>
</template>
