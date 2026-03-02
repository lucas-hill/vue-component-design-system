<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost'
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  disabled: false
})

const classes = computed(() => [
  'lucas-ui-button',
  `lucas-ui-button--${props.variant}`,
  { 'is-disabled': props.disabled }
])
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style>
.lucas-ui-button {
    font-family: inherit;
    border: none;
    cursor: pointer;
    padding: var(--lucas-ui-space-2) var(--lucas-ui-space-4);
    border-radius: var(--lucas-ui-radius-md);
    transition:
        background var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
        transform var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

/* Solid */
.lucas-ui-button--solid {
  background: var(--lucas-ui-color-brand-primary);
  color: var(--lucas-ui-color-brand-on-primary);
}

.lucas-ui-button--solid:hover {
  background: var(--lucas-ui-color-brand-primary-hover);
}

.lucas-ui-button--solid:active {
  background: var(--lucas-ui-color-brand-primary-active);
}

/* Outline */
.lucas-ui-button--outline {
  background: transparent;
  border: 1px solid var(--lucas-ui-color-brand-primary);
  color: var(--lucas-ui-color-brand-primary);
}

/* Ghost */
.lucas-ui-button--ghost {
  background: transparent;
  color: var(--lucas-ui-color-brand-primary);
}

/* Disabled */
.lucas-ui-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
