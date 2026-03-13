<script setup lang="ts">
import { computed, ref, toRef, useAttrs, onMounted, onBeforeUnmount, useId, useSlots } from 'vue'
import FieldLabel from '../_internal/FieldLabel.vue'
import FieldError from '../_internal/FieldError.vue'
import FieldDescription from '../_internal/FieldDescription.vue'
import Icon from '../Icon/Icon.vue'
import { useFieldIds } from '../../composables/useFieldIds'
import { useSearch } from '../../composables/useSearch'
import type { FieldProps, SearchOption } from '../../types'
import type { IconName } from '../../icons'

export interface SearchProps extends FieldProps {
  modelValue?: string | number | null
  options?: SearchOption[]
  onSearch?: (query: string) => Promise<SearchOption[]>
  debounce?: number
  placeholder?: string
  minChars?: number
  openOnFocus?: boolean
  noCache?: boolean
  leadingIcon?: IconName
  clearable?: boolean
  clearOnSelect?: boolean
}

const props = withDefaults(defineProps<SearchProps>(), {
  modelValue: null,
  size: 'md',
  disabled: false,
  debounce: 300,
  clearable: true,
  clearOnSelect: false,
  noCache: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  select: [option: SearchOption]
}>()

const attrs = useAttrs()
const slots = useSlots()

const { inputId, errorId, descriptionId, ariaDescribedBy, ariaInvalid } = useFieldIds(props)

const uid = useId()
const listboxId = `search-listbox-${uid}`

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const isAsyncMode = computed(() => !!props.onSearch && !props.options)

const resolvedMinChars = computed(() => {
  if (props.minChars != null) return props.minChars
  return isAsyncMode.value ? 1 : 0
})

const resolvedOpenOnFocus = computed(() => {
  if (props.openOnFocus != null) return props.openOnFocus
  return !isAsyncMode.value
})

const {
  isOpen,
  query,
  activeIndex,
  results,
  isLoading,
  meetsMinChars,
  getOptionLabel,
  open,
  close,
  selectOption: doSelect,
  clear: doClear,
  onFocus,
  onKeydown,
} = useSearch({
  options: toRef(props, 'options'),
  onSearch: toRef(props, 'onSearch'),
  debounce: toRef(props, 'debounce'),
  minChars: resolvedMinChars,
  openOnFocus: resolvedOpenOnFocus,
  noCache: toRef(props, 'noCache'),
  modelValue: toRef(props, 'modelValue'),
  onSelect: (option) => {
    emit('update:modelValue', option.value)
    emit('select', option)
    if (props.clearOnSelect) {
      query.value = ''
    } else {
      query.value = getOptionLabel(option)
    }
  },
  onClear: () => {
    emit('update:modelValue', null)
  },
})

const hasLeading = computed(() => !!(props.leadingIcon || slots.leading))
const showClear = computed(() => props.clearable && props.modelValue != null)

const classes = computed(() => [
  'lucas-ui-search',
  `lucas-ui-search--size-${props.size}`,
])

const controlClasses = computed(() => [
  'lucas-ui-search__control',
  { 'lucas-ui-search__control--error': !!props.error },
  { 'lucas-ui-search__control--disabled': props.disabled },
  { 'lucas-ui-search__control--open': isOpen.value },
])

function getOptionId(option: SearchOption): string {
  return `search-option-${uid}-${option.value}`
}

const activeDescendant = computed(() => {
  if (activeIndex.value < 0 || activeIndex.value >= results.value.length) return undefined
  return getOptionId(results.value[activeIndex.value])
})

function onInputFocus() {
  if (props.disabled) return
  onFocus()
}

function onControlClick() {
  if (props.disabled) return
  inputRef.value?.focus()
  if (!isOpen.value) open()
}

function onClearClick(event: MouseEvent) {
  event.stopPropagation()
  doClear()
  inputRef.value?.focus()
}

function onOptionClick(option: SearchOption) {
  if (option.disabled) return
  doSelect(option)
}

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    close()
  }
}

function highlightMatch(label: string, q: string): { before: string; match: string; after: string } | null {
  if (!q) return null
  const lowerLabel = label.toLowerCase()
  const lowerQuery = q.toLowerCase()
  const idx = lowerLabel.indexOf(lowerQuery)
  if (idx === -1) return null
  return {
    before: label.slice(0, idx),
    match: label.slice(idx, idx + q.length),
    after: label.slice(idx + q.length),
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
        '[Search] Missing `label` prop or `aria-label` attribute. ' +
          'Add one to make this search accessible to screen readers.',
      )
    }
    if (props.options && props.onSearch) {
      console.warn(
        '[Search] Both `options` and `onSearch` provided. ' +
          '`options` takes precedence; `onSearch` will be ignored.',
      )
    }
    if (!props.options && !props.onSearch) {
      console.warn(
        '[Search] Neither `options` nor `onSearch` provided. ' +
          'No results will ever be shown.',
      )
    }
  })
}
</script>

<template>
  <div ref="rootRef" :class="classes">
    <FieldLabel v-if="label" :html-for="inputId">{{ label }}</FieldLabel>

    <div :class="controlClasses" @click="onControlClick">
      <span v-if="hasLeading" class="lucas-ui-search__leading">
        <slot name="leading">
          <Icon v-if="leadingIcon" :name="leadingIcon" />
        </slot>
      </span>

      <input
        :id="inputId"
        ref="inputRef"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendant"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        :placeholder="placeholder"
        :disabled="disabled"
        class="lucas-ui-search__input"
        @focus="onInputFocus"
        @keydown="onKeydown"
      />

      <span class="lucas-ui-search__trailing">
        <button
          v-if="showClear"
          type="button"
          class="lucas-ui-search__clear"
          aria-label="Clear"
          @click="onClearClick"
          @mousedown.prevent
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <span v-if="isLoading" class="lucas-ui-search__spinner" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" opacity="0.25"/>
            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.75s" repeatCount="indefinite"/>
            </path>
          </svg>
        </span>
      </span>
    </div>

    <div v-if="isOpen" class="lucas-ui-search__dropdown">
      <ul
        v-if="meetsMinChars && results.length > 0"
        :id="listboxId"
        role="listbox"
        class="lucas-ui-search__listbox"
      >
        <li
          v-for="(opt, index) in results"
          :id="getOptionId(opt)"
          :key="opt.value"
          role="option"
          :class="[
            'lucas-ui-search__option',
            {
              'lucas-ui-search__option--active': index === activeIndex,
              'lucas-ui-search__option--disabled': !!opt.disabled,
            },
          ]"
          :aria-selected="opt.value === modelValue"
          :aria-disabled="opt.disabled || undefined"
          @click="onOptionClick(opt)"
          @mousedown.prevent
        >
          <slot name="result" :option="opt" :query="query" :active="index === activeIndex" :disabled="!!opt.disabled">
            <template v-if="highlightMatch(getOptionLabel(opt), query.trim())">
              <span>{{ highlightMatch(getOptionLabel(opt), query.trim())!.before }}</span><span class="lucas-ui-search__highlight">{{ highlightMatch(getOptionLabel(opt), query.trim())!.match }}</span><span>{{ highlightMatch(getOptionLabel(opt), query.trim())!.after }}</span>
            </template>
            <template v-else>
              {{ getOptionLabel(opt) }}
            </template>
          </slot>
        </li>
      </ul>

      <div v-else-if="meetsMinChars && !isLoading && results.length === 0 && query.trim()" class="lucas-ui-search__empty">
        <slot name="empty" :query="query">No results found</slot>
      </div>

      <div v-else-if="isLoading" class="lucas-ui-search__loading">
        <slot name="loading" :query="query">
          <span class="lucas-ui-search__spinner" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" opacity="0.25"/>
              <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.75s" repeatCount="indefinite"/>
              </path>
            </svg>
          </span>
          Searching…
        </slot>
      </div>
    </div>

    <FieldError v-if="error" :id="errorId">{{ error }}</FieldError>
    <FieldDescription v-if="description" :id="descriptionId">{{ description }}</FieldDescription>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-search {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);

  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-search--size-xs {
  --_input-font-size: var(--lucas-ui-font-size-xs);
  --_input-padding-y: var(--lucas-ui-space-1);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-search--size-sm {
  --_input-font-size: var(--lucas-ui-font-size-sm);
  --_input-padding-y: var(--lucas-ui-button-padding-y-sm);
  --_input-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-search--size-md {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-space-2);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-search--size-lg {
  --_input-font-size: var(--lucas-ui-font-size-md);
  --_input-padding-y: var(--lucas-ui-button-padding-y-lg);
  --_input-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-search--size-xl {
  --_input-font-size: var(--lucas-ui-font-size-lg);
  --_input-padding-y: var(--lucas-ui-space-3);
  --_input-padding-x: var(--lucas-ui-space-4);
}

/* ── Control wrapper ─────────────────────────────────────────────────────── */

.lucas-ui-search__control {
  display: flex;
  align-items: center;
  background: var(--lucas-ui-input-bg);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  transition:
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    box-shadow var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-search__control:hover:not(.lucas-ui-search__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-hover);
}

.lucas-ui-search__control:focus-within:not(.lucas-ui-search__control--disabled) {
  border-color: var(--lucas-ui-input-border-color-focus);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color);
}

.lucas-ui-search__control--error {
  border-color: var(--lucas-ui-input-border-color-error);
}

.lucas-ui-search__control--error:focus-within {
  border-color: var(--lucas-ui-input-border-color-error);
  box-shadow: 0 0 0 var(--lucas-ui-input-focus-ring-width) var(--lucas-ui-input-focus-ring-color-error);
}

.lucas-ui-search__control--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Input ───────────────────────────────────────────────────────────────── */

.lucas-ui-search__input {
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

.lucas-ui-search__input::placeholder {
  color: var(--lucas-ui-input-placeholder-color);
}

.lucas-ui-search__input:disabled {
  cursor: not-allowed;
}

/* ── Leading icon ────────────────────────────────────────────────────────── */

.lucas-ui-search__leading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--lucas-ui-input-placeholder-color);
  padding-left: var(--_input-padding-x);
}

/* ── Trailing area ───────────────────────────────────────────────────────── */

.lucas-ui-search__trailing {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding-right: var(--_input-padding-x);
}

/* ── Clear button ────────────────────────────────────────────────────────── */

.lucas-ui-search__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--lucas-ui-select-chevron-color);
}

.lucas-ui-search__clear:hover {
  color: var(--lucas-ui-input-color);
}

/* ── Spinner ─────────────────────────────────────────────────────────────── */

.lucas-ui-search__spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--lucas-ui-select-chevron-color);
}

/* ── Dropdown ────────────────────────────────────────────────────────────── */

.lucas-ui-search__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--lucas-ui-search-dropdown-z-index, 100);
  margin-top: 4px;
  background: var(--lucas-ui-search-dropdown-bg, var(--lucas-ui-input-bg));
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-input-border-color);
  border-radius: var(--lucas-ui-radius-md);
  box-shadow: var(--lucas-ui-search-dropdown-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
  overflow: hidden;
}

.lucas-ui-search__listbox {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: var(--lucas-ui-search-dropdown-max-height, 240px);
  overflow-y: auto;
}

/* ── Option ──────────────────────────────────────────────────────────────── */

.lucas-ui-search__option {
  display: flex;
  align-items: center;
  padding: var(--_input-padding-y) var(--_input-padding-x);
  cursor: pointer;
  font-size: var(--_input-font-size);
  color: var(--lucas-ui-input-color);
  user-select: none;
}

.lucas-ui-search__option:hover:not(.lucas-ui-search__option--disabled),
.lucas-ui-search__option--active:not(.lucas-ui-search__option--disabled) {
  background: var(--lucas-ui-search-option-bg-hover, var(--lucas-ui-multi-select-option-bg-hover, #f3f4f6));
}

.lucas-ui-search__option--active:not(.lucas-ui-search__option--disabled) {
  background: var(--lucas-ui-search-option-bg-active, var(--lucas-ui-search-option-bg-hover, #f3f4f6));
}

.lucas-ui-search__option--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Highlight ───────────────────────────────────────────────────────────── */

.lucas-ui-search__highlight {
  color: var(--lucas-ui-search-highlight-color, var(--lucas-ui-color-brand-primary));
  font-weight: var(--lucas-ui-search-highlight-font-weight, 600);
}

/* ── Empty / Loading ─────────────────────────────────────────────────────── */

.lucas-ui-search__empty {
  padding: var(--_input-padding-y) var(--_input-padding-x);
  color: var(--lucas-ui-search-empty-color, var(--lucas-ui-input-placeholder-color));
  font-size: var(--_input-font-size);
  text-align: center;
}

.lucas-ui-search__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: var(--_input-padding-y) var(--_input-padding-x);
  color: var(--lucas-ui-input-placeholder-color);
  font-size: var(--_input-font-size);
}
</style>
