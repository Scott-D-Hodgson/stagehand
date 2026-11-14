<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { axeTagCatalogue } from '../accessibility/tag-catalogue';

const props = defineProps<{ id: string; modelValue: string[] | undefined }>();
const emit = defineEmits<{ 'update:modelValue': [tags: string[]] }>();
const { t } = useTranslation();
const search = ref('');
const selectedTags = computed(() => props.modelValue ?? []);
const visibleTags = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  if (query === '') {
    return axeTagCatalogue;
  }
  return axeTagCatalogue.filter((tag) => tag.toLocaleLowerCase().includes(query));
});

/*
Adds or removes one axe rule tag from the explicit selection.
---
Inputs: A catalogue tag and its selected state.
---
Output: A replacement ordered tag list.
*/
function changeTag(tag: string, selected: boolean): void {
  const tags = selected
    ? [...new Set([...selectedTags.value, tag])].sort((left, right) => left.localeCompare(right))
    : selectedTags.value.filter((candidate) => candidate !== tag);
  emit('update:modelValue', tags);
}
</script>

<template>
  <div>
    <label class="form-label" :for="`${props.id}-search`">{{ t('editor.filterAccessibilityRuleTags') }}</label>
    <input :id="`${props.id}-search`" v-model="search" class="form-control" type="search" :placeholder="t('editor.filterAccessibilityRuleTags')" />
    <p class="form-text">{{ t('editor.accessibilityRuleTagsHelp') }}</p>
    <p v-if="visibleTags.length === 0" class="text-body-secondary">{{ t('editor.noAccessibilityRuleTags') }}</p>
    <TransitionGroup v-else name="accessibility-tag" tag="ul" class="list-unstyled d-flex flex-wrap gap-2 mb-0">
      <li v-for="tag in visibleTags" :key="tag" class="ps-2">
        <div class="form-check">
          <input :id="`${props.id}-${tag}`" class="form-check-input" type="checkbox" :checked="selectedTags.includes(tag)" @change="changeTag(tag, ($event.target as HTMLInputElement).checked)" />
          <label class="form-check-label" :for="`${props.id}-${tag}`">{{ tag }}</label>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.accessibility-tag-enter-active,
.accessibility-tag-leave-active,
.accessibility-tag-move {
  transition: opacity 180ms ease-in-out, transform 180ms ease-in-out;
}

.accessibility-tag-enter-from,
.accessibility-tag-leave-to {
  opacity: 0;
}

.accessibility-tag-leave-active {
  position: absolute;
}
</style>
