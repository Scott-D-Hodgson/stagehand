<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../IconOnlyButton.vue';
import WaitChooserDialog, { type WaitType } from '../dialogs/WaitChooserDialog.vue';
import WaitItemDialog from '../dialogs/WaitItemDialog.vue';
import WaitCard from './WaitCard.vue';
import { isWaitDraft, type WaitDraft } from './wait-draft';

type WaitListPosition = 'after' | 'before';

const props = defineProps<{ after: unknown[]; before: unknown[]; editing: boolean }>();
const emit = defineEmits<{ 'update:after': [items: WaitDraft[]]; 'update:before': [items: WaitDraft[]] }>();
const { t } = useTranslation();
const chooserPosition = ref<WaitListPosition>();
const newWait = ref<{ position: WaitListPosition; type: WaitType }>();
const beforeItems = computed(() => props.before.filter(isWaitDraft));
const afterItems = computed(() => props.after.filter(isWaitDraft));

/*
Gets a stable render key for one persisted wait value during list reordering.
---
Inputs: A list position, wait draft, its index, and its ordered wait list.
---
Output: A value-based key that survives immutable draft copying.
*/
function getWaitKey(position: WaitListPosition, item: WaitDraft, index: number, items: WaitDraft[]): string {
  const value = JSON.stringify(item);
  const occurrence = items.slice(0, index).filter((candidate) => JSON.stringify(candidate) === value).length;
  return `${position}-${value}-${occurrence}`;
}

/*
Emits the updated ordered list for one interaction boundary.
---
Inputs: The Before-or-After list and its replacement wait drafts.
---
Output: An immutable interaction wait-list update.
*/
function updateList(position: WaitListPosition, items: WaitDraft[]): void {
  if (position === 'before') {
    emit('update:before', items);
    return;
  }
  emit('update:after', items);
}

/*
Opens the type chooser for a new wait at an interaction boundary.
---
Inputs: The Before-or-After list receiving the new wait.
---
Output: A visible wait-type chooser.
*/
function openChooser(position: WaitListPosition): void {
  chooserPosition.value = position;
}

/*
Opens the selected wait type's details form after the chooser closes.
---
Inputs: A selected wait type from the chooser.
---
Output: A visible wait-details dialog for the selected list position.
*/
function openWaitDialog(type: WaitType): void {
  if (chooserPosition.value === undefined) {
    return;
  }
  newWait.value = { position: chooserPosition.value, type };
  chooserPosition.value = undefined;
}

/*
Adds a validated wait to its selected interaction boundary.
---
Inputs: A completed contract-shaped wait draft.
---
Output: A replacement ordered list with the new final wait.
*/
function addWait(item: WaitDraft): void {
  if (newWait.value === undefined) {
    return;
  }
  const position = newWait.value.position;
  const items = position === 'before' ? beforeItems.value : afterItems.value;
  updateList(position, [...items, item]);
  newWait.value = undefined;
}

/*
Moves one wait by one adjacent ordered position.
---
Inputs: A list position, item index, and promote-or-demote direction.
---
Output: A replacement list with two adjacent waits exchanged.
*/
function moveWait(position: WaitListPosition, index: number, direction: -1 | 1): void {
  const items = [...(position === 'before' ? beforeItems.value : afterItems.value)];
  const destination = index + direction;
  if (destination < 0 || destination >= items.length) {
    return;
  }
  [items[index], items[destination]] = [items[destination]!, items[index]!];
  updateList(position, items);
}

/*
Removes one wait from its ordered interaction boundary list.
---
Inputs: A list position and target item index.
---
Output: A replacement list without the selected wait.
*/
function removeWait(position: WaitListPosition, index: number): void {
  const items = [...(position === 'before' ? beforeItems.value : afterItems.value)];
  items.splice(index, 1);
  updateList(position, items);
}
</script>

<template>
  <section aria-labelledby="waits-heading">
    <h2 id="waits-heading" class="h3 mb-3">{{ t('editor.waits') }}</h2>
    <section aria-labelledby="before-waits-heading">
      <h3 id="before-waits-heading" class="h5">{{ t('editor.before') }}</h3>
      <IconOnlyButton v-if="props.editing" class="btn btn-outline-secondary btn-sm my-1" icon="fa-solid fa-plus" :label="t('editor.add')" @click="openChooser('before')" />
      <p v-if="beforeItems.length === 0" class="mb-0 mt-3 text-body-secondary">{{ t('editor.noWaits') }}</p>
      <TransitionGroup v-else name="wait" tag="div" class="row row-cols-1 row-cols-lg-2 g-3 mt-0">
        <div v-for="(item, index) in beforeItems" :key="getWaitKey('before', item, index, beforeItems)" class="col">
          <WaitCard :editing="props.editing" :index="index" :item="item" position="before" :wait-count="beforeItems.length" @move="moveWait('before', index, $event)" @remove="removeWait('before', index)" />
        </div>
      </TransitionGroup>
    </section>
    <section class="mt-4" aria-labelledby="after-waits-heading">
      <h3 id="after-waits-heading" class="h5">{{ t('editor.after') }}</h3>
      <IconOnlyButton v-if="props.editing" class="btn btn-outline-secondary btn-sm my-1" icon="fa-solid fa-plus" :label="t('editor.add')" @click="openChooser('after')" />
      <p v-if="afterItems.length === 0" class="mb-0 mt-3 text-body-secondary">{{ t('editor.noWaits') }}</p>
      <TransitionGroup v-else name="wait" tag="div" class="row row-cols-1 row-cols-lg-2 g-3 mt-0">
        <div v-for="(item, index) in afterItems" :key="getWaitKey('after', item, index, afterItems)" class="col">
          <WaitCard :editing="props.editing" :index="index" :item="item" position="after" :wait-count="afterItems.length" @move="moveWait('after', index, $event)" @remove="removeWait('after', index)" />
        </div>
      </TransitionGroup>
    </section>
    <WaitChooserDialog v-if="chooserPosition !== undefined" @choose="openWaitDialog" @close="chooserPosition = undefined" />
    <WaitItemDialog v-if="newWait !== undefined" :type="newWait.type" @close="newWait = undefined" @save="addWait" />
  </section>
</template>

<style scoped>
.wait-move {
  transition: transform 180ms ease-in-out;
}
</style>
