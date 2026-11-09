<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';

interface BootstrapModal { dispose(): void; hide(): void; show(): void; }

const emit = defineEmits<{ create: [id: string]; }>();
const { t } = useTranslation();
const modalElement = ref<HTMLElement>();
const planId = ref('');
let modal: BootstrapModal | undefined;

/*
Suggests a filename-safe plan identifier from entered text.
---
Inputs: The raw plan name entered by the author.
---
Output: A lower-case hyphenated identifier.
*/
function suggestPlanId(name: string): string {
  return name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'new-plan';
}

/*
Closes the new-plan dialog without changing the current bundle.
---
Inputs: A cancel interaction.
---
Output: A hidden dialog.
*/
function cancel(): void {
  modal?.hide();
}

/*
Creates a new plan request with the entered identifier.
---
Inputs: The current plan-ID field value.
---
Output: A new-plan event and hidden dialog.
*/
function create(): void {
  emit('create', planId.value.trim());
  modal?.hide();
}

watch(planId, (id) => { planId.value = suggestPlanId(id); });
onMounted(() => {
  modal = new (window as unknown as Window & { bootstrap: { Modal: new (element: HTMLElement) => BootstrapModal } }).bootstrap.Modal(modalElement.value!);
  modal.show();
});
onBeforeUnmount(() => modal?.dispose());
</script>

<template>
  <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="new-plan-heading" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="create">
        <div class="modal-header">
          <h2 id="new-plan-heading" class="h5 modal-title">{{ t('editor.newPlan') }}</h2>
          <button class="btn-close" type="button" :aria-label="t('editor.close')" @click="cancel"></button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="new-plan-id">{{ t('editor.planId') }}</label>
          <input id="new-plan-id" v-model="planId" class="form-control" required />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="cancel">{{ t('editor.cancel') }}</button>
          <button class="btn btn-primary" type="submit">{{ t('editor.create') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
