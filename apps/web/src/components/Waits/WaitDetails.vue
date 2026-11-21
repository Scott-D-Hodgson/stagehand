<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import IconOnlyButton from '../IconOnlyButton.vue';
import DelayWaitDetails from './DelayWaitDetails.vue';
import LocatorWaitDetails from './LocatorWaitDetails.vue';
import PageStateWait from './PageStateWait.vue';
import type { WaitDraft } from './wait-draft';

const props = defineProps<{ actions?: boolean; editing: boolean; idPrefix: string; index: number; item: WaitDraft; validationRequested?: boolean; waitCount: number }>();
const emit = defineEmits<{ move: [direction: -1 | 1]; remove: []; update: [item: WaitDraft] }>();
const { t } = useTranslation();
const timeoutWasBlurred = ref(false);

/*
Updates the optional wait timeout while preserving its wait-specific settings.
---
Inputs: A raw timeout number-input event.
---
Output: A replacement wait draft with its timeout updated or removed.
*/
function updateTimeout(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  const { timeout: _, ...withoutTimeout } = props.item;
  emit('update', value === '' ? withoutTimeout as WaitDraft : { ...withoutTimeout, timeout: Number(value) } as WaitDraft);
}

/*
Marks the optional wait timeout field as ready to display validation feedback.
---
Inputs: The timeout field blur event.
---
Output: Enables timeout feedback for the local wait form.
*/
function validateTimeout(): void {
  timeoutWasBlurred.value = true;
}
</script>

<template>
  <article class="card shadow-sm bg-body-tertiary">
    <div class="card-body">
      <DelayWaitDetails v-if="'delay' in props.item" :editing="props.editing" :id-prefix="props.idPrefix" :item="props.item" :validation-requested="props.validationRequested" @update="emit('update', $event)" />
      <LocatorWaitDetails v-else-if="'waitFor' in props.item" :editing="props.editing" :id-prefix="props.idPrefix" :item="props.item" :validation-requested="props.validationRequested" @update="emit('update', $event)" />
      <PageStateWait v-else :editing="props.editing" :id-prefix="props.idPrefix" :item="props.item" @update="emit('update', $event)" />
      <template v-if="props.editing && !('delay' in props.item)">
        <label class="form-label mt-3" :for="`${props.idPrefix}-timeout`">{{ t('editor.stepTimeout') }}</label>
        <input :id="`${props.idPrefix}-timeout`" :class="['form-control', { 'is-invalid': (props.validationRequested || timeoutWasBlurred) && (typeof props.item.timeout !== 'number' || props.item.timeout < 1) }]" min="1" type="number" :value="props.item.timeout" @blur="validateTimeout" @input="updateTimeout" />
        <div v-if="(props.validationRequested || timeoutWasBlurred) && (typeof props.item.timeout !== 'number' || props.item.timeout < 1)" class="invalid-feedback d-block">{{ t('editor.stepTimeoutInvalid') }}</div>
      </template>
      <dl v-else-if="!('delay' in props.item) && props.item.timeout !== undefined" class="mb-0 mt-3">
        <dt>{{ t('editor.stepTimeout') }}</dt>
        <dd class="mb-0">{{ props.item.timeout }}</dd>
      </dl>
    </div>
    <div v-if="props.editing && props.actions !== false" class="card-footer">
      <div class="btn-group btn-group-sm" role="group">
        <IconOnlyButton v-if="props.index > 0" class="btn btn-outline-secondary" icon="fa-solid fa-arrow-up" :label="t('editor.moveStepUp')" @click="emit('move', -1)" />
        <IconOnlyButton v-if="props.index < props.waitCount - 1" class="btn btn-outline-secondary" icon="fa-solid fa-arrow-down" :label="t('editor.moveStepDown')" @click="emit('move', 1)" />
        <IconOnlyButton class="btn btn-outline-danger" icon="fa-solid fa-minus" :label="t('editor.remove')" @click="emit('remove')" />
      </div>
    </div>
  </article>
</template>
