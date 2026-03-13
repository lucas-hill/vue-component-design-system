export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface FieldProps {
  label?: string
  error?: string
  description?: string
  disabled?: boolean
  size?: Size
}

export interface SelectOption {
  value: string | number
  label?: string
  disabled?: boolean
}

export interface SearchOption extends SelectOption {
  [key: string]: unknown
}

export interface TreeNode {
  /** Unique identifier for this node. */
  id: string | number
  /** Display label for this node. */
  label: string
  /** Child nodes. Omit or set to undefined for lazy-loaded nodes with hasChildren. */
  children?: TreeNode[]
  /** Whether this node has children that can be lazy-loaded. */
  hasChildren?: boolean
  /** Optional icon from the icon registry. */
  icon?: string
  /** Whether this node is disabled (not selectable, not expandable). */
  disabled?: boolean
}

export interface DataTableColumn {
  /** Unique key matching the property name on each row object. */
  key: string
  /** Human-readable header label. Falls back to `key` if omitted. */
  label?: string
  /** Column width CSS value (e.g. '200px', '1fr', '20%'). Defaults to '1fr'. */
  width?: string
  /** Cell text alignment. Defaults to 'left'. */
  align?: 'left' | 'center' | 'right'
  /** Whether this column shows in card mode. Defaults to true. */
  visibleInCard?: boolean
}
