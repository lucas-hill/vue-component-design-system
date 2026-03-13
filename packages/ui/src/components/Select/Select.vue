<script setup lang="ts">
import { computed, useAttrs, onMounted } from 'vue'
import FieldLabel from '../_internal/FieldLabel.vue'
import FieldError from '../_internal/FieldError.vue'
import FieldDescription from '../_internal/FieldDescription.vue'
import { useFieldIds } from '../../composables/useFieldIds'
import type { FieldProps, SelectOption } from '../../types'

export interface SelectProps extends FieldProps {
  modelValue?: string | number | null
  options: SelectOption[]
  placeholder?: string
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: null,
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const attrs = useAttrs()

const { inputId, errorId, descriptionId, ariaDescribedBy, ariaInvalid } = useFieldIds(props)

const classes = computed(() => [
  'lucas-ui-select',
  `lucas-ui-select--size-${props.size}`,
])

const controlClasses = computed(() => [
  'lucas-ui-select__control',
  { 'lucas-ui-select__control--error': !!props.error },
  { 'lucas-ui-select__control--disabled': props.disabled },
])

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  const option = props.options.find((o) => String(o.value) === value)
  if (option) {
    emit('update:modelValue', option.value)
  }
}

if (import.meta.env.DEV) {
  onMounted(() => {
    if (!props.label && !attrs['aria-label']) {
      console.warn(
        '[Select] Missing `label` prop or `aria-label` attribute. ' +
          'Add one to make this select accessible to screen readers.',
      )
    }
  })
}
</script>

<template>
  <div :class="classes">
    <FieldLabel v-if="label" :html-for="inputId">{{ label }}</FieldLabel>

    <div :class="controlClasses">
      <select
        :id="inputId"
        :value="modelValue != null ? String(modelValue) : ''"
        :disabled="disabled"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        class="lucas-ui-select__input"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled hidden>{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="String(opt.value)"
          :disabled="opt.disabled"
        >
          {{ opt.label ?? opt.value }}
        </option>
      </select>

      <span class="lucas-ui-select__chevron" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>

    <FieldError v-if="error" :id="errorId">{{ error }}</FieldError>
    <FieldDescription v-if="description" :id="descriptionId">{{ description }}</FieldDescription>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-select {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);

  display: flex;
  flex-direction: column;
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-select--size-xs {
  --_input-font-size: var(--lucas-ui-font-size-xs);
  --_input-padding-y: var(--lucas-ui-space-1);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-select--size-sm {
  --_input-font-size: var(--lucas-ui-font-size-sm);
  --_input-padding-y: var(--lucas-ui-button-padding-y-sm);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-select--size-md {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-select--size-lg {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-button-padding-y-lg);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-select--size-xl {
  --_input-font-size: var(--lucas-ui-font-size-lg);
  --_input-padding-y: var(--lucas-ui-space-3);
  --_input-padding-x: var(--lucas-ui-space-4);
}

/* ── Control wrapper ─────────────────────────────────────────────────────── */

.lucas-ui-select__control {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--lucas-ui-input-bg);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  transition:
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    box-shadow var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-select__control:hover:not(.lucas-ui-select__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-hover);
}

.lucas-ui-select__control:focus-within:not(.lucas-ui-select__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-focus);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color);
}

.lucas-ui-select__control--error {
  border-color: var(--lucas-ui-input-border-color-error);
}

.lucas-ui-select__control--error:focus-within {
  border-color: var(--lucas-ui-input-border-color-error);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color-error);
}

.lucas-ui-select__control--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Select element ──────────────────────────────────────────────────────── */

.lucas-ui-select__input {
  flex: 1;
  min-width: 0;
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--lucas-ui-input-color);
  font-family: inherit;
  font-size: var(--_input-font-size);
  padding: var(--_input-padding-y) var(--_input-padding-x);
  padding-right: calc(var(--_input-padding-x) + 20px);
  cursor: pointer;
}

.lucas-ui-select__input:disabled {
  cursor: not-allowed;
}

/* ── Chevron icon ────────────────────────────────────────────────────────── */

.lucas-ui-select__chevron {
  position: absolute;
  right: var(--_input-padding-x);
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--lucas-ui-select-chevron-color);
}
</style>
