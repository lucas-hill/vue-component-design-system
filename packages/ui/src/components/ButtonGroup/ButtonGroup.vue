<script setup lang="ts">
export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps {
  /** Stack buttons left-to-right or top-to-bottom. Defaults to 'horizontal'. */
  orientation?: ButtonGroupOrientation
  /**
   * Accessible label for the group (maps to aria-label).
   * Strongly recommended — describes the purpose of the set of buttons.
   */
  label?: string
}

withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <div
    class="lucas-ui-button-group"
    :class="orientation === 'vertical' && 'lucas-ui-button-group--vertical'"
    role="group"
    :aria-label="label"
  >
    <slot />
  </div>
</template>

<style>
/* ── Container ───────────────────────────────────────────────────────────── */

.lucas-ui-button-group {
  display: inline-flex;
  align-items: stretch;
}

.lucas-ui-button-group--vertical {
  flex-direction: column;
}

/*
 * ── Group item targeting ──────────────────────────────────────────────────
 *
 * Two selectors are used intentionally:
 *   1. > .lucas-ui-button          — direct Button component support
 *   2. > .lucas-ui-group-item      — forward-compatible hook; future components
 *                                    (CheckboxGroup, RadioGroup, etc.) add this
 *                                    class to receive the same group styling
 *                                    without any changes here.
 */

/* Strip border-radius from all group children */
.lucas-ui-button-group > .lucas-ui-button,
.lucas-ui-button-group > .lucas-ui-group-item {
  border-radius: 0;
}

/* ── Horizontal outer radii ──────────────────────────────────────────────── */

.lucas-ui-button-group:not(.lucas-ui-button-group--vertical) > .lucas-ui-button:first-child,
.lucas-ui-button-group:not(.lucas-ui-button-group--vertical) > .lucas-ui-group-item:first-child {
  border-top-left-radius: var(--lucas-ui-radius-md);
  border-bottom-left-radius: var(--lucas-ui-radius-md);
}

.lucas-ui-button-group:not(.lucas-ui-button-group--vertical) > .lucas-ui-button:last-child,
.lucas-ui-button-group:not(.lucas-ui-button-group--vertical) > .lucas-ui-group-item:last-child {
  border-top-right-radius: var(--lucas-ui-radius-md);
  border-bottom-right-radius: var(--lucas-ui-radius-md);
}

/* ── Vertical outer radii ────────────────────────────────────────────────── */

.lucas-ui-button-group--vertical > .lucas-ui-button:first-child,
.lucas-ui-button-group--vertical > .lucas-ui-group-item:first-child {
  border-top-left-radius: var(--lucas-ui-radius-md);
  border-top-right-radius: var(--lucas-ui-radius-md);
}

.lucas-ui-button-group--vertical > .lucas-ui-button:last-child,
.lucas-ui-button-group--vertical > .lucas-ui-group-item:last-child {
  border-bottom-left-radius: var(--lucas-ui-radius-md);
  border-bottom-right-radius: var(--lucas-ui-radius-md);
}

/* ── Border collapsing ───────────────────────────────────────────────────── */

/*
 * Negative margin collapses the shared edge between adjacent buttons.
 * For solid/ghost: no visible border, no effect.
 * For outline: eliminates the doubled 2px border between adjacent items.
 */
.lucas-ui-button-group:not(.lucas-ui-button-group--vertical) > .lucas-ui-button:not(:first-child),
.lucas-ui-button-group:not(.lucas-ui-button-group--vertical) > .lucas-ui-group-item:not(:first-child) {
  margin-left: calc(-1 * var(--lucas-ui-border-width));
}

.lucas-ui-button-group--vertical > .lucas-ui-button:not(:first-child),
.lucas-ui-button-group--vertical > .lucas-ui-group-item:not(:first-child) {
  margin-top: calc(-1 * var(--lucas-ui-border-width));
}

/* ── Focus / hover z-index ───────────────────────────────────────────────── */

/*
 * Bring the interacted button to the front so its border renders on top of
 * its neighbours. Button already has position: relative (for LoadingOverlay),
 * so z-index applies without additional setup.
 */
.lucas-ui-button-group > .lucas-ui-button:hover,
.lucas-ui-button-group > .lucas-ui-button:focus-visible,
.lucas-ui-button-group > .lucas-ui-button:focus,
.lucas-ui-button-group > .lucas-ui-group-item:hover,
.lucas-ui-button-group > .lucas-ui-group-item:focus-visible,
.lucas-ui-button-group > .lucas-ui-group-item:focus {
  z-index: 1;
}
</style>
