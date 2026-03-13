<script setup lang="ts">
import type { Size } from '../../types'

export interface LoadingOverlayProps {
  /**
   * Controls the spinner size.
   * - sm / md / lg match the Icon component's scale.
   * - xl is intended for larger containers (Card, Modal, full sections).
   * Defaults to 'md'.
   */
  size?: Size
  /**
   * Accessible label for the overlay.
   * Provide this when the parent element does NOT already handle accessibility
   * (e.g. a Card that has no aria-busy). Omit when used inside Button —
   * the button element owns aria-busy and the overlay should be aria-hidden.
   */
  label?: string
}

withDefaults(defineProps<LoadingOverlayProps>(), {
  size: 'md',
})
</script>

<template>
  <span
    class="lucas-ui-loading-overlay"
    :class="`lucas-ui-loading-overlay--${size}`"
    :role="label ? 'status' : undefined"
    :aria-label="label ?? undefined"
    :aria-hidden="label ? undefined : true"
  >
    <svg
      class="lucas-ui-loading-overlay__spinner"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<style>
.lucas-ui-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lucas-ui-color-overlay-bg, rgba(0, 0, 0, 0.15));
  border-radius: inherit;
  pointer-events: none;
}

.lucas-ui-loading-overlay__spinner {
  animation: lucas-ui-spin 0.75s linear infinite;
  flex-shrink: 0;
}

.lucas-ui-loading-overlay__spinner circle {
  stroke-opacity: var(--lucas-ui-opacity-spinner-track);
}

/* Size modifiers */
.lucas-ui-loading-overlay--xs .lucas-ui-loading-overlay__spinner {
  width: var(--lucas-ui-icon-size-xs, 0.75rem);
  height: var(--lucas-ui-icon-size-xs, 0.75rem);
}

.lucas-ui-loading-overlay--sm  .lucas-ui-loading-overlay__spinner {
  width: var(--lucas-ui-icon-size-sm, 1rem);
  height: var(--lucas-ui-icon-size-sm, 1rem);
}

.lucas-ui-loading-overlay--md  .lucas-ui-loading-overlay__spinner {
  width: var(--lucas-ui-icon-size-md, 1.25rem);
  height: var(--lucas-ui-icon-size-md, 1.25rem);
}

.lucas-ui-loading-overlay--lg  .lucas-ui-loading-overlay__spinner {
  width: var(--lucas-ui-icon-size-lg, 1.5rem);
  height: var(--lucas-ui-icon-size-lg, 1.5rem);
}

.lucas-ui-loading-overlay--xl  .lucas-ui-loading-overlay__spinner {
  width: var(--lucas-ui-loading-overlay-size-xl, 2.5rem);
  height: var(--lucas-ui-loading-overlay-size-xl, 2.5rem);
}

@keyframes lucas-ui-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
