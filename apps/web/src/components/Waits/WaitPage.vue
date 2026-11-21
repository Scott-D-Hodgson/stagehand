<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import WaitDetails from './WaitDetails.vue';
import { isWaitDraft, type WaitDraft } from './wait-draft';
import ConfirmationModal from '../dialogs/ConfirmationModal.vue';
import { showAppliedChanges } from '../../feedback/apply-feedback';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean }>();
const emit = defineEmits<{ 'update:after': [items: WaitDraft[]]; 'update:before': [items: WaitDraft[]] }>();
const route = useRoute();
const router = useRouter();
const { t } = useTranslation();
const position = computed(() => route.params.position === 'before' ? 'before' : 'after');
const waitIndex = computed(() => Number(route.params.waitIndex));
const items = computed(() => (position.value === 'before' ? props.before : props.after).filter(isWaitDraft));
const selectedWait = computed(() => items.value[waitIndex.value]);
const formWait = ref<WaitDraft>();
const validationRequested = ref(false);
const isFormWaitValid = computed(() => formWait.value !== undefined && isValidWait(formWait.value));
const pendingNavigation = ref<string>();
let navigationConfirmed = false;

/*
Copies reactive wait data into plain values suitable for local editing.
---
Inputs: A primitive, array, or object from a Vue-reactive wait draft.
---
Output: An independent plain value with no Vue proxies.
*/
function copyWaitValue(value: unknown): unknown {
  const rawValue = toRaw(value);
  if (Array.isArray(rawValue)) {
    return rawValue.map(copyWaitValue);
  }
  if (typeof rawValue === 'object' && rawValue !== null) {
    return Object.fromEntries(Object.entries(rawValue).map(([key, nestedValue]) => [key, copyWaitValue(nestedValue)]));
  }
  return rawValue;
}

const hasUnappliedChanges = computed(() => JSON.stringify(copyWaitValue(formWait.value)) !== JSON.stringify(copyWaitValue(selectedWait.value)));

watch(selectedWait, (item) => {
  formWait.value = item === undefined ? undefined : copyWaitValue(item) as WaitDraft;
  validationRequested.value = false;
}, { immediate: true });

/*
Confirms navigation that would discard an unapplied wait form.
---
Inputs: A destination captured by the route-leave guard.
---
Output: Navigation resumes only after explicit confirmation.
*/
function discardUnappliedChanges(): void {
  const destination = pendingNavigation.value;
  pendingNavigation.value = undefined;
  if (destination === undefined) {
    return;
  }
  navigationConfirmed = true;
  void router.push(destination);
}

const removeNavigationGuard = router.beforeEach((to) => {
  if (navigationConfirmed || !hasUnappliedChanges.value) {
    navigationConfirmed = false;
    return true;
  }
  pendingNavigation.value = to.fullPath;
  return false;
});

onBeforeUnmount(removeNavigationGuard);

/*
Gets the readable action label for the selected wait page.
---
Inputs: The selected contract-supported wait draft.
---
Output: A concise wait-type label.
*/
function getWaitTypeLabel(item: WaitDraft | undefined): string {
  if (item === undefined) {
    return t('editor.wait');
  }
  if ('delay' in item) {
    return t('editor.waitForDelay');
  }
  if ('waitFor' in item) {
    return t('editor.waitForLocator');
  }
  return t('editor.waitForState');
}

/*
Updates the local wait form without changing the owning interaction list.
---
Inputs: A replacement wait draft from the dedicated Wait page.
---
Output: A local draft awaiting explicit application.
*/
function updateFormWait(item: WaitDraft): void {
  formWait.value = item;
}

/*
Determines whether a local wait form can be applied to its owning list.
---
Inputs: A local wait draft with type-specific fields.
---
Output: Whether all required values and optional timeout are valid.
*/
function isValidWait(item: WaitDraft): boolean {
  if ('delay' in item) {
    return Number.isInteger(item.delay) && item.delay >= 1 && item.delay <= 30_000;
  }
  if ('waitFor' in item && item.waitFor.role.trim() === '') {
    return false;
  }
  return Number.isInteger(item.timeout) && (item.timeout as number) >= 1;
}

/*
Applies the validated local wait form to its owning interaction list.
---
Inputs: The current local wait form.
---
Output: An immutable Before-or-After list update while remaining on this page.
*/
function applyWait(): void {
  if (formWait.value === undefined) {
    return;
  }
  validationRequested.value = true;
  if (!isValidWait(formWait.value)) {
    return;
  }
  const next = [...items.value];
  next[waitIndex.value] = formWait.value;
  if (position.value === 'before') {
    emit('update:before', next);
  } else {
    emit('update:after', next);
  }
  showAppliedChanges();
}
</script>

<template>
  <section v-if="selectedWait && formWait" aria-labelledby="wait-page-heading">
    <h1 id="wait-page-heading" class="h2">{{ waitIndex + 1 }}. {{ getWaitTypeLabel(selectedWait) }}</h1>
    <WaitDetails :actions="false" :editing="props.editing" :id-prefix="`${position}-wait-${waitIndex}`" :index="waitIndex" :item="formWait" :validation-requested="validationRequested" :wait-count="items.length" @update="updateFormWait" />
    <div class="d-flex justify-content-between mt-4">
      <RouterLink :to="{ name: 'step', params: { cardIndex: route.params.cardIndex, stepIndex: route.params.stepIndex } }" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-turn-down-left" aria-hidden="true"></i> {{ t('editor.return') }}</RouterLink>
      <button v-if="props.editing" class="btn btn-primary" type="button" :disabled="!isFormWaitValid" @click="applyWait">{{ t('editor.apply') }}</button>
    </div>
  </section>
  <ConfirmationModal v-if="pendingNavigation" :cancel-label="t('editor.cancel')" :confirm-label="t('editor.discardLocalEdits')" :message="t('editor.discardUnappliedChangesConfirmation')" :title="t('editor.confirmationTitle')" @cancel="pendingNavigation = undefined" @confirm="discardUnappliedChanges" />
</template>
