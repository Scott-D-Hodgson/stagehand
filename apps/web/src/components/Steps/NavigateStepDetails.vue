<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ step: unknown }>();
const url = computed(() => (props.step as { url?: string }).url ?? '');
</script>

<template>
  <div>
    <p class="mb-0 text-body-secondary text-break">{{ url }}</p>
  </div>
</template>
