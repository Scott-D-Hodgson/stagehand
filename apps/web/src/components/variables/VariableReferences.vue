<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { CaseDraft, PlanDraft, VariableDefinitionDraft } from '../../services/planDraftService';
import { findVariableReferences } from '../../services/variableReferenceService';
import BundleIssuesModal from '../plans/dialogs/BundleIssuesModal.vue';
import IconOnlyButton from '../controls/IconOnlyButton.vue';
import ConfirmationModal from '../controls/dialogs/ConfirmationModal.vue';
import VariableChooserDialog from './dialogs/VariableChooserDialog.vue';
import VariableDialog, { type VariableKind } from './dialogs/VariableDialog.vue';
import VariableDetails from './details/VariableDetails.vue';

const props = defineProps<{
  editing: boolean;
  plan: PlanDraft;
  caseDrafts: Record<string, CaseDraft>;
}>();

const emit = defineEmits<{
  remove: [name: string];
  save: [name: string, definition: VariableDefinitionDraft, previousName: string | undefined];
  select: [name: string];
}>();

const { t } = useTranslation();
const editingName = ref<string>();
const removingName = ref<string>();
const showDialog = ref(false);
const showChooser = ref(false);
const selectedKind = ref<VariableKind>();
const removalIssues = ref<string[]>();

/*
Determines plan variables ordered for predictable display.
---
Inputs: The optional plan-variable collection.
---
Output: Alphabetically ordered variable names and definitions.
*/
const variables = computed(
  () => Object.entries(props.plan.variables ?? {}).sort(([left], [right]) => left.localeCompare(right))
);

/*
Opens a fresh variable dialog.
---
Inputs: An Add interaction.
---
Output: A dialog with no selected existing variable.
*/
function addVariable(): void {
  editingName.value = undefined;
  showChooser.value = true;
}

/*
Opens the dedicated dialog selected from the variable-type chooser.
---
Inputs: A selected variable type.
---
Output: A matching variable form dialog.
*/
function chooseVariableKind(kind: VariableKind): void {
  selectedKind.value = kind;
  showChooser.value = false;
  showDialog.value = true;
}

/*
Opens the selected variable in the edit dialog.
---
Inputs: A plan-variable name.
---
Output: A dialog configured for that variable.
*/
function editVariable(name: string): void {
  editingName.value = name;
  selectedKind.value = getVariableKind(props.plan.variables?.[name]);
  showDialog.value = true;
}

/*
Navigates to the dedicated page for one variable.
---
Inputs: A selected plan-variable name.
---
Output: A selection event for the Plan page owner.
*/
function selectVariable(name: string): void {
  emit('select', name);
}

/*
Determines the dedicated editor dialog for one stored variable.
---
Inputs: An optional variable definition.
---
Output: The matching variable type.
*/
function getVariableKind(definition: VariableDefinitionDraft | undefined): VariableKind {
  if (typeof definition?.default === 'boolean') {
    return 'boolean';
  }
  if (typeof definition?.default === 'number') {
    return 'number';
  }
  if (typeof definition?.default === 'object' && definition.default !== null) {
    return 'environment';
  }
  return 'text';
}

/*
Saves a variable from the dialog through the owning plan draft.
---
Inputs: A variable name, definition, and optional previous name.
---
Output: An immutable plan-variable update and closed dialog.
*/
function saveVariable(name: string, definition: VariableDefinitionDraft, previousName: string | undefined): void {
  const existing = previousName === undefined ? undefined : props.plan.variables?.[previousName];
  emit('save', name, { ...definition, ...(existing?.locales === undefined ? {} : { locales: existing.locales }) }, previousName);
  showDialog.value = false;
}

/*
Opens the confirmation dialog for one variable removal.
---
Inputs: A plan-variable name.
---
Output: A pending destructive action.
*/
function requestRemoval(name: string): void {
  const references = findVariableReferences({ plan: props.plan, cases: props.caseDrafts }, name);
  if (references.length > 0) {
    removalIssues.value = references.map((reference) => `${reference.document}: ${reference.path}`);
    return;
  }
  removingName.value = name;
}

/*
Removes the confirmed plan variable.
---
Inputs: A confirmation action.
---
Output: A variable removal event and cleared pending action.
*/
function removeVariable(): void {
  if (removingName.value !== undefined) {
    emit('remove', removingName.value);
  }
  removingName.value = undefined;
}

/*
Chooses the watermark icon for one variable definition.
---
Inputs: A variable definition and its default value type.
---
Output: The matching Font Awesome icon class.
*/
function getVariableTypeIcon(definition: VariableDefinitionDraft): string {
  if (typeof definition.default === 'boolean') {
    return 'fa-solid fa-toggle-on';
  }
  if (typeof definition.default === 'number') {
    return 'fa-solid fa-hashtag';
  }
  if (typeof definition.default === 'object' && definition.default !== null) {
    return 'fa-solid fa-computer';
  }
  return 'fa-solid fa-font';
}

/*
Builds a repeated watermark pattern for one variable card.
---
Inputs: A variable definition.
---
Output: Twelve matching type icons.
*/
function getVariableTypeIcons(definition: VariableDefinitionDraft): string[] {
  return Array.from({ length: 12 }, () => getVariableTypeIcon(definition));
}
</script>

<template>
  <section
    aria-labelledby="plan-variables-heading"
  >
    <h2
      id="plan-variables-heading"
      class="h3"
    >{{ t('editor.variables') }}</h2>
    <IconOnlyButton
      v-if="props.editing"
      class="btn btn-outline-secondary mb-3"
      icon="fa-solid fa-plus"
      :label="t('editor.add')"
      @click="addVariable"
    />
    <p
      v-if="variables.length === 0"
      class="mb-0 text-body-secondary"
    >{{ t('editor.noVariables') }}</p>
    <div
      v-else
      class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mb-3"
    >
      <div
        v-for="[name, definition] in variables"
        :key="name"
        class="col"
      >
        <article
          class="card shadow-sm h-100 bg-body-tertiary overflow-hidden"
        >
          <div
            class="card-body position-relative pb-5"
          >
            <div
              class="variable-card-pattern position-absolute top-0 start-0 w-100 h-100"
              aria-hidden="true"
            >
              <i
                v-for="(icon, patternIndex) in getVariableTypeIcons(definition)"
                :key="patternIndex"
                :class="icon"
              ></i>
            </div>
            <button
              class="btn btn-link link-body-emphasis p-0 position-relative z-1 text-decoration-none text-start w-100"
              type="button"
              @click="selectVariable(name)"
            >
              <VariableDetails
                :definition="definition"
                :name="name"
                :plan-locale="props.plan.defaults.locale"
              />
            </button>
            <div
              v-if="props.editing"
              class="position-absolute bottom-0 end-0 z-1"
              style="bottom: 1rem !important; right: 1rem !important;"
            >
              <div
                class="btn-group btn-group-sm"
                role="group"
              >
                <IconOnlyButton
                  class="btn btn-outline-secondary bg-body"
                  icon="fa-solid fa-pen"
                  :label="t('editor.edit')"
                  @click.stop="editVariable(name)"
                />
                <IconOnlyButton
                  class="btn btn-outline-danger bg-body"
                  icon="fa-solid fa-minus"
                  :label="t('editor.remove')"
                  @click.stop="requestRemoval(name)"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
    <VariableDialog
      v-if="showDialog && selectedKind !== undefined"
      :definition="editingName === undefined ? undefined : props.plan.variables?.[editingName]"
      :existing-names="Object.keys(props.plan.variables ?? {})"
      :kind="selectedKind"
      :name="editingName"
      @close="showDialog = false"
      @save="saveVariable"
    />
    <VariableChooserDialog
      v-if="showChooser"
      @choose="chooseVariableKind"
      @close="showChooser = false"
    />
    <ConfirmationModal
      v-if="removingName !== undefined"
      :cancel-label="t('editor.cancel')"
      :confirm-label="t('editor.remove')"
      confirm-style="danger"
      :message="t('editor.removeVariableConfirmation', { name: removingName })"
      :title="t('editor.confirmationTitle')"
      @cancel="removingName = undefined"
      @confirm="removeVariable"
    />
    <BundleIssuesModal
      v-if="removalIssues"
      :close-label="t('editor.close')"
      :issues="removalIssues"
      :message="t('editor.variableRemovalBlocked')"
      :title="t('editor.variableDependencyTitle')"
      @close="removalIssues = undefined"
    />
  </section>
</template>

<style scoped>
.variable-card-pattern {
  align-content: center;
  color: var(--bs-secondary-color);
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(6, minmax(0, 0.2fr));
  opacity: 0.05;
  pointer-events: none;
  transform: rotate(-12deg) scale(1.5);
}

.variable-card-pattern :deep(svg) {
  font-size: 2.75rem;
  justify-self: center;
}
</style>
