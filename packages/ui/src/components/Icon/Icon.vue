<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import IconHome from '../../icons/IconHome.vue'
import IconSave from '../../icons/IconSave.vue'
import IconTrash from '../../icons/IconTrash.vue'
import type { IconName } from '../../icons'
import type { Size } from '../../types'

export type { IconName }

export interface IconProps {
  /** Render a registered built-in icon by name. */
  name?: IconName
  /** Controls the font-size inherited by the icon SVG. Defaults to inheriting from the parent. */
  size?: Size
  /**
   * Accessible label for the icon. When provided, the wrapper gets role="img"
   * and aria-label. Omit when the icon is purely decorative (parent provides context).
   */
  label?: string
}

const registry: Record<IconName, Component> = {
  home: IconHome,
  save: IconSave,
  trash: IconTrash,
}

const props = defineProps<IconProps>()

const resolvedComponent = computed(() =>
  props.name ? registry[props.name] : null,
)
</script>

<template>
  <span
    class="lucas-ui-icon-wrapper"
    :class="size && `lucas-ui-icon-wrapper--${size}`"
    :role="label ? 'img' : undefined"
    :aria-label="label ?? undefined"
    :aria-hidden="label ? undefined : true"
  >
    <component v-if="resolvedComponent" :is="resolvedComponent" />
    <slot v-else />
  </span>
</template>

<style>
.lucas-ui-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Size modifiers set font-size so the child SVG (width/height: 1em) scales correctly. */
.lucas-ui-icon-wrapper--xs {
  font-size: var(--lucas-ui-icon-size-xs, 0.75rem);
}

.lucas-ui-icon-wrapper--sm {
  font-size: var(--lucas-ui-icon-size-sm, 1rem);
}

.lucas-ui-icon-wrapper--md {
  font-size: var(--lucas-ui-icon-size-md, 1.25rem);
}

.lucas-ui-icon-wrapper--lg {
  font-size: var(--lucas-ui-icon-size-lg, 1.5rem);
}

.lucas-ui-icon-wrapper--xl {
  font-size: var(--lucas-ui-icon-size-xl, 2rem);
}
</style>
