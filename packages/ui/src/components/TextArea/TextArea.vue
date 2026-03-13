<script setup lang="ts">
import { computed, useAttrs, onMounted } from 'vue'
import FieldLabel from '../_internal/FieldLabel.vue'
import FieldError from '../_internal/FieldError.vue'
import FieldDescription from '../_internal/FieldDescription.vue'
import { useFieldIds } from '../../composables/useFieldIds'
import type { FieldProps } from '../../types'

export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextAreaProps extends FieldProps {
  modelValue?: string
  placeholder?: string
  readonly?: boolean
  rows?: number
  resize?: TextAreaResize
}

const props = withDefaults(defineProps<TextAreaProps>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  readonly: false,
  rows: 3,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()

const { inputId, errorId, descriptionId, ariaDescribedBy, ariaInvalid } = useFieldIds(props)

const classes = computed(() => [
  'lucas-ui-textarea',
  `lucas-ui-textarea--size-${props.size}`,
])

const textareaClasses = computed(() => [
  'lucas-ui-textarea__input',
  { 'lucas-ui-textarea__input--error': !!props.error },
  { 'lucas-ui-textarea__input--disabled': props.disabled },
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

if (import.meta.env.DEV) {
  onMounted(() => {
    if (!props.label && !attrs['aria-label']) {
      console.warn(
        '[TextArea] Missing `label` prop or `aria-label` attribute. ' +
          'Add one to make this textarea accessible to screen readers.',
      )
    }
  })
}
</script>

<template>
  <div :class="classes">
    <FieldLabel v-if="label" :html-for="inputId">{{ label }}</FieldLabel>

    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :style="{ resize }"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="ariaInvalid"
      :class="textareaClasses"
      @input="onInput"
    />

    <FieldError v-if="error" :id="errorId">{{ error }}</FieldError>
    <FieldDescription v-if="description" :id="descriptionId">{{ description }}</FieldDescription>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-textarea {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);

  display: flex;
  flex-direction: column;
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-textarea--size-xs {
  --_input-font-size: var(--lucas-ui-font-size-xs);
  --_input-padding-y: var(--lucas-ui-space-1);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-textarea--size-sm {
  --_input-font-size: var(--lucas-ui-font-size-sm);
  --_input-padding-y: var(--lucas-ui-button-padding-y-sm);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-textarea--size-md {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-textarea--size-lg {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-button-padding-y-lg);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-textarea--size-xl {
  --_input-font-size: var(--lucas-ui-font-size-lg);
  --_input-padding-y: var(--lucas-ui-space-3);
  --_input-padding-x: var(--lucas-ui-space-4);
}

/* ── Textarea element ────────────────────────────────────────────────────── */

.lucas-ui-textarea__input {
  background: var(--lucas-ui-input-bg);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  color: var(--lucas-ui-input-color);
  font-family: inherit;
  font-size: var(--_input-font-size);
  padding: var(--_input-padding-y) var(--_input-padding-x);
  outline: none;
  transition:
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    box-shadow var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-textarea__input::placeholder {
  color: var(--lucas-ui-input-placeholder-color);
}

.lucas-ui-textarea__input:hover:not(:disabled) {
  border-color: var(--lucas-ui-input-border-color-hover);
}

.lucas-ui-textarea__input:focus:not(:disabled) {
  border-color: var(--lucas-ui-input-border-color-focus);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color);
}

.lucas-ui-textarea__input--error {
  border-color: var(--lucas-ui-input-border-color-error);
}

.lucas-ui-textarea__input--error:focus {
  border-color: var(--lucas-ui-input-border-color-error);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color-error);
}

.lucas-ui-textarea__input--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}
</style>
