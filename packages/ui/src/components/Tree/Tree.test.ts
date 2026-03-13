import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import Tree from './Tree.vue'
import type { TreeNode } from '../../types'

afterEach(cleanup)

const sampleNodes: TreeNode[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      { id: '1-1', label: 'Resume.pdf' },
      {
        id: '1-2',
        label: 'Projects',
        children: [
          { id: '1-2-1', label: 'project-a.zip' },
          { id: '1-2-2', label: 'project-b.zip' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Images',
    children: [
      { id: '2-1', label: 'photo.jpg' },
    ],
  },
  { id: '3', label: 'readme.txt' },
]

describe('Tree', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders root nodes with correct labels', () => {
    render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    expect(screen.getByText('Documents')).toBeTruthy()
    expect(screen.getByText('Images')).toBeTruthy()
    expect(screen.getByText('readme.txt')).toBeTruthy()
  })

  it('does not render children when parent is collapsed', () => {
    render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    expect(screen.queryByText('Resume.pdf')).toBeNull()
  })

  it('renders nested children when parent is expanded', () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['1'] },
    })
    expect(screen.getByText('Resume.pdf')).toBeTruthy()
    expect(screen.getByText('Projects')).toBeTruthy()
  })

  it('renders deeply nested children when all ancestors are expanded', () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['1', '1-2'] },
    })
    expect(screen.getByText('project-a.zip')).toBeTruthy()
  })

  it('falls back to "No items" when nodes is empty', () => {
    render(Tree, { props: { nodes: [], label: 'Files' } })
    expect(screen.getByText('No items')).toBeTruthy()
  })

  it('renders custom empty slot', () => {
    render(Tree, {
      props: { nodes: [], label: 'Files' },
      slots: { empty: 'Nothing here' },
    })
    expect(screen.getByText('Nothing here')).toBeTruthy()
  })

  // ── ARIA Structure ──────────────────────────────────────────────────────

  it('root has role="tree"', () => {
    const { container } = render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    expect(container.querySelector('[role="tree"]')).toBeTruthy()
  })

  it('root has aria-label', () => {
    const { container } = render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    expect(container.querySelector('[role="tree"]')!.getAttribute('aria-label')).toBe('Files')
  })

  it('each node has role="treeitem"', () => {
    render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    const items = screen.getAllByRole('treeitem')
    expect(items.length).toBe(3) // only root nodes visible
  })

  it('branch nodes have aria-expanded', () => {
    render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    const items = screen.getAllByRole('treeitem')
    const documentsItem = items.find((el) => el.textContent?.includes('Documents'))!
    expect(documentsItem.getAttribute('aria-expanded')).toBe('false')
  })

  it('leaf nodes do not have aria-expanded', () => {
    render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    const items = screen.getAllByRole('treeitem')
    const readmeItem = items.find((el) => el.textContent?.includes('readme.txt'))!
    expect(readmeItem.getAttribute('aria-expanded')).toBeNull()
  })

  it('expanded branch has nested role="group"', () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['1'] },
    })
    const groups = container.querySelectorAll('[role="group"]')
    // Root group + expanded Documents group
    expect(groups.length).toBeGreaterThanOrEqual(2)
  })

  // ── Expand/Collapse ───────────────────────────────────────────────────

  it('clicking a branch node expands it', async () => {
    render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
    expect(screen.queryByText('Resume.pdf')).toBeNull()

    const documentsItem = screen.getByText('Documents')
    await fireEvent.click(documentsItem)

    expect(screen.getByText('Resume.pdf')).toBeTruthy()
  })

  it('clicking an expanded branch node collapses it', async () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['1'] },
    })
    expect(screen.getByText('Resume.pdf')).toBeTruthy()

    const documentsItem = screen.getByText('Documents')
    await fireEvent.click(documentsItem)

    expect(screen.queryByText('Resume.pdf')).toBeNull()
  })

  it('emits update:expanded when toggling', async () => {
    const { emitted } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })

    await fireEvent.click(screen.getByText('Documents'))

    expect(emitted()['update:expanded']).toBeTruthy()
    expect(emitted()['update:expanded'][0][0]).toContain('1')
  })

  it('emits node-expand when node is expanded', async () => {
    const { emitted } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })

    await fireEvent.click(screen.getByText('Documents'))

    expect(emitted()['node-expand']).toBeTruthy()
    expect(emitted()['node-expand'][0][0]).toMatchObject({ id: '1', label: 'Documents' })
  })

  it('emits node-collapse when node is collapsed', async () => {
    const { emitted } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['1'] },
    })

    await fireEvent.click(screen.getByText('Documents'))

    expect(emitted()['node-collapse']).toBeTruthy()
    expect(emitted()['node-collapse'][0][0]).toMatchObject({ id: '1', label: 'Documents' })
  })

  it('defaultExpanded sets initial expanded state', () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['2'] },
    })
    expect(screen.getByText('photo.jpg')).toBeTruthy()
    expect(screen.queryByText('Resume.pdf')).toBeNull()
  })

  it('defaultExpandAll expands all nodes', () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpandAll: true },
    })
    expect(screen.getByText('Resume.pdf')).toBeTruthy()
    expect(screen.getByText('project-a.zip')).toBeTruthy()
    expect(screen.getByText('photo.jpg')).toBeTruthy()
  })

  // ── Selection ─────────────────────────────────────────────────────────

  it('selectionMode="none": no aria-selected attribute', () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', selectionMode: 'none' },
    })
    const items = screen.getAllByRole('treeitem')
    items.forEach((item) => {
      expect(item.getAttribute('aria-selected')).toBeNull()
    })
  })

  it('selectionMode="single": clicking emits update:selected', async () => {
    const { emitted } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', selectionMode: 'single' },
    })

    await fireEvent.click(screen.getByText('readme.txt'))

    expect(emitted()['update:selected']).toBeTruthy()
    expect(emitted()['update:selected'][0][0]).toBe('3')
  })

  it('selectionMode="single": has aria-selected attributes', () => {
    render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', selectionMode: 'single' },
    })
    const items = screen.getAllByRole('treeitem')
    items.forEach((item) => {
      expect(item.getAttribute('aria-selected')).toBe('false')
    })
  })

  it('selected node gets selected class', () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', selectionMode: 'single', selected: '3' },
    })
    const selectedItem = container.querySelector('.lucas-ui-tree__item--selected')
    expect(selectedItem).toBeTruthy()
    expect(selectedItem!.textContent).toContain('readme.txt')
  })

  // ── Keyboard navigation ───────────────────────────────────────────────

  it('ArrowDown moves to next visible node', async () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })
    const tree = container.querySelector('[role="tree"]')!

    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    expect(tree.getAttribute('aria-activedescendant')).toContain('1')

    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    expect(tree.getAttribute('aria-activedescendant')).toContain('2')
  })

  it('ArrowUp moves to previous visible node', async () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })
    const tree = container.querySelector('[role="tree"]')!

    // Move down twice then up once
    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    await fireEvent.keyDown(tree, { key: 'ArrowUp' })

    expect(tree.getAttribute('aria-activedescendant')).toContain('1')
  })

  it('ArrowRight on closed branch expands it', async () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })
    const tree = container.querySelector('[role="tree"]')!

    // Focus Documents
    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    // Expand it
    await fireEvent.keyDown(tree, { key: 'ArrowRight' })

    expect(screen.getByText('Resume.pdf')).toBeTruthy()
  })

  it('ArrowLeft on open branch collapses it', async () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', defaultExpanded: ['1'] },
    })
    const tree = container.querySelector('[role="tree"]')!

    // Focus Documents
    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    // Collapse it
    await fireEvent.keyDown(tree, { key: 'ArrowLeft' })

    expect(screen.queryByText('Resume.pdf')).toBeNull()
  })

  it('Home moves to first node', async () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })
    const tree = container.querySelector('[role="tree"]')!

    // Move to last
    await fireEvent.keyDown(tree, { key: 'End' })
    // Move to first
    await fireEvent.keyDown(tree, { key: 'Home' })

    expect(tree.getAttribute('aria-activedescendant')).toContain('1')
  })

  it('End moves to last visible node', async () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })
    const tree = container.querySelector('[role="tree"]')!

    await fireEvent.keyDown(tree, { key: 'End' })

    expect(tree.getAttribute('aria-activedescendant')).toContain('3')
  })

  it('Enter activates/selects focused node', async () => {
    const { container, emitted } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', selectionMode: 'single' },
    })
    const tree = container.querySelector('[role="tree"]')!

    // Focus readme.txt (3rd item)
    await fireEvent.keyDown(tree, { key: 'End' })
    await fireEvent.keyDown(tree, { key: 'Enter' })

    expect(emitted()['update:selected']).toBeTruthy()
    expect(emitted()['update:selected'][0][0]).toBe('3')
  })

  // ── Disabled state ────────────────────────────────────────────────────

  it('disabled node has disabled class', () => {
    const disabledNodes: TreeNode[] = [
      { id: '1', label: 'Disabled', disabled: true },
      { id: '2', label: 'Enabled' },
    ]
    const { container } = render(Tree, {
      props: { nodes: disabledNodes, label: 'Files' },
    })
    expect(container.querySelector('.lucas-ui-tree__item--disabled')).toBeTruthy()
  })

  it('disabled node is not selectable', async () => {
    const disabledNodes: TreeNode[] = [
      { id: '1', label: 'Disabled', disabled: true },
    ]
    const { emitted } = render(Tree, {
      props: { nodes: disabledNodes, label: 'Files', selectionMode: 'single' },
    })

    await fireEvent.click(screen.getByText('Disabled'))

    expect(emitted()['update:selected']).toBeUndefined()
  })

  it('tree-level disabled applies disabled class', () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', disabled: true },
    })
    expect(container.querySelector('.lucas-ui-tree--disabled')).toBeTruthy()
  })

  // ── Size modifiers ────────────────────────────────────────────────────

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class',
    (size) => {
      const { container } = render(Tree, {
        props: { nodes: sampleNodes, label: 'Files', size },
      })
      expect(container.querySelector(`.lucas-ui-tree--size-${size}`)).toBeTruthy()
    },
  )

  // ── Icons ─────────────────────────────────────────────────────────────

  it('node with icon renders Icon component', () => {
    const nodesWithIcon: TreeNode[] = [
      { id: '1', label: 'Home', icon: 'home' },
    ]
    const { container } = render(Tree, {
      props: { nodes: nodesWithIcon, label: 'Files' },
    })
    expect(container.querySelector('.lucas-ui-tree__icon')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('node without icon does not render icon wrapper', () => {
    const nodesNoIcon: TreeNode[] = [
      { id: '1', label: 'Plain' },
    ]
    const { container } = render(Tree, {
      props: { nodes: nodesNoIcon, label: 'Files' },
    })
    expect(container.querySelector('.lucas-ui-tree__icon')).toBeNull()
  })

  // ── Show lines ────────────────────────────────────────────────────────

  it('applies lines class when showLines is true', () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files', showLines: true },
    })
    expect(container.querySelector('.lucas-ui-tree--lines')).toBeTruthy()
  })

  it('does not apply lines class by default', () => {
    const { container } = render(Tree, {
      props: { nodes: sampleNodes, label: 'Files' },
    })
    expect(container.querySelector('.lucas-ui-tree--lines')).toBeNull()
  })

  // ── Async loading ─────────────────────────────────────────────────────

  it('calls onLoadChildren when expanding a node with hasChildren', async () => {
    const lazyNodes: TreeNode[] = [
      { id: '1', label: 'Lazy', hasChildren: true },
    ]
    const loadFn = vi.fn().mockResolvedValue([
      { id: '1-1', label: 'Loaded Child' },
    ])

    render(Tree, {
      props: { nodes: lazyNodes, label: 'Files', onLoadChildren: loadFn },
    })

    await fireEvent.click(screen.getByText('Lazy'))

    expect(loadFn).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))

    // Wait for the async load to complete
    await vi.waitFor(() => {
      expect(screen.getByText('Loaded Child')).toBeTruthy()
    })
  })

  // ── Accessibility warning ─────────────────────────────────────────────

  describe('accessibility warning', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('warns in dev when tree has no label', async () => {
      render(Tree, { props: { nodes: sampleNodes } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('accessible label'))
    })

    it('does not warn when label is provided', async () => {
      render(Tree, { props: { nodes: sampleNodes, label: 'Files' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
