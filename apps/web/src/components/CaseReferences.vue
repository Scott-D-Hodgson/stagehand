<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { CaseDraft, PlanDraft } from '../document/plan-draft';

interface BootstrapModal { dispose(): void; hide(): void; show(): void }

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  cases: PlanDraft['cases'];
  selectedPath: string;
}>();
const emit = defineEmits<{ add: [path: string]; move: [index: number, direction: -1 | 1]; remove: [index: number]; select: [path: string]; update: [index: number, path: string] }>();

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
onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement, options?: { backdrop?: 'static' }) => BootstrapModal } }).bootstrap.Modal(modalElement.value!, { backdrop: 'static' });
  modalElement.value?.addEventListener('shown.bs.modal', () => caseNameInput.value?.focus());
});
onBeforeUnmount(() => { modal?.dispose(); });
</script>

<template>
  <section class="border-top mt-4 pt-3" aria-labelledby="case-references-heading">
    <h2 id="case-references-heading" class="h5">{{ t('editor.caseReferences') }}</h2>
    <TransitionGroup name="case-reference" tag="div" class="mb-3">
      <article v-for="(caseReference, index) in cases" :key="caseReference.path" :class="['card', 'mb-3', { 'case-reference-active': caseReference.path === selectedPath }]">
        <div :class="['card-header', 'case-reference-header', 'position-relative', 'p-0', { 'bg-body': caseReference.path !== selectedPath, 'bg-body-secondary': caseReference.path === selectedPath }]">
          <h3 class="h6 mb-0">
            <button :class="['case-reference-toggle', 'btn', 'rounded-0', 'text-start', 'text-decoration-none', 'w-100']" type="button" :aria-controls="`case-reference-panel-${index}`" :aria-expanded="caseReference.path === selectedPath" @click="emit('select', caseReference.path)">
              <span class="font-monospace text-break">{{ caseReference.path }}</span>
              <span v-if="caseReference.path !== selectedPath" class="ms-2 text-body-secondary">{{ t('editor.caseStepCount', { count: caseDrafts[caseReference.path]?.steps.length ?? 0 }) }}</span>
            </button>
          </h3>
          <div class="case-reference-actions d-flex flex-wrap gap-2 position-absolute top-50 end-0 translate-middle-y me-3 z-1">
            <button
              class="btn btn-outline-secondary btn-sm"
              type="button"
              :disabled="index === 0"
              @click.stop="emit('move', index, -1)"
            >
              {{ t('editor.moveStepUp') }}
            </button>
            <button
              class="btn btn-outline-secondary btn-sm"
              type="button"
              :disabled="index === cases.length - 1"
              @click.stop="emit('move', index, 1)"
            >
              {{ t('editor.moveStepDown') }}
            </button>
            <button class="btn btn-outline-secondary btn-sm" type="button" @click.stop="openDialog(index)">{{ t('editor.edit') }}</button>
            <button class="btn btn-outline-danger btn-sm" type="button" @click.stop="emit('remove', index)">{{ t('editor.removeCaseReference') }}</button>
          </div>
        </div>
        <div v-if="caseReference.path === selectedPath" :id="`case-reference-panel-${index}`" class="card-body border-top">
          <slot name="case-details" :path="caseReference.path" />
        </div>
      </article>
    </TransitionGroup>
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
            <input id="case-name" ref="caseNameInput" v-model="caseName" class="form-control" required />
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
  </section>
</template>

<style scoped>
.case-reference-move {
  transition: transform 180ms ease;
}

.case-reference-toggle {
  padding: 1rem 12rem 1rem 1rem;
}

.case-reference-active {
  border-color: var(--bs-emphasis-color);
}
</style>
