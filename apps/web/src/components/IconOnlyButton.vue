<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

interface BootstrapPopover {
  dispose: () => void;
}

interface BootstrapApi {
  Popover: new (element: Element, options: { container: string; content: string; placement: string; trigger: string }) => BootstrapPopover;
}

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  icon: string;
  label: string;
  pressed?: boolean;
}>();

const button = ref<HTMLButtonElement>();
let popover: BootstrapPopover | undefined;

watch(() => props.label, async () => {
  popover?.dispose();
  popover = undefined;
  await nextTick();
  const bootstrapApi = (window as unknown as { bootstrap?: BootstrapApi }).bootstrap;
  if (button.value === undefined || bootstrapApi === undefined) {
    return;
  }
  popover = new bootstrapApi.Popover(button.value, { container: 'body', content: props.label, placement: 'top', trigger: 'hover focus' });
}, { immediate: true });

onBeforeUnmount(() => {
  popover?.dispose();
});
</script>

<template>
  <button ref="button" v-bind="$attrs" :aria-pressed="props.pressed" type="button"><i :class="props.icon" aria-hidden="true"></i><span class="visually-hidden">{{ props.label }}</span></button>
</template>
