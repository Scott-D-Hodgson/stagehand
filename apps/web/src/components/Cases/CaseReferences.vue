<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { CaseBrowserSettingsDraft, CaseDraft, PlanBrowserSettingsDraft, PlanDraft } from '../../document/plan-draft';
import CaseDetails from './CaseDetails.vue';

interface BootstrapModal { dispose(): void; hide(): void; show(): void }

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  cases: PlanDraft['cases'];
  editing: boolean;
  planBrowser: PlanBrowserSettingsDraft | undefined;
  planLocale: string;
  selectedPath: string;
}>();
const emit = defineEmits<{
  add: [path: string];
  move: [index: number, direction: -1 | 1];
  remove: [index: number];
  'remove:step': [path: string, index: number];
  select: [path: string];
  update: [index: number, path: string];
  'update:browser': [path: string, browser: CaseBrowserSettingsDraft | undefined];
  'update:case-id': [path: string, id: string];
  'update:steps': [path: string, steps: unknown[]];
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

onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => caseNameInput.value?.focus());
});
onBeforeUnmount(() => { modal?.dispose(); });
</script>

<template>
  <section aria-labelledby="case-references-heading">
    <h2 id="case-references-heading" class="h5">{{ t('editor.caseReferences') }}</h2>
    <TransitionGroup name="case-reference" tag="div" class="mb-3">
      <CaseDetails
        v-for="(caseReference, index) in cases"
        :key="caseReference.path"
        :case-count="cases.length"
        :case-drafts="caseDrafts"
        :case-index="index"
        :case-path="caseReference.path"
        :editing="editing"
        :expanded="!editing || caseReference.path === selectedPath"
        :plan-browser="planBrowser"
        :plan-locale="planLocale"
        @edit-reference="openDialog"
        @move-reference="moveReference"
        @remove-reference="emit('remove', $event)"
        @remove:step="removeStep"
        @select-reference="emit('select', $event)"
        @update:browser="updateBrowserSettings"
        @update:case-id="updateCaseId"
        @update:steps="updateSteps"
      />
    </TransitionGroup>
    <button v-if="editing" class="btn btn-secondary" type="button" @click="() => openDialog()">{{ t('editor.addCaseReference') }}</button>
    <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="add-case-heading" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content" @submit.prevent="addReference">
          <div class="modal-header">
            <h2 id="add-case-heading" class="h5 modal-title">{{ t('editor.caseReference') }}</h2>
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
            <button class="btn btn-secondary" type="button" @click="closeDialog">{{ t('editor.cancel') }}</button>
            <button class="btn btn-secondary" type="submit">{{ t('editor.save') }}</button>
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
