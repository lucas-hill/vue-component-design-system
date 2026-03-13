<script setup lang="ts">
import { computed, useAttrs, useSlots, onMounted } from 'vue'
import Icon from '../Icon/Icon.vue'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay.vue'
import type { Size } from '../../types'
import type { IconName } from '../../icons'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonColor = 'primary' | 'danger' | 'success' | 'warning' | 'neutral'
export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom' | 'only'

export interface ButtonProps {
  variant?: ButtonVariant
  color?: ButtonColor
  /** Visual size of the button. Defaults to 'md'. */
  size?: Size
  /** Renders the button with fully rounded (pill) corners. */
  pill?: boolean
  disabled?: boolean
  /**
   * Show a loading spinner overlaid on the button content.
   * Automatically disables the button and sets aria-busy.
   */
  loading?: boolean
  /**
   * Name of a registered built-in icon. Renders icon-only by default.
   * Pair with `iconPosition` to place the icon beside a label.
   */
  icon?: IconName
  /**
   * Where to place the icon relative to the label text.
   * Defaults to 'only' — renders the icon without a label.
   */
  iconPosition?: ButtonIconPosition
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  pill: false,
  disabled: false,
  loading: false,
  iconPosition: 'only',
})

const attrs = useAttrs()
const slots = useSlots()

const hasIcon = computed(() => !!(props.icon || slots.icon))
const isIconOnly = computed(() => hasIcon.value && props.iconPosition === 'only')

const showIconBefore = computed(() =>
  hasIcon.value &&
  (props.iconPosition === 'only' ||
    props.iconPosition === 'left' ||
    props.iconPosition === 'top'),
)

const showIconAfter = computed(() =>
  hasIcon.value &&
  (props.iconPosition === 'right' || props.iconPosition === 'bottom'),
)

const overlaySize = computed<Size>(() => {
  if (props.size === 'lg' || props.size === 'xl') return 'lg'
  if (props.size === 'xs' || props.size === 'sm') return 'sm'
  return 'md'
})

const classes = computed(() => [
  'lucas-ui-button',
  `lucas-ui-button--${props.variant}`,
  `lucas-ui-button--color-${props.color}`,
  `lucas-ui-button--size-${props.size}`,
  hasIcon.value && `lucas-ui-button--icon-${props.iconPosition}`,
  { 'lucas-ui-button--pill': props.pill },
  // Suppress is-disabled when loading so its opacity doesn't conflict with the overlay
  { 'is-disabled': props.disabled && !props.loading },
  { 'is-loading': props.loading },
])

if (import.meta.env.DEV) {
  onMounted(() => {
    if (isIconOnly.value && !attrs['aria-label']) {
      console.warn(
        '[Button] An icon-only button (iconPosition="only") is missing an `aria-label`. ' +
          'Add aria-label to make it accessible to screen readers.',
      )
    }
  })
}
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <template v-if="showIconBefore">
      <Icon v-if="icon" :name="icon" />
      <slot v-else name="icon" />
    </template>

    <span v-if="!isIconOnly" class="lucas-ui-button__label">
      <slot />
    </span>

    <template v-if="showIconAfter">
      <Icon v-if="icon" :name="icon" />
      <slot v-else name="icon" />
    </template>

    <LoadingOverlay v-if="loading" :size="overlaySize" />
  </button>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-button {
  /*
   * Internal color variables — set by .lucas-ui-button--color-* modifier classes.
   * Variants (solid/outline/ghost) consume these so any color works with any variant
   * without per-combination rules.
   */
  --_btn-color: var(--lucas-ui-color-brand-primary);
  --_btn-color-hover: var(--lucas-ui-color-brand-primary-hover);
  --_btn-color-active: var(--lucas-ui-color-brand-primary-active);
  --_btn-color-on: var(--lucas-ui-color-brand-on-primary);

  /*
   * Internal size variables — set by .lucas-ui-button--size-* modifier classes.
   * Defaults to 'md' values so the button renders correctly without a size class.
   */
  --_btn-padding-y: var(--lucas-ui-space-2);
  --_btn-padding-x: var(--lucas-ui-space-4);
  --_btn-font-size: var(--lucas-ui-font-size-md);
  --_btn-icon-gap: var(--lucas-ui-space-2);

  position: relative;
  font-family: inherit;
  font-size: var(--_btn-font-size);
  border: none;
  cursor: pointer;
  padding: var(--_btn-padding-y) var(--_btn-padding-x);
  border-radius: var(--lucas-ui-radius-md);
  transition:
    background var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    transform var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

/* ── Pill shape ──────────────────────────────────────────────────────────── */

.lucas-ui-button--pill {
  border-radius: var(--lucas-ui-radius-pill);
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-button--size-xs {
  --_btn-padding-y: var(--lucas-ui-space-1);
  --_btn-padding-x: var(--lucas-ui-space-2);
  --_btn-font-size: var(--lucas-ui-font-size-xs);
  --_btn-icon-gap: var(--lucas-ui-space-1);
}

.lucas-ui-button--size-sm {
  --_btn-padding-y: var(--lucas-ui-button-padding-y-sm);
  --_btn-padding-x: var(--lucas-ui-space-3);
  --_btn-font-size: var(--lucas-ui-font-size-sm);
  --_btn-icon-gap: var(--lucas-ui-space-1);
}

.lucas-ui-button--size-md {
  --_btn-padding-y: var(--lucas-ui-space-2);
  --_btn-padding-x: var(--lucas-ui-space-4);
  --_btn-font-size: var(--lucas-ui-font-size-md);
  --_btn-icon-gap: var(--lucas-ui-space-2);
}

.lucas-ui-button--size-lg {
  --_btn-padding-y: var(--lucas-ui-button-padding-y-lg);
  --_btn-padding-x: var(--lucas-ui-space-5);
  --_btn-font-size: var(--lucas-ui-font-size-md);
  --_btn-icon-gap: var(--lucas-ui-space-2);
}

.lucas-ui-button--size-xl {
  --_btn-padding-y: var(--lucas-ui-space-3);
  --_btn-padding-x: var(--lucas-ui-space-6);
  --_btn-font-size: var(--lucas-ui-font-size-lg);
  --_btn-icon-gap: var(--lucas-ui-space-2);
}

/* ── Color modifiers ─────────────────────────────────────────────────────── */

.lucas-ui-button--color-primary {
  --_btn-color: var(--lucas-ui-color-brand-primary);
  --_btn-color-hover: var(--lucas-ui-color-brand-primary-hover);
  --_btn-color-active: var(--lucas-ui-color-brand-primary-active);
  --_btn-color-on: var(--lucas-ui-color-brand-on-primary);
}

.lucas-ui-button--color-danger {
  --_btn-color: var(--lucas-ui-color-danger);
  --_btn-color-hover: var(--lucas-ui-color-danger-hover);
  --_btn-color-active: var(--lucas-ui-color-danger-active);
  --_btn-color-on: var(--lucas-ui-color-danger-on);
}

.lucas-ui-button--color-success {
  --_btn-color: var(--lucas-ui-color-success);
  --_btn-color-hover: var(--lucas-ui-color-success-hover);
  --_btn-color-active: var(--lucas-ui-color-success-active);
  --_btn-color-on: var(--lucas-ui-color-success-on);
}

.lucas-ui-button--color-warning {
  --_btn-color: var(--lucas-ui-color-warning);
  --_btn-color-hover: var(--lucas-ui-color-warning-hover);
  --_btn-color-active: var(--lucas-ui-color-warning-active);
  --_btn-color-on: var(--lucas-ui-color-warning-on);
}

.lucas-ui-button--color-neutral {
  --_btn-color: var(--lucas-ui-color-neutral);
  --_btn-color-hover: var(--lucas-ui-color-neutral-hover);
  --_btn-color-active: var(--lucas-ui-color-neutral-active);
  --_btn-color-on: var(--lucas-ui-color-neutral-on);
}

/* ── Variants ────────────────────────────────────────────────────────────── */

.lucas-ui-button--solid {
  background: var(--_btn-color);
  color: var(--_btn-color-on);
}

.lucas-ui-button--solid:hover:not(:disabled) {
  background: var(--_btn-color-hover);
}

.lucas-ui-button--solid:active:not(:disabled) {
  background: var(--_btn-color-active);
}

.lucas-ui-button--outline {
  background: transparent;
  border: var(--lucas-ui-border-width) solid var(--_btn-color);
  color: var(--_btn-color);
}

.lucas-ui-button--outline:hover:not(:disabled) {
  background: color-mix(in srgb, var(--_btn-color) 8%, transparent);
}

.lucas-ui-button--outline:active:not(:disabled) {
  background: color-mix(in srgb, var(--_btn-color) 14%, transparent);
}

.lucas-ui-button--ghost {
  background: transparent;
  color: var(--_btn-color);
}

.lucas-ui-button--ghost:hover:not(:disabled) {
  background: color-mix(in srgb, var(--_btn-color) 8%, transparent);
}

.lucas-ui-button--ghost:active:not(:disabled) {
  background: color-mix(in srgb, var(--_btn-color) 14%, transparent);
}

/* ── States ──────────────────────────────────────────────────────────────── */

.lucas-ui-button.is-disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: not-allowed;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */

.lucas-ui-button.is-loading {
  cursor: not-allowed;
}

/* Fade all direct children except the LoadingOverlay */
.lucas-ui-button.is-loading > *:not(.lucas-ui-loading-overlay) {
  opacity: var(--lucas-ui-opacity-loading-content);
}

/* ── Icon layout ─────────────────────────────────────────────────────────── */

.lucas-ui-button--icon-only {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--_btn-padding-y);
}

.lucas-ui-button--icon-left,
.lucas-ui-button--icon-right {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: var(--_btn-icon-gap);
}

.lucas-ui-button--icon-top,
.lucas-ui-button--icon-bottom {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--_btn-icon-gap);
}

.lucas-ui-button__label {
  display: contents;
}
</style>
