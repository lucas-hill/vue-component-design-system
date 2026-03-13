<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { Size } from '../../types'
import type { IconName } from '../../icons'

export type TagVariant = 'solid' | 'subtle' | 'outline'
export type TagColor = 'primary' | 'danger' | 'success' | 'warning' | 'neutral'

export interface TagProps {
  /** Visual variant. Defaults to 'subtle'. */
  variant?: TagVariant
  /** Semantic color. Defaults to 'neutral'. */
  color?: TagColor
  /** Size. Defaults to 'md'. */
  size?: Size
  /** Fully rounded pill shape. Defaults to false. */
  pill?: boolean
  /** Show a close/dismiss button. Defaults to false. */
  closable?: boolean
  /** Name of a registered built-in icon to show before the label. */
  icon?: IconName
}

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'subtle',
  color: 'neutral',
  size: 'md',
  pill: false,
  closable: false,
})

const emit = defineEmits<{
  close: []
}>()

const slots = useSlots()

const hasIcon = computed(() => !!(props.icon || slots.icon))

const classes = computed(() => [
  'lucas-ui-tag',
  `lucas-ui-tag--${props.variant}`,
  `lucas-ui-tag--color-${props.color}`,
  `lucas-ui-tag--size-${props.size}`,
  { 'lucas-ui-tag--pill': props.pill },
])
</script>

<template>
  <span :class="classes">
    <span v-if="hasIcon" class="lucas-ui-tag__icon">
      <slot name="icon">
        <Icon :name="icon!" />
      </slot>
    </span>

    <span class="lucas-ui-tag__label">
      <slot />
    </span>

    <button
      v-if="closable"
      type="button"
      class="lucas-ui-tag__close"
      aria-label="Remove"
      @click="emit('close')"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-tag {
  --_tag-color: var(--lucas-ui-color-neutral);
  --_tag-color-on: var(--lucas-ui-color-neutral-on);
  --_tag-padding-y: 2px;
  --_tag-padding-x: var(--lucas-ui-space-2);
  --_tag-font-size: var(--lucas-ui-font-size-sm);
  --_tag-gap: var(--lucas-ui-space-1);

  display: inline-flex;
  align-items: center;
  gap: var(--_tag-gap);
  padding: var(--_tag-padding-y) var(--_tag-padding-x);
  font-family: inherit;
  font-size: var(--_tag-font-size);
  line-height: 1.4;
  border-radius: var(--lucas-ui-radius-md);
  border: none;
  transition:
    background var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    border-color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

/* ── Pill shape ──────────────────────────────────────────────────────────── */

.lucas-ui-tag--pill {
  border-radius: var(--lucas-ui-radius-pill);
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-tag--size-xs {
  --_tag-padding-y: 0px;
  --_tag-padding-x: var(--lucas-ui-space-1);
  --_tag-font-size: var(--lucas-ui-font-size-xs);
  --_tag-gap: 2px;
}

.lucas-ui-tag--size-sm {
  --_tag-padding-y: 1px;
  --_tag-padding-x: 6px;
  --_tag-font-size: var(--lucas-ui-font-size-xs);
  --_tag-gap: var(--lucas-ui-space-1);
}

.lucas-ui-tag--size-md {
  --_tag-padding-y: 2px;
  --_tag-padding-x: var(--lucas-ui-space-2);
  --_tag-font-size: var(--lucas-ui-font-size-sm);
  --_tag-gap: var(--lucas-ui-space-1);
}

.lucas-ui-tag--size-lg {
  --_tag-padding-y: var(--lucas-ui-space-1);
  --_tag-padding-x: var(--lucas-ui-space-3);
  --_tag-font-size: var(--lucas-ui-font-size-md);
  --_tag-gap: var(--lucas-ui-space-1);
}

.lucas-ui-tag--size-xl {
  --_tag-padding-y: var(--lucas-ui-space-2);
  --_tag-padding-x: var(--lucas-ui-space-4);
  --_tag-font-size: var(--lucas-ui-font-size-md);
  --_tag-gap: var(--lucas-ui-space-2);
}

/* ── Color modifiers ─────────────────────────────────────────────────────── */

.lucas-ui-tag--color-primary {
  --_tag-color: var(--lucas-ui-color-brand-primary);
  --_tag-color-on: var(--lucas-ui-color-brand-on-primary);
}

.lucas-ui-tag--color-danger {
  --_tag-color: var(--lucas-ui-color-danger);
  --_tag-color-on: var(--lucas-ui-color-danger-on);
}

.lucas-ui-tag--color-success {
  --_tag-color: var(--lucas-ui-color-success);
  --_tag-color-on: var(--lucas-ui-color-success-on);
}

.lucas-ui-tag--color-warning {
  --_tag-color: var(--lucas-ui-color-warning);
  --_tag-color-on: var(--lucas-ui-color-warning-on);
}

.lucas-ui-tag--color-neutral {
  --_tag-color: var(--lucas-ui-color-neutral);
  --_tag-color-on: var(--lucas-ui-color-neutral-on);
}

/* ── Variants ────────────────────────────────────────────────────────────── */

.lucas-ui-tag--solid {
  background: var(--_tag-color);
  color: var(--_tag-color-on);
}

.lucas-ui-tag--subtle {
  background: color-mix(in srgb, var(--_tag-color) 12%, transparent);
  color: var(--_tag-color);
}

.lucas-ui-tag--outline {
  background: transparent;
  border: var(--lucas-ui-border-width) solid var(--_tag-color);
  color: var(--_tag-color);
}

/* ── Icon ────────────────────────────────────────────────────────────────── */

.lucas-ui-tag__icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── Label ───────────────────────────────────────────────────────────────── */

.lucas-ui-tag__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Close button ────────────────────────────────────────────────────────── */

.lucas-ui-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: var(--lucas-ui-tag-close-opacity);
  flex-shrink: 0;
  transition: opacity var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-tag__close:hover {
  opacity: var(--lucas-ui-tag-close-opacity-hover);
}

.lucas-ui-tag__close svg {
  width: 0.7em;
  height: 0.7em;
}
</style>
