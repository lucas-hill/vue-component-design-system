import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Tree } from '.'
import type { TreeProps } from '.'
import type { TreeNode } from '../../types'

const sampleNodes: TreeNode[] = [
  {
    id: 'documents',
    label: 'Documents',
    icon: 'home',
    children: [
      { id: 'resume', label: 'Resume.pdf' },
      {
        id: 'projects',
        label: 'Projects',
        children: [
          { id: 'project-a', label: 'project-alpha.zip' },
          { id: 'project-b', label: 'project-beta.zip' },
          { id: 'project-c', label: 'project-gamma.zip' },
        ],
      },
      { id: 'notes', label: 'Notes.txt' },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    children: [
      { id: 'vacation', label: 'Vacation', children: [
        { id: 'beach', label: 'beach.jpg' },
        { id: 'sunset', label: 'sunset.jpg' },
      ]},
      { id: 'profile', label: 'profile.png' },
    ],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    children: [
      { id: 'installer', label: 'installer.dmg' },
    ],
  },
  { id: 'readme', label: 'readme.txt' },
]

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'single'],
    },
    showLines: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultExpandAll: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Tree>

// ── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { nodes: sampleNodes, label: 'File browser' },
  render: (args: TreeProps) => ({
    components: { Tree },
    setup() { return { args } },
    template: `<Tree v-bind="args" />`,
  }),
}

// ── Expanded by default ─────────────────────────────────────────────────────

export const ExpandedByDefault: Story = {
  render: () => ({
    components: { Tree },
    setup() { return { nodes: sampleNodes } },
    template: `<Tree :nodes="nodes" label="File browser" default-expand-all />`,
  }),
}

// ── Single selection ────────────────────────────────────────────────────────

export const SingleSelection: Story = {
  render: () => ({
    components: { Tree },
    setup() {
      const selected = ref<string | number | null>(null)
      return { nodes: sampleNodes, selected }
    },
    template: `
      <div>
        <p style="margin-bottom: 8px; font-size: 14px; color: #6b7280;">
          Selected: <strong>{{ selected ?? 'none' }}</strong>
        </p>
        <Tree
          :nodes="nodes"
          label="File browser"
          selection-mode="single"
          v-model:selected="selected"
          default-expand-all
        />
      </div>
    `,
  }),
}

// ── With icons ──────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => ({
    components: { Tree },
    setup() {
      const nodes: TreeNode[] = [
        {
          id: 'home',
          label: 'Home',
          icon: 'home',
          children: [
            { id: 'saved', label: 'Saved Items', icon: 'save', children: [
              { id: 'item-1', label: 'Bookmark 1' },
              { id: 'item-2', label: 'Bookmark 2' },
            ]},
            { id: 'trash', label: 'Trash', icon: 'trash', children: [
              { id: 'deleted-1', label: 'Deleted file' },
            ]},
          ],
        },
      ]
      return { nodes }
    },
    template: `<Tree :nodes="nodes" label="Navigation" default-expand-all />`,
  }),
}

// ── Connecting lines ────────────────────────────────────────────────────────

export const ConnectingLines: Story = {
  render: () => ({
    components: { Tree },
    setup() { return { nodes: sampleNodes } },
    template: `<Tree :nodes="nodes" label="File browser" show-lines default-expand-all />`,
  }),
}

// ── Async loading ───────────────────────────────────────────────────────────

export const AsyncLoading: Story = {
  render: () => ({
    components: { Tree },
    setup() {
      const nodes: TreeNode[] = [
        { id: 'lazy-1', label: 'Click to load children', hasChildren: true },
        { id: 'lazy-2', label: 'Another lazy node', hasChildren: true },
        { id: 'leaf', label: 'I am a leaf' },
      ]

      const onLoadChildren = async (node: TreeNode) => {
        await new Promise((r) => setTimeout(r, 1500))
        return [
          { id: `${node.id}-child-1`, label: `Child 1 of ${node.label}` },
          { id: `${node.id}-child-2`, label: `Child 2 of ${node.label}` },
          { id: `${node.id}-child-3`, label: `Child 3 of ${node.label}`, hasChildren: true },
        ] as TreeNode[]
      }

      return { nodes, onLoadChildren }
    },
    template: `<Tree :nodes="nodes" label="Lazy tree" :on-load-children="onLoadChildren" />`,
  }),
}

// ── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { Tree },
    setup() { return { nodes: sampleNodes } },
    template: `
      <div style="display: flex; gap: 32px; flex-wrap: wrap;">
        <div v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
          <p style="margin-bottom: 4px; font-weight: 600; font-size: 14px;">{{ size }}</p>
          <Tree :nodes="nodes" :label="size + ' tree'" :size="size" :default-expanded="['documents']" />
        </div>
      </div>
    `,
  }),
}

// ── Disabled ────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    components: { Tree },
    setup() {
      const nodes: TreeNode[] = [
        {
          id: '1',
          label: 'Enabled folder',
          children: [
            { id: '1-1', label: 'Enabled file' },
            { id: '1-2', label: 'Disabled file', disabled: true },
          ],
        },
        { id: '2', label: 'Disabled folder', disabled: true, children: [
          { id: '2-1', label: 'Child' },
        ]},
        { id: '3', label: 'Enabled file' },
      ]
      return { nodes }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="margin-bottom: 4px; font-weight: 600; font-size: 14px;">Per-node disabled</p>
          <Tree :nodes="nodes" label="Mixed disabled" default-expand-all />
        </div>
        <div>
          <p style="margin-bottom: 4px; font-weight: 600; font-size: 14px;">Entire tree disabled</p>
          <Tree :nodes="nodes" label="All disabled" disabled default-expand-all />
        </div>
      </div>
    `,
  }),
}

// ── Deep nesting ────────────────────────────────────────────────────────────

export const DeepNesting: Story = {
  render: () => ({
    components: { Tree },
    setup() {
      function buildDeep(depth: number, prefix = ''): TreeNode[] {
        if (depth === 0) return [{ id: `${prefix}leaf`, label: `Leaf node` }]
        return [{
          id: `${prefix}level-${depth}`,
          label: `Level ${depth}`,
          children: [
            ...buildDeep(depth - 1, `${prefix}${depth}-`),
            { id: `${prefix}${depth}-sibling`, label: `Sibling at depth ${depth}` },
          ],
        }]
      }
      const nodes = buildDeep(8)
      return { nodes }
    },
    template: `<Tree :nodes="nodes" label="Deep tree" show-lines default-expand-all />`,
  }),
}

// ── Empty ───────────────────────────────────────────────────────────────────

export const Empty: Story = {
  render: () => ({
    components: { Tree },
    template: `<Tree :nodes="[]" label="Empty tree" />`,
  }),
}

// ── Large tree ──────────────────────────────────────────────────────────────

export const LargeTree: Story = {
  render: () => ({
    components: { Tree },
    setup() {
      const nodes: TreeNode[] = Array.from({ length: 50 }, (_, i) => ({
        id: `cat-${i}`,
        label: `Category ${i + 1}`,
        children: Array.from({ length: 10 }, (_, j) => ({
          id: `cat-${i}-item-${j}`,
          label: `Item ${j + 1}`,
        })),
      }))
      return { nodes }
    },
    template: `
      <div style="max-height: 400px; overflow: auto; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px;">
        <Tree :nodes="nodes" label="Large tree" />
      </div>
    `,
  }),
}
