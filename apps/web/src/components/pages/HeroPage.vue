<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  import: [file: File];
  new: [];
}>();
const importInput = ref<HTMLInputElement>();

/*
Opens the browser file chooser for a portable plan bundle.
---
Inputs: A user activation of the Import option.
---
Output: The browser opens its file chooser.
*/
function requestImport(): void {
  importInput.value?.click();
}

/*
Passes a selected portable bundle to the application shell.
---
Inputs: A browser file-input change event.
---
Output: The selected ZIP file is emitted once.
*/
function chooseImport(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.item(0);
  input.value = '';
  if (file !== null && file !== undefined) {
    emit('import', file);
  }
}
</script>

<template>
  <section
    class="hero-page d-flex align-items-center justify-content-center py-5"
  >
    <div
      class="text-center"
    >
      <h1
        class="display-5 mb-4"
      >What would you like to do?</h1>
      <div
        class="d-grid gap-3 mx-auto hero-actions"
      >
        <button
          class="btn btn-primary btn-lg"
          type="button"
          @click="emit('new')"
        >New</button>
        <button
          class="btn btn-outline-primary btn-lg"
          type="button"
          @click="requestImport"
        >Import</button>
        <input
          ref="importInput"
          class="d-none"
          type="file"
          accept=".zip,application/zip"
          @change="chooseImport"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-page {
  min-height: calc(100vh - 10rem);
}

.hero-actions {
  max-width: 22rem;
}
</style>
