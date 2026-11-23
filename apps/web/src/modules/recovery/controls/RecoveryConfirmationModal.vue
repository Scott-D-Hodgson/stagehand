<script setup lang="ts">
defineProps<{
  message: string;
  title: string;
  yesLabel: string;
  noLabel: string;
}>();

const emit = defineEmits<{
  no: [];
  yes: [];
}>();
</script>

<template>
  <Teleport
    to="body"
  >
    <div
      class="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recovery-confirmation-heading"
      aria-describedby="recovery-confirmation-message"
    >
      <div
        class="modal-dialog modal-dialog-centered"
      >
        <div
          class="modal-content"
        >
          <div
            class="modal-header"
          >
            <h2
              id="recovery-confirmation-heading"
              class="h5 modal-title"
            >{{ title }}</h2>
          </div>
          <div
            class="modal-body"
          >
            <p
              id="recovery-confirmation-message"
              class="mb-0"
            >{{ message }}</p>
          </div>
          <div
            class="modal-footer"
          >
            <button
              class="btn btn-danger"
              type="button"
              @click="emit('no')"
            >{{ noLabel }}</button>
            <button
              class="btn btn-primary"
              type="button"
              @click="emit('yes')"
            >{{ yesLabel }}</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop show"
    ></div>
  </Teleport>
</template>
