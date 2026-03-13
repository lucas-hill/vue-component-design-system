<script setup lang="ts">
import { computed, ref, toRef, useAttrs, onMounted, onBeforeUnmount, watch, useId } from 'vue'
import FieldLabel from '../_internal/FieldLabel.vue'
import FieldError from '../_internal/FieldError.vue'
import FieldDescription from '../_internal/FieldDescription.vue'
import { useFieldIds } from '../../composables/useFieldIds'
import { useMultiSelect } from '../../composables/useMultiSelect'
import type { FieldProps, SelectOption } from '../../types'

export interface MultiSelectProps extends FieldProps {
  modelValue?: (string | number)[]
  options: SelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  max?: number
  clearable?: boolean
}

const props = withDefaults(defineProps<MultiSelectProps>(), {
  modelValue: () => [],
  size: 'md',
  disabled: false,
  searchable: true,
  clearable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
}>()

const attrs = useAttrs()

const { inputId, errorId, descriptionId, ariaDescribedBy, ariaInvalid } = useFieldIds(props)

const uid = useId()
const listboxId = `multi-select-listbox-${uid}`

const rootRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const {
  isOpen,
  searchQuery,
  activeIndex,
  filteredOptions,
  isSelected,
  isOptionDisabled,
  toggleOption,
  removeValue,
  clearAll,
  open,
  close,
  toggle,
  onKeydown,
} = useMultiSelect({
  modelValue: toRef(props, 'modelValue'),
  options: toRef(props, 'options'),
  searchable: toRef(props, 'searchable'),
  max: toRef(props, 'max'),
  onUpdate: (value) => emit('update:modelValue', value),
})

// Reset active index when search query changes
watch(searchQuery, () => {
  activeIndex.value = 0
})

const selectedOptions = computed(() =>
  props.modelValue
    .map((v) => props.options.find((o) => o.value === v))
    .filter((o): o is SelectOption => o != null),
)

const classes = computed(() => [
  'lucas-ui-multi-select',
  `lucas-ui-multi-select--size-${props.size}`,
])

const controlClasses = computed(() => [
  'lucas-ui-multi-select__control',
  { 'lucas-ui-multi-select__control--error': !!props.error },
  { 'lucas-ui-multi-select__control--disabled': props.disabled },
  { 'lucas-ui-multi-select__control--open': isOpen.value },
])

function getOptionLabel(option: SelectOption): string {
  return option.label ?? String(option.value)
}

function getOptionId(option: SelectOption): string {
  return `multi-select-option-${uid}-${option.value}`
}

const activeDescendant = computed(() => {
  if (activeIndex.value < 0 || activeIndex.value >= filteredOptions.value.length) return undefined
  return getOptionId(filteredOptions.value[activeIndex.value])
})

function onControlClick() {
  if (props.disabled) return
  if (!isOpen.value) {
    open()
  }
  searchRef.value?.focus()
}

function onOptionClick(option: SelectOption) {
  if (isOptionDisabled(option)) return
  toggleOption(option)
  searchRef.value?.focus()
}

function onTagRemove(value: string | number) {
  removeValue(value)
  searchRef.value?.focus()
}

function onClearClick(event: MouseEvent) {
  event.stopPropagation()
  clearAll()
  searchRef.value?.focus()
}

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})

if (import.meta.env.DEV) {
  onMounted(() => {
    if (!props.label && !attrs['aria-label']) {
      console.warn(
        '[MultiSelect] Missing `label` prop or `aria-label` attribute. ' +
          'Add one to make this multi-select accessible to screen readers.',
      )
    }
  })
}
</script>

<template>
  <div ref="rootRef" :class="classes">
    <FieldLabel v-if="label" :html-for="inputId">{{ label }}</FieldLabel>

    <div :class="controlClasses" @click="onControlClick">
      <div class="lucas-ui-multi-select__tags">
        <span
          v-for="opt in selectedOptions"
          :key="opt.value"
          class="lucas-ui-multi-select__tag"
        >
          <slot name="tag" :option="opt" :remove="() => onTagRemove(opt.value)">
            <span class="lucas-ui-multi-select__tag-label">{{ getOptionLabel(opt) }}</span>
            <button
              type="button"
              class="lucas-ui-multi-select__tag-remove"
              :aria-label="`Remove ${getOptionLabel(opt)}`"
              :disabled="disabled"
              @click.stop="onTagRemove(opt.value)"
              @mousedown.prevent
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </slot>
        </span>

        <input
          :id="inputId"
          ref="searchRef"
          v-model="searchQuery"
          type="text"
          role="combobox"
          autocomplete="off"
          :class="[
            'lucas-ui-multi-select__search',
            { 'lucas-ui-multi-select__search--hidden': !searchable },
          ]"
          :placeholder="!modelValue.length ? placeholder : searchPlaceholder"
          :disabled="disabled"
          :aria-expanded="isOpen"
          aria-haspopup="listbox"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendant"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="ariaInvalid"
          @keydown="onKeydown"
          @focus="!disabled && !isOpen && open()"
        />

        <span
          v-if="!modelValue.length && !searchQuery && !searchable"
          class="lucas-ui-multi-select__placeholder"
        >
          {{ placeholder }}
        </span>
      </div>

      <button
        v-if="clearable && modelValue.length > 0"
        type="button"
        class="lucas-ui-multi-select__clear"
        aria-label="Clear all"
        :disabled="disabled"
        @click="onClearClick"
        @mousedown.prevent
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <span
        class="lucas-ui-multi-select__chevron"
        :class="{ 'lucas-ui-multi-select__chevron--open': isOpen }"
        aria-hidden="true"
        @click.stop="!disabled && toggle()"
        @mousedown.prevent
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>

    <div v-if="isOpen" class="lucas-ui-multi-select__dropdown">
      <ul
        :id="listboxId"
        role="listbox"
        aria-multiselectable="true"
        class="lucas-ui-multi-select__listbox"
      >
        <li
          v-for="(opt, index) in filteredOptions"
          :id="getOptionId(opt)"
          :key="opt.value"
          role="option"
          :class="[
            'lucas-ui-multi-select__option',
            {
              'lucas-ui-multi-select__option--selected': isSelected(opt.value),
              'lucas-ui-multi-select__option--active': index === activeIndex,
              'lucas-ui-multi-select__option--disabled': isOptionDisabled(opt),
            },
          ]"
          :aria-selected="isSelected(opt.value)"
          :aria-disabled="isOptionDisabled(opt) || undefined"
          @click="onOptionClick(opt)"
          @mousedown.prevent
        >
          <slot name="option" :option="opt" :selected="isSelected(opt.value)" :disabled="isOptionDisabled(opt)">
            <span
              :class="[
                'lucas-ui-multi-select__checkbox',
                { 'lucas-ui-multi-select__checkbox--checked': isSelected(opt.value) },
              ]"
              aria-hidden="true"
            >
              <svg v-if="isSelected(opt.value)" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="lucas-ui-multi-select__option-label">{{ getOptionLabel(opt) }}</span>
          </slot>
        </li>
      </ul>

      <div v-if="filteredOptions.length === 0" class="lucas-ui-multi-select__empty">
        <slot name="empty">No options found</slot>
      </div>
    </div>

    <FieldError v-if="error" :id="errorId">{{ error }}</FieldError>
    <FieldDescription v-if="description" :id="descriptionId">{{ description }}</FieldDescription>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-multi-select {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);

  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-multi-select--size-xs {
  --_input-font-size: var(--lucas-ui-font-size-xs);
  --_input-padding-y: var(--lucas-ui-space-1);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-multi-select--size-sm {
  --_input-font-size: var(--lucas-ui-font-size-sm);
  --_input-padding-y: var(--lucas-ui-button-padding-y-sm);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-multi-select--size-md {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-multi-select--size-lg {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-button-padding-y-lg);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-multi-select--size-xl {
  --_input-font-size: var(--lucas-ui-font-size-lg);
  --_input-padding-y: var(--lucas-ui-space-3);
  --_input-padding-x: var(--lucas-ui-space-4);
}

/* ── Control wrapper ─────────────────────────────────────────────────────── */

.lucas-ui-multi-select__control {
  display: flex;
  align-items: center;
  background: var(--lucas-ui-input-bg);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  cursor: text;
  transition:
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    box-shadow var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-multi-select__control:hover:not(.lucas-ui-multi-select__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-hover);
}

.lucas-ui-multi-select__control:focus-within:not(.lucas-ui-multi-select__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-focus);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color);
}

.lucas-ui-multi-select__control--error {
  border-color: var(--lucas-ui-input-border-color-error);
}

.lucas-ui-multi-select__control--error:focus-within {
  border-color: var(--lucas-ui-input-border-color-error);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color-error);
}

.lucas-ui-multi-select__control--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Tags area ───────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__tags {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--lucas-ui-multi-select-tag-gap);
  padding: var(--_input-padding-y) var(--_input-padding-x);
}

/* ── Tag ─────────────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--lucas-ui-multi-select-tag-bg);
  color: var(--lucas-ui-multi-select-tag-color);
  border-radius: var(--lucas-ui-multi-select-tag-radius);
  font-size: calc(var(--_input-font-size) * 0.85);
  padding: 1px 6px;
  line-height: 1.4;
  max-width: 100%;
}

.lucas-ui-multi-select__tag-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lucas-ui-multi-select__tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  flex-shrink: 0;
}

.lucas-ui-multi-select__tag-remove:hover {
  opacity: 1;
}

.lucas-ui-multi-select__tag-remove:disabled {
  cursor: not-allowed;
}

/* ── Search input ────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__search {
  flex: 1;
  min-width: 60px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--lucas-ui-input-color);
  font-family: inherit;
  font-size: var(--_input-font-size);
  padding: 0;
  line-height: 1.4;
}

.lucas-ui-multi-select__search::placeholder {
  color: var(--lucas-ui-input-placeholder-color);
}

.lucas-ui-multi-select__search:disabled {
  cursor: not-allowed;
}

.lucas-ui-multi-select__search--hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── Placeholder (non-searchable mode) ───────────────────────────────────── */

.lucas-ui-multi-select__placeholder {
  color: var(--lucas-ui-input-placeholder-color);
  font-size: var(--_input-font-size);
  pointer-events: none;
}

/* ── Clear button ────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0 4px;
  cursor: pointer;
  color: var(--lucas-ui-select-chevron-color);
  flex-shrink: 0;
}

.lucas-ui-multi-select__clear:hover {
  color: var(--lucas-ui-input-color);
}

/* ── Chevron ─────────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-right: var(--_input-padding-x);
  flex-shrink: 0;
  color: var(--lucas-ui-select-chevron-color);
  cursor: pointer;
  transition: transform var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-multi-select__chevron--open {
  transform: rotate(180deg);
}

/* ── Dropdown ────────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--lucas-ui-multi-select-dropdown-z-index);
  margin-top: 4px;
  background: var(--lucas-ui-multi-select-dropdown-bg);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  box-shadow: var(--lucas-ui-multi-select-dropdown-shadow);
  overflow: hidden;
}

.lucas-ui-multi-select__listbox {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: var(--lucas-ui-multi-select-dropdown-max-height);
  overflow-y: auto;
}

/* ── Option ──────────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--_input-padding-y) var(--_input-padding-x);
  cursor: pointer;
  font-size: var(--_input-font-size);
  color: var(--lucas-ui-input-color);
  user-select: none;
}

.lucas-ui-multi-select__option:hover:not(.lucas-ui-multi-select__option--disabled),
.lucas-ui-multi-select__option--active:not(.lucas-ui-multi-select__option--disabled) {
  background: var(--lucas-ui-multi-select-option-bg-hover);
}

.lucas-ui-multi-select__option--selected {
  background: var(--lucas-ui-multi-select-option-bg-selected);
}

.lucas-ui-multi-select__option--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Checkbox ────────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-multi-select-checkbox-border-color);
  border-radius: 3px;
  flex-shrink: 0;
  transition:
    background var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-multi-select__checkbox--checked {
  background: var(--lucas-ui-multi-select-checkbox-color);
  border-color: var(--lucas-ui-multi-select-checkbox-color);
  color: #ffffff;
}

.lucas-ui-multi-select__option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Empty state ─────────────────────────────────────────────────────────── */

.lucas-ui-multi-select__empty {
  padding: var(--_input-padding-y) var(--_input-padding-x);
  color: var(--lucas-ui-input-placeholder-color);
  font-size: var(--_input-font-size);
  text-align: center;
}
</style>
