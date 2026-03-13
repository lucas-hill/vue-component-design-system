import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h } from 'vue'
import { DataTable } from '.'
import type { DataTableProps } from '.'
import type { DataTableColumn } from '../../types'
import { Button } from '../Button'
import { Icon } from '../Icon'

const sampleColumns: DataTableColumn[] = [
  { key: 'id', label: 'ID', width: '80px', align: 'right' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', width: '120px' },
  { key: 'status', label: 'Status', width: '100px', align: 'center' },
]

function generateRows(count: number) {
  const roles = ['Admin', 'Editor', 'Viewer', 'Manager', 'Developer']
  const statuses = ['Active', 'Inactive', 'Pending']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
  }))
}

const sampleRows = generateRows(10)

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    paginationMode: {
      control: 'select',
      options: ['none', 'paginated', 'infinite'],
    },
  },
}

export default meta
type Story = StoryObj<typeof DataTable>

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    label: 'Users',
    striped: false,
    hoverable: true,
    size: 'md',
  },
  render: (args: DataTableProps) => ({
    components: { DataTable },
    setup() { return { args } },
    template: `<DataTable v-bind="args" />`,
  }),
}

// ── Custom cells ─────────────────────────────────────────────────────────────

export const CustomCells: Story = {
  render: () => ({
    components: { DataTable, Button, Icon },
    setup() {
      const columns: DataTableColumn[] = [
        { key: 'id', label: 'ID', width: '60px' },
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status', width: '120px', align: 'center' },
        { key: 'actions', label: 'Actions', width: '100px', align: 'center' },
      ]
      const rows = [
        { id: 1, name: 'Alice Johnson', status: 'Active' },
        { id: 2, name: 'Bob Smith', status: 'Inactive' },
        { id: 3, name: 'Charlie Lee', status: 'Pending' },
      ]
      return { columns, rows }
    },
    template: `
      <DataTable :columns="columns" :rows="rows" label="Users with custom cells">
        <template #cell-status="{ value }">
          <span :style="{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: value === 'Active' ? '#dcfce7' : value === 'Inactive' ? '#fee2e2' : '#fef9c3',
            color: value === 'Active' ? '#166534' : value === 'Inactive' ? '#991b1b' : '#854d0e',
          }">{{ value }}</span>
        </template>
        <template #cell-actions="{ row }">
          <Button size="xs" variant="ghost" color="danger" icon="trash" aria-label="Delete" />
        </template>
      </DataTable>
    `,
  }),
}

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const cols: DataTableColumn[] = [
        { key: 'id', label: 'ID', width: '60px' },
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
      ]
      const data = [
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'Editor' },
      ]
      return { cols, data, sizes: ['xs', 'sm', 'md', 'lg', 'xl'] }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div v-for="size in sizes" :key="size">
          <p style="margin-bottom: 8px; font-weight: 600;">Size: {{ size }}</p>
          <DataTable :columns="cols" :rows="data" :size="size" :label="'Size ' + size" />
        </div>
      </div>
    `,
  }),
}

// ── Striped ──────────────────────────────────────────────────────────────────

export const Striped: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { columns: sampleColumns, rows: generateRows(8) }
    },
    template: `<DataTable :columns="columns" :rows="rows" striped label="Striped table" />`,
  }),
}

// ── Empty ────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { columns: sampleColumns }
    },
    template: `<DataTable :columns="columns" :rows="[]" label="Empty table" />`,
  }),
}

// ── Empty with custom slot ───────────────────────────────────────────────────

export const EmptyCustom: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { columns: sampleColumns }
    },
    template: `
      <DataTable :columns="columns" :rows="[]" label="Empty table">
        <template #empty>
          <div style="padding: 24px; text-align: center;">
            <p style="font-size: 1.25rem; margin-bottom: 8px;">🔍 No results found</p>
            <p style="color: #6b7280;">Try adjusting your search criteria.</p>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

// ── Loading ──────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { columns: sampleColumns }
    },
    template: `<DataTable :columns="columns" :rows="[]" loading label="Loading table" />`,
  }),
}

// ── Paginated ────────────────────────────────────────────────────────────────

export const Paginated: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const allRows = generateRows(95)
      const pageSize = 10
      const page = ref(1)
      const totalRows = allRows.length

      const visibleRows = ref(allRows.slice(0, pageSize))

      function onPageUpdate(newPage: number) {
        page.value = newPage
        const start = (newPage - 1) * pageSize
        visibleRows.value = allRows.slice(start, start + pageSize)
      }

      return { columns: sampleColumns, visibleRows, page, totalRows, pageSize, onPageUpdate }
    },
    template: `
      <DataTable
        :columns="columns"
        :rows="visibleRows"
        pagination-mode="paginated"
        :page="page"
        :page-size="pageSize"
        :total-rows="totalRows"
        label="Paginated users"
        @update:page="onPageUpdate"
      />
    `,
  }),
}

// ── Infinite scroll ──────────────────────────────────────────────────────────

export const InfiniteScroll: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const allRows = generateRows(200)
      const rows = ref(allRows.slice(0, 20))
      const loading = ref(false)
      const hasMore = ref(true)

      function onLoadMore() {
        if (loading.value) return
        loading.value = true
        setTimeout(() => {
          const next = allRows.slice(rows.value.length, rows.value.length + 20)
          rows.value = [...rows.value, ...next]
          hasMore.value = rows.value.length < allRows.length
          loading.value = false
        }, 800)
      }

      return { columns: sampleColumns, rows, loading, hasMore, onLoadMore }
    },
    template: `
      <DataTable
        :columns="columns"
        :rows="rows"
        pagination-mode="infinite"
        :has-more="hasMore"
        :loading="loading"
        height="400px"
        label="Infinite scroll users"
        @load-more="onLoadMore"
      />
    `,
  }),
}

// ── Card mode (forced) ───────────────────────────────────────────────────────

export const CardMode: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { columns: sampleColumns, rows: sampleRows }
    },
    template: `
      <div style="max-width: 500px;">
        <DataTable :columns="columns" :rows="rows" :card-breakpoint="9999" label="Card mode" />
      </div>
    `,
  }),
}

// ── Large dataset (virtualization) ───────────────────────────────────────────

export const LargeDataset: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return {
        columns: sampleColumns,
        rows: generateRows(10000),
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :rows="rows"
        height="400px"
        :virtual-threshold="100"
        :estimated-row-height="48"
        label="10,000 rows"
        striped
      />
    `,
  }),
}

// ── Column alignment ─────────────────────────────────────────────────────────

export const ColumnAlignment: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const columns: DataTableColumn[] = [
        { key: 'id', label: 'ID', width: '80px', align: 'right' },
        { key: 'product', label: 'Product', align: 'left' },
        { key: 'quantity', label: 'Qty', width: '80px', align: 'center' },
        { key: 'price', label: 'Price', width: '100px', align: 'right' },
      ]
      const rows = [
        { id: 1, product: 'Widget A', quantity: 42, price: '$9.99' },
        { id: 2, product: 'Gadget B', quantity: 7, price: '$24.99' },
        { id: 3, product: 'Doohickey C', quantity: 128, price: '$3.50' },
      ]
      return { columns, rows }
    },
    template: `<DataTable :columns="columns" :rows="rows" label="Aligned columns" />`,
  }),
}

// ── Custom headers ───────────────────────────────────────────────────────────

export const CustomHeaders: Story = {
  render: () => ({
    components: { DataTable, Icon },
    setup() {
      return { columns: sampleColumns, rows: sampleRows }
    },
    template: `
      <DataTable :columns="columns" :rows="rows" label="Custom headers">
        <template #header-name="{ column }">
          <span style="display: inline-flex; align-items: center; gap: 4px;">
            <Icon name="home" size="sm" /> {{ column.label }}
          </span>
        </template>
      </DataTable>
    `,
  }),
}
