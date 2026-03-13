<script setup lang="ts">
import { computed, useAttrs, useSlots, onMounted } from 'vue'
import FieldLabel from '../_internal/FieldLabel.vue'
import FieldError from '../_internal/FieldError.vue'
import FieldDescription from '../_internal/FieldDescription.vue'
import Icon from '../Icon/Icon.vue'
import { useFieldIds } from '../../composables/useFieldIds'
import type { FieldProps } from '../../types'
import type { IconName } from '../../icons'

export type TextInputType = 'text' | 'email' | 'password' | 'url' | 'tel' | 'search' | 'number'

export interface TextInputProps extends FieldProps {
  modelValue?: string
  type?: TextInputType
  placeholder?: string
  readonly?: boolean
  leadingIcon?: IconName
  trailingIcon?: IconName
}

const props = withDefaults(defineProps<TextInputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const slots = useSlots()

const { inputId, errorId, descriptionId, ariaDescribedBy, ariaInvalid } = useFieldIds(props)

const hasLeading = computed(() => !!(props.leadingIcon || slots.leading))
const hasTrailing = computed(() => !!(props.trailingIcon || slots.trailing))

const classes = computed(() => [
  'lucas-ui-text-input',
  `lucas-ui-text-input--size-${props.size}`,
])

const controlClasses = computed(() => [
  'lucas-ui-text-input__control',
  { 'lucas-ui-text-input__control--error': !!props.error },
  { 'lucas-ui-text-input__control--disabled': props.disabled },
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

if (import.meta.env.DEV) {
  onMounted(() => {
    if (!props.label && !attrs['aria-label']) {
      console.warn(
        '[TextInput] Missing `label` prop or `aria-label` attribute. ' +
          'Add one to make this input accessible to screen readers.',
      )
    }
  })
}
</script>

<template>
  <div :class="classes">
    <FieldLabel v-if="label" :html-for="inputId">{{ label }}</FieldLabel>

    <div :class="controlClasses">
      <span v-if="hasLeading" class="lucas-ui-text-input__leading">
        <slot name="leading">
          <Icon v-if="leadingIcon" :name="leadingIcon" />
        </slot>
      </span>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        class="lucas-ui-text-input__input"
        @input="onInput"
      />

      <span v-if="hasTrailing" class="lucas-ui-text-input__trailing">
        <slot name="trailing">
          <Icon v-if="trailingIcon" :name="trailingIcon" />
        </slot>
      </span>
    </div>

    <FieldError v-if="error" :id="errorId">{{ error }}</FieldError>
    <FieldDescription v-if="description" :id="descriptionId">{{ description }}</FieldDescription>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-text-input {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);

  display: flex;
  flex-direction: column;
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-text-input--size-xs {
  --_input-font-size: var(--lucas-ui-font-size-xs);
  --_input-padding-y: var(--lucas-ui-space-1);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-text-input--size-sm {
  --_input-font-size: var(--lucas-ui-font-size-sm);
  --_input-padding-y: var(--lucas-ui-button-padding-y-sm);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-text-input--size-md {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-text-input--size-lg {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-button-padding-y-lg);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-text-input--size-xl {
  --_input-font-size: var(--lucas-ui-font-size-lg);
  --_input-padding-y: var(--lucas-ui-space-3);
  --_input-padding-x: var(--lucas-ui-space-4);
}

/* ── Control wrapper ─────────────────────────────────────────────────────── */

.lucas-ui-text-input__control {
  display: flex;
  align-items: center;
  background: var(--lucas-ui-input-bg);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  transition:
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    box-shadow var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-text-input__control:hover:not(.lucas-ui-text-input__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-hover);
}

.lucas-ui-text-input__control:focus-within:not(.lucas-ui-text-input__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-focus);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color);
}

.lucas-ui-text-input__control--error {
  border-color: var(--lucas-ui-input-border-color-error);
}

.lucas-ui-text-input__control--error:focus-within {
  border-color: var(--lucas-ui-input-border-color-error);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color-error);
}

.lucas-ui-text-input__control--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Input element ───────────────────────────────────────────────────────── */

.lucas-ui-text-input__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--lucas-ui-input-color);
  font-family: inherit;
  font-size: var(--_input-font-size);
  padding: var(--_input-padding-y) var(--_input-padding-x);
}

.lucas-ui-text-input__input::placeholder {
  color: var(--lucas-ui-input-placeholder-color);
}

.lucas-ui-text-input__input:disabled {
  cursor: not-allowed;
}

/* ── Icon areas ──────────────────────────────────────────────────────────── */

.lucas-ui-text-input__leading,
.lucas-ui-text-input__trailing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--lucas-ui-input-placeholder-color);
}

.lucas-ui-text-input__leading {
  padding-left: var(--_input-padding-x);
}

.lucas-ui-text-input__trailing {
  padding-right: var(--_input-padding-x);
}
</style>
