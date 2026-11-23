<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  icon: string;
  label: string;
  pressed?: boolean;
}>();
</script>

<template>
  <button
    v-bind="$attrs"
    class="icon-only-button"
    :aria-pressed="props.pressed"
    type="button"
  ><i :class="props.icon" aria-hidden="true"></i><span class="visually-hidden">{{ props.label }}</span></button>
</template>

<style scoped>
.icon-only-button.bg-body:hover,
.icon-only-button.bg-body:focus-visible {
  background-color: var(--bs-btn-hover-bg) !important;
}

.icon-only-button.bg-body:active {
  background-color: var(--bs-btn-active-bg) !important;
}
</style>
