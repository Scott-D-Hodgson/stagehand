<script setup lang="ts">
defineProps<{ icon: string }>();
</script>

<template>
  <div
    class="step-card-pattern position-absolute top-0 start-0 w-100 h-100"
    aria-hidden="true"
  >
    <i
      v-for="index in 12"
      :key="index"
      :class="icon"
    ></i>
  </div>
</template>

<style scoped>
.step-card-pattern {
  align-content: center;
  color: var(--bs-secondary-color);
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(6, minmax(0, 0.2fr));
  opacity: 0.05;
  pointer-events: none;
  transform: rotate(-12deg) scale(1.50);
}
.step-card-pattern :deep(svg) {
  font-size: 2.75rem;
  justify-self: center;
}
</style>
