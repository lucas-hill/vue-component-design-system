import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableColumn } from '../../types'

afterEach(cleanup)

const columns: DataTableColumn[] = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
]

const rows = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
]

describe('DataTable', () => {
  // ── Core rendering ──────────────────────────────────────────────────────

  it('renders headers from columns', () => {
    render(DataTable, { props: { columns, rows, label: 'Users' } })
    expect(screen.getByText('ID')).toBeTruthy()
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Email')).toBeTruthy()
  })

  it('renders cell values from rows', () => {
    render(DataTable, { props: { columns, rows, label: 'Users' } })
    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByText('bob@example.com')).toBeTruthy()
  })

  it('falls back to key when column label is omitted', () => {
    const cols: DataTableColumn[] = [{ key: 'status' }]
    const data = [{ id: 1, status: 'active' }]
    render(DataTable, { props: { columns: cols, rows: data, label: 'Test' } })
    expect(screen.getByText('status')).toBeTruthy()
  })

  // ── ARIA structure ──────────────────────────────────────────────────────

  it('has role="table" by default', () => {
    const { container } = render(DataTable, { props: { columns, rows, label: 'Users' } })
    expect(container.querySelector('[role="table"]')).toBeTruthy()
  })

  it('applies aria-label from label prop', () => {
    const { container } = render(DataTable, { props: { columns, rows, label: 'Users table' } })
    expect(container.querySelector('[aria-label="Users table"]')).toBeTruthy()
  })

  it('falls back to caption for aria-label', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, caption: 'User list' },
    })
    expect(container.querySelector('[aria-label="User list"]')).toBeTruthy()
  })

  it('renders columnheader roles', () => {
    render(DataTable, { props: { columns, rows, label: 'Users' } })
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(3)
  })

  it('renders cell roles', () => {
    render(DataTable, { props: { columns, rows, label: 'Users' } })
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(9) // 3 columns × 3 rows
  })

  it('renders row roles', () => {
    render(DataTable, { props: { columns, rows, label: 'Users' } })
    // 1 header row + 3 data rows
    const rowEls = screen.getAllByRole('row')
    expect(rowEls).toHaveLength(4)
  })

  // ── Slots ───────────────────────────────────────────────────────────────

  it('renders cell-{key} scoped slot', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users' },
      slots: {
        'cell-name': ({ value }: { value: unknown }) =>
          h('strong', { class: 'custom-name' }, String(value)),
      },
    })
    const strong = container.querySelector('strong.custom-name')
    expect(strong).toBeTruthy()
    expect(strong!.textContent).toBe('Alice')
  })

  it('renders fallback cell slot', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users' },
      slots: {
        cell: ({ value }: { value: unknown }) =>
          h('em', { class: 'custom-cell' }, String(value)),
      },
    })
    const ems = container.querySelectorAll('em.custom-cell')
    expect(ems.length).toBe(9)
  })

  it('cell-{key} slot takes priority over cell slot', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users' },
      slots: {
        'cell-name': ({ value }: { value: unknown }) =>
          h('strong', { class: 'specific' }, String(value)),
        cell: ({ value }: { value: unknown }) =>
          h('em', { class: 'fallback' }, String(value)),
      },
    })
    // Name column should use specific slot
    expect(container.querySelectorAll('strong.specific')).toHaveLength(3)
    // Other columns (id, email) should use fallback — 6 cells
    expect(container.querySelectorAll('em.fallback')).toHaveLength(6)
  })

  it('renders header-{key} slot', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users' },
      slots: {
        'header-name': ({ column }: { column: DataTableColumn }) =>
          h('span', { class: 'custom-header' }, `Custom: ${column.label}`),
      },
    })
    const custom = container.querySelector('.custom-header')
    expect(custom).toBeTruthy()
    expect(custom!.textContent).toBe('Custom: Name')
  })

  // ── Empty state ─────────────────────────────────────────────────────────

  it('shows default empty message when no rows', () => {
    render(DataTable, { props: { columns, rows: [], label: 'Users' } })
    expect(screen.getByText('No data')).toBeTruthy()
  })

  it('renders custom empty slot', () => {
    render(DataTable, {
      props: { columns, rows: [], label: 'Users' },
      slots: {
        empty: () => h('p', 'Nothing to show'),
      },
    })
    expect(screen.getByText('Nothing to show')).toBeTruthy()
  })

  it('does not show empty state when loading', () => {
    render(DataTable, { props: { columns, rows: [], label: 'Users', loading: true } })
    expect(screen.queryByText('No data')).toBeNull()
  })

  // ── Loading ─────────────────────────────────────────────────────────────

  it('sets aria-busy when loading', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users', loading: true },
    })
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy()
  })

  it('does not set aria-busy when not loading', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users' },
    })
    expect(container.querySelector('[aria-busy]')).toBeNull()
  })

  it('shows loading indicator when loading', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users', loading: true },
    })
    expect(container.querySelector('.lucas-ui-data-table__loading')).toBeTruthy()
  })

  // ── Size/striped/hoverable classes ──────────────────────────────────────

  it('applies size-md class by default', () => {
    const { container } = render(DataTable, { props: { columns, rows, label: 'Users' } })
    expect(container.querySelector('.lucas-ui-data-table--size-md')).toBeTruthy()
  })

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class',
    (size) => {
      const { container } = render(DataTable, {
        props: { columns, rows, label: 'Users', size },
      })
      expect(container.querySelector(`.lucas-ui-data-table--size-${size}`)).toBeTruthy()
    },
  )

  it('applies striped class when striped is true', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users', striped: true },
    })
    expect(container.querySelector('.lucas-ui-data-table--striped')).toBeTruthy()
  })

  it('does not apply striped class by default', () => {
    const { container } = render(DataTable, { props: { columns, rows, label: 'Users' } })
    expect(container.querySelector('.lucas-ui-data-table--striped')).toBeNull()
  })

  it('applies hoverable class by default', () => {
    const { container } = render(DataTable, { props: { columns, rows, label: 'Users' } })
    expect(container.querySelector('.lucas-ui-data-table--hoverable')).toBeTruthy()
  })

  it('does not apply hoverable class when false', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users', hoverable: false },
    })
    expect(container.querySelector('.lucas-ui-data-table--hoverable')).toBeNull()
  })

  // ── Column alignment ───────────────────────────────────────────────────

  it('applies alignment classes', () => {
    const alignedColumns: DataTableColumn[] = [
      { key: 'id', align: 'right' },
      { key: 'name', align: 'center' },
      { key: 'email' },
    ]
    const { container } = render(DataTable, {
      props: { columns: alignedColumns, rows: rows.slice(0, 1), label: 'Users' },
    })
    expect(container.querySelector('.lucas-ui-data-table__cell--align-right')).toBeTruthy()
    expect(container.querySelector('.lucas-ui-data-table__cell--align-center')).toBeTruthy()
  })

  // ── Caption ─────────────────────────────────────────────────────────────

  it('renders caption when provided', () => {
    render(DataTable, { props: { columns, rows, caption: 'User list' } })
    expect(screen.getByText('User list')).toBeTruthy()
  })

  // ── Pagination ──────────────────────────────────────────────────────────

  it('renders pagination buttons in paginated mode', () => {
    render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'paginated',
        page: 1,
        pageSize: 10,
        totalRows: 50,
      },
    })
    expect(screen.getByLabelText('First page')).toBeTruthy()
    expect(screen.getByLabelText('Previous page')).toBeTruthy()
    expect(screen.getByLabelText('Next page')).toBeTruthy()
    expect(screen.getByLabelText('Last page')).toBeTruthy()
  })

  it('emits update:page when pagination button clicked', async () => {
    const { emitted } = render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'paginated',
        page: 1,
        pageSize: 10,
        totalRows: 50,
      },
    })
    await fireEvent.click(screen.getByLabelText('Next page'))
    expect(emitted()['update:page']).toBeTruthy()
    expect(emitted()['update:page'][0]).toEqual([2])
  })

  it('disables previous/first on page 1', () => {
    render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'paginated',
        page: 1,
        pageSize: 10,
        totalRows: 50,
      },
    })
    expect((screen.getByLabelText('First page') as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(true)
  })

  it('disables next/last on last page', () => {
    render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'paginated',
        page: 5,
        pageSize: 10,
        totalRows: 50,
      },
    })
    expect((screen.getByLabelText('Next page') as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByLabelText('Last page') as HTMLButtonElement).disabled).toBe(true)
  })

  it('does not render pagination in none mode', () => {
    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users', paginationMode: 'none' },
    })
    expect(container.querySelector('.lucas-ui-data-table__pagination')).toBeNull()
  })

  // ── Infinite scroll ─────────────────────────────────────────────────────

  it('renders sentinel when infinite mode with hasMore', () => {
    const { container } = render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'infinite',
        hasMore: true,
      },
    })
    expect(container.querySelector('.lucas-ui-data-table__sentinel')).toBeTruthy()
  })

  it('does not render sentinel when hasMore is false', () => {
    const { container } = render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'infinite',
        hasMore: false,
      },
    })
    expect(container.querySelector('.lucas-ui-data-table__sentinel')).toBeNull()
  })

  it('emits load-more when IntersectionObserver triggers', async () => {
    let observerCallback: IntersectionObserverCallback | null = null
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback
        }
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      },
    )

    const { emitted } = render(DataTable, {
      props: {
        columns,
        rows,
        label: 'Users',
        paginationMode: 'infinite',
        hasMore: true,
      },
    })

    await nextTick()
    await nextTick()

    // Trigger the observer callback
    if (observerCallback) {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    }

    expect(emitted()['load-more']).toBeTruthy()
    vi.unstubAllGlobals()
  })

  // ── Card mode ───────────────────────────────────────────────────────────

  it('applies card mode class and list role when ResizeObserver fires below breakpoint', async () => {
    let observerCallback: ResizeObserverCallback | null = null
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()

    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          observerCallback = callback
        }
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      },
    )

    const { container } = render(DataTable, {
      props: { columns, rows, label: 'Users', cardBreakpoint: 640 },
    })

    // Simulate resize below breakpoint
    if (observerCallback) {
      observerCallback(
        [{ contentRect: { width: 400 } } as unknown as ResizeObserverEntry],
        {} as ResizeObserver,
      )
    }
    await nextTick()

    expect(container.querySelector('.lucas-ui-data-table--card')).toBeTruthy()
    expect(container.querySelector('[role="list"]')).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    vi.unstubAllGlobals()
  })

  it('hides columns with visibleInCard=false in card mode', async () => {
    let observerCallback: ResizeObserverCallback | null = null

    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          observerCallback = callback
        }
        observe = vi.fn()
        disconnect = vi.fn()
        unobserve = vi.fn()
      },
    )

    const colsWithHidden: DataTableColumn[] = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'internal', label: 'Internal', visibleInCard: false },
    ]
    const rowsWithHidden = [{ id: 1, name: 'Alice', internal: 'secret' }]

    const { container } = render(DataTable, {
      props: {
        columns: colsWithHidden,
        rows: rowsWithHidden,
        label: 'Users',
        cardBreakpoint: 640,
      },
    })

    if (observerCallback) {
      observerCallback(
        [{ contentRect: { width: 400 } } as unknown as ResizeObserverEntry],
        {} as ResizeObserver,
      )
    }
    await nextTick()

    const labels = container.querySelectorAll('.lucas-ui-data-table__card-label')
    const labelTexts = Array.from(labels).map((l) => l.textContent)
    expect(labelTexts).toContain('ID')
    expect(labelTexts).toContain('Name')
    expect(labelTexts).not.toContain('Internal')

    vi.unstubAllGlobals()
  })

  // ── Dev warning ─────────────────────────────────────────────────────────

  describe('accessibility warning', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('warns when no label, caption, or aria-label', async () => {
      render(DataTable, { props: { columns, rows } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Missing accessible name'),
      )
    })

    it('does not warn when label is provided', async () => {
      render(DataTable, { props: { columns, rows, label: 'Users' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })

    it('does not warn when caption is provided', async () => {
      render(DataTable, { props: { columns, rows, caption: 'Users' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
