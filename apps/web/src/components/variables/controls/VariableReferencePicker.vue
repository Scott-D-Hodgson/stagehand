<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import VariableDetails from '../details/VariableDetails.vue';
import VariableWatermark from './VariableWatermark.vue';
import type { VariableDefinitionDraft } from '../../../services/planDraftService';

const props = defineProps<{ id: string; locale: string; modelValue: string; variables: Record<string, VariableDefinitionDraft> }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const { t } = useTranslation();
const showOther = ref(false);

/*
Lists the selected variable or available alternatives in name order.
---
Inputs: Variable definitions, the selected name, and the alternatives toggle.
---
Output: Visible variable cards.
*/
const visible = computed(
  () => Object.entries(props.variables)
    .filter(([name]) => showOther.value || !Object.hasOwn(props.variables, props.modelValue) || name === props.modelValue)
    .sort(([first], [second]) => first.localeCompare(second))
);
</script>

<template>
  <fieldset
    class="mt-3"
  >
    <legend
      class="fs-6"
    >{{ t('editor.selectVariable') }}</legend>
    <p
      v-if="props.modelValue && !Object.hasOwn(props.variables, props.modelValue)"
      class="text-danger"
    >{{ t('editor.variableUnavailable', { name: props.modelValue }) }}</p>
    <p
      v-if="Object.keys(props.variables).length === 0"
      class="text-body-secondary"
    >{{ t('editor.noVariables') }}</p>
    <div
      v-if="Object.hasOwn(props.variables, props.modelValue) && Object.keys(props.variables).length > 1"
      class="form-check form-switch mb-3"
    >
      <input
        :id="`${props.id}-others`"
        v-model="showOther"
        class="form-check-input"
        type="checkbox"
      />
      <label
        class="form-check-label"
        :for="`${props.id}-others`"
      >{{ t('editor.showOtherVariables') }}</label>
    </div>
    <div
      class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3"
    >
      <div
        v-for="[name, definition] in visible"
        :key="name"
        class="col"
      >
        <label
          :class="['card h-100 bg-body shadow-sm overflow-hidden', { 'border-primary': name === props.modelValue }]"
        >
          <VariableWatermark
            :definition="definition"
          />
          <div
            class="card-body position-relative"
          >
            <input
              class="form-check-input float-end"
              type="radio"
              :name="props.id"
              :value="name"
              :checked="name === props.modelValue"
              @change="emit('update:modelValue', name); showOther = false"
            />
            <VariableDetails
              :definition="definition"
              :name="name"
              :plan-locale="props.locale"
            />
          </div>
        </label>
      </div>
    </div>
  </fieldset>
</template>
