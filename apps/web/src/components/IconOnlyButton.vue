<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

interface BootstrapPopover {
  dispose: () => void;
  hide: () => void;
  show: () => void;
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
let mouseIsOverButton = false;
let keyboardFocusIsOnButton = false;

watch(() => props.label, async () => {
  popover?.dispose();
  popover = undefined;
  await nextTick();
  const bootstrapApi = (window as unknown as { bootstrap?: BootstrapApi }).bootstrap;
  if (button.value === undefined || bootstrapApi === undefined) {
    return;
  }
  popover = new bootstrapApi.Popover(button.value, { container: 'body', content: props.label, placement: 'top', trigger: 'manual' });
}, { immediate: true });

onBeforeUnmount(() => {
  popover?.dispose();
});

/*
Shows or hides the popover from the current hover and keyboard-focus state.
---
Inputs: The tracked mouse and keyboard-focus state for this button.
---
Output: A visible popover only while either supported trigger remains active.
*/
function updatePopoverVisibility(): void {
  if (mouseIsOverButton || keyboardFocusIsOnButton) {
    popover?.show();
    return;
  }
  popover?.hide();
}

/*
Shows the popover while a mouse hovers over the icon-only button.
---
Inputs: A mouse-enter event from the button.
---
Output: A visible popover until mouse leave and loss of keyboard focus.
*/
function showPopoverOnMouseEnter(): void {
  mouseIsOverButton = true;
  updatePopoverVisibility();
}

/*
Hides the hover contribution after a mouse leaves the icon-only button.
---
Inputs: A mouse-leave event from the button.
---
Output: A hidden popover unless keyboard focus remains active.
*/
function hidePopoverOnMouseLeave(): void {
  mouseIsOverButton = false;
  updatePopoverVisibility();
}

/*
Shows the popover for keyboard-visible focus without treating mouse clicks as focus help.
---
Inputs: A focus event from the icon-only button.
---
Output: A visible popover only for focus-visible keyboard navigation.
*/
function showPopoverOnKeyboardFocus(event: FocusEvent): void {
  keyboardFocusIsOnButton = (event.currentTarget as HTMLElement).matches(':focus-visible');
  updatePopoverVisibility();
}

/*
Removes the keyboard-focus contribution when the icon-only button loses focus.
---
Inputs: A focus-out event from the button.
---
Output: A hidden popover unless mouse hover remains active.
*/
function hidePopoverOnFocusOut(): void {
  keyboardFocusIsOnButton = false;
  updatePopoverVisibility();
}
</script>

<template>
  <button ref="button" v-bind="$attrs" class="icon-only-button" :aria-pressed="props.pressed" type="button" @focusin="showPopoverOnKeyboardFocus" @focusout="hidePopoverOnFocusOut" @mouseenter="showPopoverOnMouseEnter" @mouseleave="hidePopoverOnMouseLeave"><i :class="props.icon" aria-hidden="true"></i><span class="visually-hidden">{{ props.label }}</span></button>
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
