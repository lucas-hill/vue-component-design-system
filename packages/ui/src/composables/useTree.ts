import { ref, computed, watch, type Ref } from 'vue'
import type { TreeNode } from '../types'

export type TreeSelectionMode = 'none' | 'single' | 'multiple'

export interface UseTreeOptions {
  nodes: Ref<TreeNode[]>
  expanded: Ref<(string | number)[] | undefined>
  defaultExpanded: Ref<(string | number)[]>
  defaultExpandAll: Ref<boolean>
  selected: Ref<string | number | null | (string | number)[]>
  selectionMode: Ref<TreeSelectionMode>
  disabled: Ref<boolean>
  onLoadChildren?: Ref<((node: TreeNode) => Promise<TreeNode[]>) | undefined>
  onUpdateExpanded: (ids: (string | number)[]) => void
  onUpdateSelected: (value: string | number | null | (string | number)[]) => void
  onNodeClick: (node: TreeNode) => void
  onNodeExpand: (node: TreeNode) => void
  onNodeCollapse: (node: TreeNode) => void
}

interface FlatEntry {
  node: TreeNode
  level: number
  parent: TreeNode | null
}

function collectAllIds(nodes: TreeNode[]): (string | number)[] {
  const ids: (string | number)[] = []
  function walk(list: TreeNode[]) {
    for (const node of list) {
      if (node.children?.length || node.hasChildren) {
        ids.push(node.id)
      }
      if (node.children?.length) walk(node.children)
    }
  }
  walk(nodes)
  return ids
}

export function useTree({
  nodes,
  expanded,
  defaultExpanded,
  defaultExpandAll,
  selected,
  selectionMode,
  disabled,
  onLoadChildren,
  onUpdateExpanded,
  onUpdateSelected,
  onNodeClick,
  onNodeExpand,
  onNodeCollapse,
}: UseTreeOptions) {
  // Internal expanded state (used when uncontrolled)
  const internalExpanded = ref<(string | number)[]>(
    defaultExpandAll.value ? collectAllIds(nodes.value) : [...defaultExpanded.value],
  )

  const expandedIds = computed<Set<string | number>>(() => {
    const source = expanded.value !== undefined ? expanded.value : internalExpanded.value
    return new Set(source)
  })

  const selectedIds = computed<Set<string | number>>(() => {
    if (selectionMode.value === 'none') return new Set()
    const val = selected.value
    if (val == null) return new Set()
    if (Array.isArray(val)) return new Set(val)
    return new Set([val])
  })

  const loadingIds = ref<Set<string | number>>(new Set())
  const loadedChildrenCache = ref<Map<string | number, TreeNode[]>>(new Map())

  const activeId = ref<string | number | null>(null)

  // Flatten visible nodes for keyboard navigation
  const visibleNodes = computed<FlatEntry[]>(() => {
    const result: FlatEntry[] = []
    function walk(list: TreeNode[], level: number, parent: TreeNode | null) {
      for (const node of list) {
        result.push({ node, level, parent })
        if (expandedIds.value.has(node.id)) {
          const children = loadedChildrenCache.value.get(node.id) ?? node.children
          if (children?.length) {
            walk(children, level + 1, node)
          }
        }
      }
    }
    walk(nodes.value, 0, null)
    return result
  })

  function isExpanded(id: string | number): boolean {
    return expandedIds.value.has(id)
  }

  function isSelected(id: string | number): boolean {
    return selectedIds.value.has(id)
  }

  function isLoading(id: string | number): boolean {
    return loadingIds.value.has(id)
  }

  function isNodeDisabled(node: TreeNode): boolean {
    return disabled.value || !!node.disabled
  }

  function hasChildren(node: TreeNode): boolean {
    const cached = loadedChildrenCache.value.get(node.id)
    if (cached?.length) return true
    return !!(node.children?.length || node.hasChildren)
  }

  function getChildren(node: TreeNode): TreeNode[] | undefined {
    return loadedChildrenCache.value.get(node.id) ?? node.children
  }

  function setExpanded(ids: (string | number)[]) {
    if (expanded.value === undefined) {
      internalExpanded.value = ids
    }
    onUpdateExpanded(ids)
  }

  async function toggleExpand(node: TreeNode) {
    if (isNodeDisabled(node)) return
    if (!hasChildren(node) && !node.hasChildren) return

    const currentIds = [...expandedIds.value]

    if (isExpanded(node.id)) {
      setExpanded(currentIds.filter((id) => id !== node.id))
      onNodeCollapse(node)
    } else {
      // Check if we need to load children
      if (
        node.hasChildren &&
        !node.children?.length &&
        !loadedChildrenCache.value.has(node.id) &&
        onLoadChildren?.value
      ) {
        loadingIds.value = new Set([...loadingIds.value, node.id])
        try {
          const children = await onLoadChildren.value(node)
          loadedChildrenCache.value = new Map([...loadedChildrenCache.value, [node.id, children]])
        } finally {
          const next = new Set(loadingIds.value)
          next.delete(node.id)
          loadingIds.value = next
        }
      }
      setExpanded([...currentIds, node.id])
      onNodeExpand(node)
    }
  }

  function selectNode(node: TreeNode) {
    if (isNodeDisabled(node)) return
    onNodeClick(node)

    if (selectionMode.value === 'none') return

    if (selectionMode.value === 'single') {
      const current = selected.value
      if (current === node.id) {
        onUpdateSelected(null)
      } else {
        onUpdateSelected(node.id)
      }
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (disabled.value) return
    const count = visibleNodes.value.length
    if (count === 0) return

    const currentIndex = activeId.value != null
      ? visibleNodes.value.findIndex((e) => e.node.id === activeId.value)
      : -1

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const next = currentIndex < count - 1 ? currentIndex + 1 : currentIndex
        activeId.value = visibleNodes.value[next].node.id
        break
      }

      case 'ArrowUp': {
        event.preventDefault()
        const prev = currentIndex > 0 ? currentIndex - 1 : 0
        activeId.value = visibleNodes.value[prev].node.id
        break
      }

      case 'ArrowRight': {
        event.preventDefault()
        if (currentIndex < 0) break
        const entry = visibleNodes.value[currentIndex]
        if (hasChildren(entry.node)) {
          if (!isExpanded(entry.node.id)) {
            toggleExpand(entry.node)
          } else {
            // Move to first child
            if (currentIndex + 1 < count) {
              const nextEntry = visibleNodes.value[currentIndex + 1]
              if (nextEntry.level > entry.level) {
                activeId.value = nextEntry.node.id
              }
            }
          }
        }
        break
      }

      case 'ArrowLeft': {
        event.preventDefault()
        if (currentIndex < 0) break
        const entry = visibleNodes.value[currentIndex]
        if (hasChildren(entry.node) && isExpanded(entry.node.id)) {
          toggleExpand(entry.node)
        } else if (entry.parent) {
          activeId.value = entry.parent.id
        }
        break
      }

      case 'Home': {
        event.preventDefault()
        if (count > 0) {
          activeId.value = visibleNodes.value[0].node.id
        }
        break
      }

      case 'End': {
        event.preventDefault()
        if (count > 0) {
          activeId.value = visibleNodes.value[count - 1].node.id
        }
        break
      }

      case 'Enter':
      case ' ': {
        event.preventDefault()
        if (currentIndex >= 0) {
          const entry = visibleNodes.value[currentIndex]
          selectNode(entry.node)
          if (event.key === 'Enter' && hasChildren(entry.node)) {
            toggleExpand(entry.node)
          }
        }
        break
      }

      default: {
        // Type-ahead: single character
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const char = event.key.toLowerCase()
          const startIdx = currentIndex + 1
          for (let i = 0; i < count; i++) {
            const idx = (startIdx + i) % count
            const label = visibleNodes.value[idx].node.label
            if (label.toLowerCase().startsWith(char)) {
              activeId.value = visibleNodes.value[idx].node.id
              break
            }
          }
        }
        break
      }
    }
  }

  // If defaultExpandAll changes after mount and we get new nodes, re-expand
  watch(
    () => nodes.value,
    (newNodes) => {
      if (defaultExpandAll.value && expanded.value === undefined) {
        internalExpanded.value = collectAllIds(newNodes)
      }
    },
  )

  return {
    activeId,
    expandedIds,
    selectedIds,
    loadingIds,
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
  }
}
