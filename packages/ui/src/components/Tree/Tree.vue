<script setup lang="ts">
import { computed, provide, useId, useSlots, toRef, onMounted, useAttrs } from 'vue'
import type { Size, TreeNode } from '../../types'
import type { IconName } from '../../icons'
import { useTree, type TreeSelectionMode } from '../../composables/useTree'
import TreeNodeItem from '../_internal/TreeNodeItem.vue'

export type { TreeSelectionMode }

export interface TreeProps {
  /** Array of root-level tree nodes. */
  nodes: TreeNode[]
  /** Selection mode. Defaults to 'none'. */
  selectionMode?: TreeSelectionMode
  /** Currently selected node id(s). Use with v-model:selected. */
  selected?: string | number | null | (string | number)[]
  /** Currently expanded node ids. Use with v-model:expanded. */
  expanded?: (string | number)[]
  /** Node ids to expand initially (uncontrolled mode). */
  defaultExpanded?: (string | number)[]
  /** Expand all nodes by default. Defaults to false. */
  defaultExpandAll?: boolean
  /** Async function to load children for a node. */
  onLoadChildren?: (node: TreeNode) => Promise<TreeNode[]>
  /** Show connecting guide lines. Defaults to false. */
  showLines?: boolean
  /** Visual size. Defaults to 'md'. */
  size?: Size
  /** Disable the entire tree. Defaults to false. */
  disabled?: boolean
  /** Accessible label for the tree. */
  label?: string
  /** Indentation size per level in pixels. Defaults to 20. */
  indentSize?: number
}

const props = withDefaults(defineProps<TreeProps>(), {
  selectionMode: 'none',
  selected: null,
  expanded: undefined,
  defaultExpanded: () => [],
  defaultExpandAll: false,
  showLines: false,
  size: 'md',
  disabled: false,
  indentSize: 20,
})

const emit = defineEmits<{
  'update:expanded': [ids: (string | number)[]]
  'update:selected': [value: string | number | null | (string | number)[]]
  'node-click': [node: TreeNode]
  'node-expand': [node: TreeNode]
  'node-collapse': [node: TreeNode]
}>()

const attrs = useAttrs()
const slots = useSlots()
const uid = useId()

const {
  activeId,
  expandedIds,
  selectedIds,
  visibleNodes,
  toggleExpand,
  selectNode,
  isExpanded,
  isSelected,
  isLoading,
  isNodeDisabled,
  hasChildren,
  getChildren,
  onKeydown,
} = useTree({
  nodes: toRef(props, 'nodes'),
  expanded: toRef(props, 'expanded'),
  defaultExpanded: toRef(props, 'defaultExpanded'),
  defaultExpandAll: toRef(props, 'defaultExpandAll'),
  selected: toRef(props, 'selected'),
  selectionMode: toRef(props, 'selectionMode'),
  disabled: toRef(props, 'disabled'),
  onLoadChildren: toRef(props, 'onLoadChildren'),
  onUpdateExpanded: (ids) => emit('update:expanded', ids),
  onUpdateSelected: (value) => emit('update:selected', value),
  onNodeClick: (node) => emit('node-click', node),
  onNodeExpand: (node) => emit('node-expand', node),
  onNodeCollapse: (node) => emit('node-collapse', node),
})

const activeDescendant = computed(() => {
  if (activeId.value == null) return undefined
  return `tree-node-${uid}-${activeId.value}`
})

const classes = computed(() => [
  'lucas-ui-tree',
  `lucas-ui-tree--size-${props.size}`,
  { 'lucas-ui-tree--lines': props.showLines },
  { 'lucas-ui-tree--disabled': props.disabled },
])

// Provide context to recursive TreeNodeItem children
provide('tree-context', {
  uid,
  indentSize: props.indentSize,
  showLines: props.showLines,
  selectionMode: props.selectionMode,
  activeId,
  isExpanded,
  isSelected,
  isLoading,
  isNodeDisabled,
  hasChildren,
  getChildren,
  toggleExpand,
  selectNode,
  slots,
})

if (import.meta.env.DEV) {
  onMounted(() => {
    if (!props.label && !attrs['aria-label']) {
      console.warn(
        '[Tree] A tree is missing an accessible label. ' +
          'Add a `label` prop or `aria-label` attribute.',
      )
    }
  })
}
</script>

<template>
  <div
    :class="classes"
    role="tree"
    :aria-label="label ?? undefined"
    tabindex="0"
    :aria-activedescendant="activeDescendant"
    @keydown="onKeydown"
  >
    <ul v-if="nodes.length" class="lucas-ui-tree__list" role="group">
      <TreeNodeItem
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :level="0"
      />
    </ul>

    <div v-else class="lucas-ui-tree__empty">
      <slot name="empty">No items</slot>
    </div>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-tree {
  --_tree-font-size: var(--lucas-ui-font-size-sm);
  --_tree-item-padding-y: var(--lucas-ui-tree-item-padding-y);
  --_tree-item-padding-x: var(--lucas-ui-tree-item-padding-x);

  font-family: inherit;
  font-size: var(--_tree-font-size);
  color: var(--lucas-ui-tree-item-color);
  outline: none;
}

/* ── Size modifiers ──────────────────────────────────────────────────────── */

.lucas-ui-tree--size-xs {
  --_tree-font-size: var(--lucas-ui-font-size-xs);
  --_tree-item-padding-y: 2px;
  --_tree-item-padding-x: var(--lucas-ui-space-1);
}

.lucas-ui-tree--size-sm {
  --_tree-font-size: var(--lucas-ui-font-size-xs);
  --_tree-item-padding-y: 3px;
  --_tree-item-padding-x: 6px;
}

.lucas-ui-tree--size-md {
  --_tree-font-size: var(--lucas-ui-font-size-sm);
  --_tree-item-padding-y: var(--lucas-ui-space-1);
  --_tree-item-padding-x: var(--lucas-ui-space-2);
}

.lucas-ui-tree--size-lg {
  --_tree-font-size: var(--lucas-ui-font-size-md);
  --_tree-item-padding-y: 6px;
  --_tree-item-padding-x: var(--lucas-ui-space-3);
}

.lucas-ui-tree--size-xl {
  --_tree-font-size: var(--lucas-ui-font-size-md);
  --_tree-item-padding-y: var(--lucas-ui-space-2);
  --_tree-item-padding-x: var(--lucas-ui-space-4);
}

/* ── Disabled ────────────────────────────────────────────────────────────── */

.lucas-ui-tree--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  pointer-events: none;
}

/* ── List reset ──────────────────────────────────────────────────────────── */

.lucas-ui-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ── Node item row ───────────────────────────────────────────────────────── */

.lucas-ui-tree__item {
  display: flex;
  align-items: center;
  gap: var(--lucas-ui-space-1);
  padding: var(--_tree-item-padding-y) var(--_tree-item-padding-x);
  border-radius: var(--lucas-ui-tree-item-border-radius);
  cursor: pointer;
  user-select: none;
  transition:
    background var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-tree__item:hover {
  background: var(--lucas-ui-tree-item-bg-hover);
}

.lucas-ui-tree__item--active {
  background: var(--lucas-ui-tree-item-bg-active);
}

.lucas-ui-tree__item--selected {
  background: var(--lucas-ui-tree-item-bg-selected);
}

.lucas-ui-tree__item--selected:hover {
  background: var(--lucas-ui-tree-item-bg-selected);
}

.lucas-ui-tree__item--disabled {
  opacity: var(--lucas-ui-opacity-disabled);
  cursor: default;
  pointer-events: none;
}

/* ── Indent spacer ───────────────────────────────────────────────────────── */

.lucas-ui-tree__indent {
  width: var(--_tree-indent, 0px);
  flex-shrink: 0;
}

/* ── Toggle chevron ──────────────────────────────────────────────────────── */

.lucas-ui-tree__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--lucas-ui-tree-toggle-size);
  height: var(--lucas-ui-tree-toggle-size);
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--lucas-ui-tree-toggle-color);
  transition: transform var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-tree__toggle--expanded {
  transform: rotate(90deg);
}

.lucas-ui-tree__toggle--leaf {
  cursor: default;
  visibility: hidden;
}

.lucas-ui-tree__toggle svg {
  width: 0.8em;
  height: 0.8em;
}

/* ── Icon ────────────────────────────────────────────────────────────────── */

.lucas-ui-tree__icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── Label ───────────────────────────────────────────────────────────────── */

.lucas-ui-tree__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

/* ── Empty state ─────────────────────────────────────────────────────────── */

.lucas-ui-tree__empty {
  padding: var(--lucas-ui-space-4);
  color: var(--lucas-ui-tree-empty-color);
  text-align: center;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */

.lucas-ui-tree__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--lucas-ui-space-2) var(--lucas-ui-space-4);
  position: relative;
  min-height: 32px;
}

/* ── Connecting lines ────────────────────────────────────────────────────── */

.lucas-ui-tree--lines .lucas-ui-tree__list--nested {
  position: relative;
}

.lucas-ui-tree--lines .lucas-ui-tree__list--nested > .lucas-ui-tree__node {
  position: relative;
}

.lucas-ui-tree--lines .lucas-ui-tree__list--nested > .lucas-ui-tree__node::before {
  content: '';
  position: absolute;
  left: calc(var(--_tree-indent, 0px) + var(--lucas-ui-tree-toggle-size) / 2 - var(--lucas-ui-tree-indent-size) + var(--_tree-item-padding-x));
  top: 0;
  bottom: 0;
  border-left: var(--lucas-ui-tree-line-width) solid var(--lucas-ui-tree-line-color);
  pointer-events: none;
}

.lucas-ui-tree--lines .lucas-ui-tree__list--nested > .lucas-ui-tree__node:last-child::before {
  bottom: 50%;
}

/* ── Expand/Collapse transition ──────────────────────────────────────────── */

.lucas-ui-tree-expand-enter-active,
.lucas-ui-tree-expand-leave-active {
  transition:
    opacity var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard),
    max-height var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
  overflow: hidden;
}

.lucas-ui-tree-expand-enter-from,
.lucas-ui-tree-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.lucas-ui-tree-expand-enter-to,
.lucas-ui-tree-expand-leave-from {
  opacity: 1;
  max-height: 9999px;
}
</style>
