<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { AccessibilitySettingsDraft, CaseBrowserSettingsDraft, CaseDraft, PlanBrowserSettingsDraft, PlanDraft } from '../../document/plan-draft';
import IconOnlyButton from '../IconOnlyButton.vue';
import CaseDetails from './CaseDetails.vue';

interface BootstrapModal { dispose(): void; hide(): void; show(): void }

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  cases: PlanDraft['cases'];
  editing: boolean;
  planAccessibility: AccessibilitySettingsDraft | undefined;
  planBrowser: PlanBrowserSettingsDraft | undefined;
  planLocale: string;
  planTimeout: unknown;
  selectedPath: string;
  overview?: boolean;
}>();
const emit = defineEmits<{
  add: [path: string];
  move: [index: number, direction: -1 | 1];
  remove: [index: number];
  'remove:step': [path: string, index: number];
  select: [path: string];
  update: [index: number, path: string];
  'update:accessibility': [path: string, accessibility: AccessibilitySettingsDraft | undefined];
  'update:browser': [path: string, browser: CaseBrowserSettingsDraft | undefined];
  'update:case-id': [path: string, id: string];
  'update:steps': [path: string, steps: unknown[]];
  'update:timeout': [path: string, timeout: unknown | undefined];
}>();

const { t } = useTranslation();
const caseName = ref('');
const casePath = ref('');
const editingIndex = ref<number | undefined>();
const pathError = ref('');
const modalElement = ref<HTMLElement>();
const caseNameInput = ref<HTMLInputElement>();
let modal: BootstrapModal | undefined;

/*
Creates a filename-safe suggested path from a case name.
---
Inputs: A case name entered by the author.
---
Output: A relative JSON case-reference path.
*/
function suggestPath(name: string): string {
  return `cases/${name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'new-case'}.json`;
}

watch(caseName, (name) => {
  casePath.value = suggestPath(name);
});

/*
Prepares and displays the Bootstrap case-reference dialog.
---
Inputs: An optional index for the reference being edited.
---
Output: An open dialog with the appropriate fields populated.
*/
function openDialog(index?: number): void {
  editingIndex.value = index;
  caseName.value = '';
  casePath.value = index === undefined ? '' : props.cases[index]?.path ?? '';
  pathError.value = '';
  modal?.show();
}

/*
Closes the Bootstrap case-reference dialog.
---
Inputs: A cancel or successful submission interaction.
---
Output: A hidden dialog.
*/
function closeDialog(): void {
  modal?.hide();
}

/*
Adds or updates a case reference after checking for duplicate paths.
---
Inputs: The current dialog field values.
---
Output: An add or update event, or a displayed duplicate-path error.
*/
function addReference(): void {
  const path = casePath.value.trim();
  const duplicate = props.cases.some((reference, index) => reference.path === path && index !== editingIndex.value);
  if (duplicate) {
    pathError.value = t('editor.duplicateCaseReference');
    return;
  }
  if (path) {
    editingIndex.value === undefined
      ? emit('add', path)
      : emit('update', editingIndex.value, path);
    closeDialog();
  }
}

/*
Passes a case-reference movement request to the owning plan bundle.
---
Inputs: The selected reference index and an adjacent movement direction.
---
Output: A case-reference movement event.
*/
function moveReference(options: { direction: -1 | 1; index: number }): void {
  emit('move', options.index, options.direction);
}

/*
Passes a case-step removal request to the owning plan bundle.
---
Inputs: A case-reference path and selected step index.
---
Output: A case-step removal event.
*/
function removeStep(path: string, index: number): void {
  emit('remove:step', path, index);
}

/*
Passes a browser override update to the owning plan bundle.
---
Inputs: A case-reference path and optional browser override.
---
Output: A case-browser update event.
*/
function updateBrowserSettings(path: string, browser: CaseBrowserSettingsDraft | undefined): void {
  emit('update:browser', path, browser);
}

/*
Passes an accessibility override update to the owning plan bundle.
---
Inputs: A case-reference path and optional accessibility override.
---
Output: A case-accessibility update event.
*/
function updateAccessibilitySettings(path: string, accessibility: AccessibilitySettingsDraft | undefined): void {
  emit('update:accessibility', path, accessibility);
}

/*
Passes a case identifier update to the owning plan bundle.
---
Inputs: A case-reference path and replacement identifier.
---
Output: A case-ID update event.
*/
function updateCaseId(path: string, id: string): void {
  emit('update:case-id', path, id);
}

/*
Passes a replacement case-step list to the owning plan bundle.
---
Inputs: A case-reference path and ordered step data.
---
Output: A case-step update event.
*/
function updateSteps(path: string, steps: unknown[]): void {
  emit('update:steps', path, steps);
}

/*
Passes a case timeout override update to the owning plan bundle.
---
Inputs: A case-reference path and optional timeout override.
---
Output: A case-timeout update event.
*/
function updateTimeout(path: string, timeout: unknown | undefined): void {
  emit('update:timeout', path, timeout);
}

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => caseNameInput.value?.focus());
});
onBeforeUnmount(() => { modal?.dispose(); });
</script>

<template>
  <section aria-labelledby="case-references-heading">
    <h2 id="case-references-heading" class="h3 my-3">{{ t('editor.caseReferences') }}</h2>
    <IconOnlyButton
      v-if="editing"
      class="btn btn-outline-secondary mb-3"
      icon="fa-solid fa-plus"
      :label="t('editor.add')"
      @click="() => openDialog()"
    />
    <TransitionGroup v-if="!props.overview" name="case-reference" tag="div" class="mb-3">
      <CaseDetails
        v-for="(caseReference, index) in cases"
        :key="caseReference.path"
        :case-count="cases.length"
        :case-drafts="caseDrafts"
        :case-index="index"
        :case-path="caseReference.path"
        :editing="editing"
        :expanded="!editing || caseReference.path === selectedPath"
        :plan-accessibility="planAccessibility"
        :plan-browser="planBrowser"
        :plan-locale="planLocale"
        :plan-timeout="planTimeout"
        @edit-reference="openDialog"
        @move-reference="moveReference"
        @remove-reference="emit('remove', $event)"
        @remove:step="removeStep"
        @select-reference="emit('select', $event)"
        @update:accessibility="updateAccessibilitySettings"
        @update:browser="updateBrowserSettings"
        @update:case-id="updateCaseId"
        @update:steps="updateSteps"
        @update:timeout="updateTimeout"
      />
    </TransitionGroup>
    <TransitionGroup v-else name="case-reference" tag="div" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mb-3">
      <div v-for="(caseReference, index) in cases" :key="caseReference.path" class="col">
        <article class="card shadow-sm h-100 bg-body-tertiary">
          <div class="card-body">
            <h3 class="h4">
              <RouterLink :to="{ name: 'case', params: { cardIndex: index } }" class="stretched-link text-decoration-none">{{ index + 1 }}. {{ caseDrafts[caseReference.path]?.id ?? caseReference.path }}</RouterLink>
            </h3>
            <p class="mb-2 text-body-secondary text-break">{{ caseReference.path }}</p>
            <div v-if="editing" class="d-flex justify-content-end position-relative z-1">
              <div class="btn-group btn-group-sm" role="group">
                <IconOnlyButton v-if="index !== 0" class="btn btn-outline-secondary bg-body" icon="fa-solid fa-arrow-up" :label="t('editor.moveStepUp')" @click.stop="moveReference({ direction: -1, index })" />
                <IconOnlyButton v-if="index !== cases.length - 1" class="btn btn-outline-secondary bg-body" icon="fa-solid fa-arrow-down" :label="t('editor.moveStepDown')" @click.stop="moveReference({ direction: 1, index })" />
                <IconOnlyButton class="btn btn-outline-secondary bg-body" icon="fa-solid fa-pen" :label="t('editor.edit')" @click.stop="openDialog(index)" />
                <IconOnlyButton class="btn btn-outline-danger bg-body" icon="fa-solid fa-minus" :label="t('editor.removeCaseReference')" @click.stop="emit('remove', index)" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </TransitionGroup>
    <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="add-case-heading" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content" @submit.prevent="addReference">
          <div class="modal-header">
            <h4 id="add-case-heading" class="h5 modal-title">{{ t('editor.caseReference') }}</h4>
            <button class="btn-close" type="button" :aria-label="t('editor.close')" @click="closeDialog"></button>
          </div>
          <div class="modal-body">
            <label class="form-label" for="case-name">{{ t('editor.name') }}</label>
            <input id="case-name" ref="caseNameInput" v-model="caseName" class="form-control" required />
            <label class="form-label mt-3" for="case-path">{{ t('editor.referencePath') }}</label>
            <input id="case-path" v-model="casePath" class="form-control font-monospace" required />
            <div v-if="pathError" class="invalid-feedback d-block">{{ pathError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" type="button" @click="closeDialog">{{ t('editor.cancel') }}</button>
            <button class="btn btn-primary" type="submit">{{ t('editor.save') }}</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-reference-move {
  transition: transform 180ms ease;
}
</style>
