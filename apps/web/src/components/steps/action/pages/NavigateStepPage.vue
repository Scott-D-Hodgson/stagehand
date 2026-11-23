<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import WaitReferences from '../../../waits/WaitReferences.vue';
import StepTimeoutOverride from '../../StepTimeoutOverride.vue';

const props = defineProps<{
  editing: boolean;
  after: unknown[];
  before: unknown[];
  index: number;
  inheritedTimeout: number;
  saveUrl: (url: string) => void;
  timeout: unknown;
  url: string;
}>();
const emit = defineEmits<{ 'update:after': [items: unknown[]]; 'update:before': [items: unknown[]]; 'update:timeout': [timeout: number | string]; 'update:url': [url: string] }>();
const { t } = useTranslation();
const selectedTab = ref<'default' | 'overrides' | 'waits'>('default');
const urlWasBlurred = ref(false);
const url = ref(props.url);

watch(() => props.url, (value) => {
  url.value = value;
});

/*
Checks whether the Navigate URL is an absolute HTTP or HTTPS address.
---
Inputs: The current URL field value.
---
Output: True only for a usable absolute HTTP or HTTPS URL.
*/
function isValidNavigateUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname !== '';
  } catch {
    return false;
  }
}

/*
Marks the Navigate URL as ready to show validation feedback.
---
Inputs: The Navigate URL blur event.
---
Output: Enables URL validation feedback.
*/
function validateNavigateUrl(): void {
  urlWasBlurred.value = true;
  emit('update:url', url.value);
}

/*
Applies the current Navigate URL after synchronizing the local input.
---
Inputs: The current URL field value.
---
Output: A synchronized local step followed by an Apply request.
*/
function applyDefault(): void {
  props.saveUrl(url.value);
}
</script>

<template>
  <section
    aria-label="Navigate step details"
  >
    <ul
      class="nav nav-pills my-3"
      role="tablist"
    >
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'default' }]"
          type="button"
          @click="selectedTab = 'default'"
        >{{ t('editor.defaultTab') }}</button>
      </li>
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'overrides' }]"
          type="button"
          @click="selectedTab = 'overrides'"
        >{{ t('editor.overridesTab') }}</button>
      </li>
      <li
        class="nav-item"
        role="presentation"
      >
        <button
          :class="['nav-link', { active: selectedTab === 'waits' }]"
          type="button"
          @click="selectedTab = 'waits'"
        >{{ t('editor.waits') }}</button>
      </li>
    </ul>
    <div
      class="card shadow-sm bg-body-tertiary"
    >
      <div
        class="card-body"
      >
        <h2
          v-if="selectedTab !== 'waits'"
          class="h3"
        >{{ selectedTab === 'default' ? t('editor.defaultTab') : t('editor.overridesTab') }}</h2>
        <template
          v-if="props.editing && selectedTab !== 'waits'"
        >
          <section
            v-if="selectedTab === 'default'"
          >
            <label
              class="form-label"
              :for="`navigate-url-${props.index}`"
            >URL</label>
            <input
              :id="`navigate-url-${props.index}`"
              v-model="url"
              :aria-describedby="urlWasBlurred && !isValidNavigateUrl(url) ? `navigate-url-error-${props.index}` : undefined"
              :class="['form-control', { 'is-invalid': urlWasBlurred && !isValidNavigateUrl(url) }]"
              type="url"
              @blur="validateNavigateUrl"
              @input="emit('update:url', url)"
            />
            <div
              v-if="urlWasBlurred && !isValidNavigateUrl(url)"
              :id="`navigate-url-error-${props.index}`"
              class="invalid-feedback d-block"
            >{{ t('editor.navigateUrlInvalid') }}</div>
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="!isValidNavigateUrl(url)"
              @click="applyDefault"
            >{{ t('editor.apply') }}</button>
          </section>
          <section
            v-else
          >
            <StepTimeoutOverride
              :id-prefix="`navigate-${props.index}`"
              :inherited-timeout="props.inheritedTimeout"
              :timeout="props.timeout"
              @update:timeout="emit('update:timeout', $event)"
            />
            <button
              class="btn btn-primary mt-3"
              type="button"
              :disabled="typeof props.timeout === 'number' && (!Number.isInteger(props.timeout) || props.timeout < 1)"
              @click="props.saveUrl(url)"
            >{{ t('editor.apply') }}</button>
          </section>
        </template>
        <dl v-else-if="selectedTab === 'default'" class="mb-0">
          <dt>URL</dt>
          <dd class="mb-0 text-break">{{ props.url }}</dd>
        </dl>
        <dl v-else-if="selectedTab === 'overrides'" class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd class="mb-0">{{ props.timeout ?? props.inheritedTimeout }}</dd>
        </dl>
        <WaitReferences v-else :after="props.after" :before="props.before" :editing="props.editing" @update:after="emit('update:after', $event)" @update:before="emit('update:before', $event)" />
      </div>
    </div>
  </section>
</template>
