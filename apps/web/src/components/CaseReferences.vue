<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { PlanDraft } from '../document/plan-draft';

interface BootstrapModal { dispose(): void; hide(): void; show(): void }

const props = defineProps<{
  cases: PlanDraft['cases']
}>();
const emit = defineEmits<{ add: [path: string]; remove: [index: number]; update: [index: number, path: string] }>();

const { t } = useTranslation();
const caseName = ref('');
const casePath = ref('');
const editingIndex = ref<number | undefined>();
const pathError = ref('');
const modalElement = ref<HTMLElement>();
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
onMounted(() => { modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement) => BootstrapModal } }).bootstrap.Modal(modalElement.value!); });
onBeforeUnmount(() => { modal?.dispose(); });
</script>

<template>
  <section class="card mb-3 shadow-sm" aria-labelledby="case-references-heading">
    <div class="card-body">
      <h2 id="case-references-heading" class="h5">{{ t('editor.caseReferences') }}</h2>
      <ul class="list-unstyled mb-3">
        <li v-for="(caseReference, index) in cases" :key="index" class="d-flex justify-content-between align-items-center gap-2 py-1">
          <span class="font-monospace">{{ caseReference.path }}</span>
          <span class="d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm" type="button" @click="openDialog(index)">{{ t('editor.edit') }}</button>
            <button class="btn btn-outline-danger btn-sm" type="button" @click="emit('remove', index)">{{ t('editor.removeCaseReference') }}</button>
          </span>
        </li>
      </ul>
      <button class="btn btn-outline-primary" type="button" @click="() => openDialog()">{{ t('editor.addCaseReference') }}</button>
      <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="add-case-heading" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <form class="modal-content" @submit.prevent="addReference">
            <div class="modal-header">
              <h2 id="add-case-heading" class="h5 modal-title">{{ t('editor.caseReference') }}</h2>
              <button class="btn-close" type="button" :aria-label="t('editor.close')" @click="closeDialog"></button>
            </div>
            <div class="modal-body">
              <label class="form-label" for="case-name">{{ t('editor.name') }}</label>
              <input id="case-name" v-model="caseName" class="form-control" required />
              <label class="form-label mt-3" for="case-path">{{ t('editor.referencePath') }}</label>
              <input id="case-path" v-model="casePath" class="form-control font-monospace" required />
              <div v-if="pathError" class="invalid-feedback d-block">{{ pathError }}</div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" @click="closeDialog">{{ t('editor.cancel') }}</button>
              <button class="btn btn-primary" type="submit">{{ t('editor.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
