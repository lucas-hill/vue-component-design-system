<script setup lang="ts">
import { inject, computed } from 'vue'
import type { TreeNode } from '../../types'
import type { IconName } from '../../icons'
import Icon from '../Icon/Icon.vue'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay.vue'

interface TreeContext {
  uid: string
  indentSize: number
  showLines: boolean
  selectionMode: string
  activeId: { value: string | number | null }
  isExpanded: (id: string | number) => boolean
  isSelected: (id: string | number) => boolean
  isLoading: (id: string | number) => boolean
  isNodeDisabled: (node: TreeNode) => boolean
  hasChildren: (node: TreeNode) => boolean
  getChildren: (node: TreeNode) => TreeNode[] | undefined
  toggleExpand: (node: TreeNode) => void
  selectNode: (node: TreeNode) => void
  slots: Record<string, any>
}

const props = defineProps<{
  node: TreeNode
  level: number
}>()

const ctx = inject<TreeContext>('tree-context')!

const nodeId = computed(() => `tree-node-${ctx.uid}-${props.node.id}`)
const expanded = computed(() => ctx.isExpanded(props.node.id))
const selected = computed(() => ctx.isSelected(props.node.id))
const loading = computed(() => ctx.isLoading(props.node.id))
const isDisabled = computed(() => ctx.isNodeDisabled(props.node))
const isActive = computed(() => ctx.activeId.value === props.node.id)
const isBranch = computed(() => ctx.hasChildren(props.node) || props.node.hasChildren)
const children = computed(() => ctx.getChildren(props.node))
const hasIcon = computed(() => !!props.node.icon || !!ctx.slots.icon)
const indent = computed(() => `${props.level * ctx.indentSize}px`)

function onItemClick() {
  if (isDisabled.value) return
  ctx.selectNode(props.node)
  if (isBranch.value) {
    ctx.toggleExpand(props.node)
  }
}

function onToggleClick(event: MouseEvent) {
  event.stopPropagation()
  if (isDisabled.value) return
  ctx.toggleExpand(props.node)
}
</script>

<template>
  <li
    :id="nodeId"
    class="lucas-ui-tree__node"
    role="treeitem"
    :aria-expanded="isBranch ? expanded : undefined"
    :aria-selected="ctx.selectionMode !== 'none' ? selected : undefined"
    :tabindex="-1"
  >
    <div
      class="lucas-ui-tree__item"
      :class="{
        'lucas-ui-tree__item--branch': isBranch,
        'lucas-ui-tree__item--active': isActive,
        'lucas-ui-tree__item--selected': selected,
        'lucas-ui-tree__item--disabled': isDisabled,
      }"
      :style="{ '--_tree-indent': indent }"
      @click="onItemClick"
    >
      <span class="lucas-ui-tree__indent" aria-hidden="true" />

      <!-- Toggle chevron -->
      <template v-if="ctx.slots.toggle">
        <span class="lucas-ui-tree__toggle" @click="onToggleClick">
          <component
            :is="ctx.slots.toggle"
            :node="node"
            :expanded="expanded"
            :has-children="isBranch"
          />
        </span>
      </template>
      <template v-else>
        <button
          v-if="isBranch"
          class="lucas-ui-tree__toggle"
          :class="{ 'lucas-ui-tree__toggle--expanded': expanded }"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          @click="onToggleClick"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <span
          v-else
          class="lucas-ui-tree__toggle lucas-ui-tree__toggle--leaf"
          aria-hidden="true"
        />
      </template>

      <!-- Icon -->
      <span v-if="hasIcon" class="lucas-ui-tree__icon">
        <component
          v-if="ctx.slots.icon"
          :is="ctx.slots.icon"
          :node="node"
          :expanded="expanded"
        />
        <Icon v-else-if="node.icon" :name="(node.icon as IconName)" />
      </span>

      <!-- Label -->
      <span class="lucas-ui-tree__label">
        <component
          v-if="ctx.slots.node"
          :is="ctx.slots.node"
          :node="node"
          :level="level"
          :expanded="expanded"
          :selected="selected"
          :active="isActive"
          :disabled="isDisabled"
          :toggle="() => ctx.toggleExpand(node)"
          :select="() => ctx.selectNode(node)"
        />
        <template v-else>{{ node.label }}</template>
      </span>
    </div>

    <!-- Children -->
    <Transition name="lucas-ui-tree-expand">
      <ul
        v-if="isBranch && expanded"
        class="lucas-ui-tree__list lucas-ui-tree__list--nested"
        role="group"
      >
        <!-- Loading state -->
        <li v-if="loading" class="lucas-ui-tree__loading" role="none">
          <component
            v-if="ctx.slots.loading"
            :is="ctx.slots.loading"
            :node="node"
          />
          <LoadingOverlay v-else size="sm" />
        </li>

        <!-- Child nodes -->
        <template v-else-if="children?.length">
          <TreeNodeItem
            v-for="child in children"
            :key="child.id"
            :node="child"
            :level="level + 1"
          />
        </template>
      </ul>
    </Transition>
  </li>
</template>
