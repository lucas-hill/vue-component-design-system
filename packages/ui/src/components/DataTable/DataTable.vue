<script setup lang="ts">
import { computed, ref, toRef, useAttrs, onMounted } from 'vue'
import type { Size, DataTableColumn } from '../../types'
import { useDataTable } from '../../composables/useDataTable'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay.vue'
import DataTablePagination from '../_internal/DataTablePagination.vue'

export interface DataTableProps {
  columns: DataTableColumn[]
  rows: Record<string, unknown>[]
  /** Property on each row used for :key. Defaults to 'id'. */
  rowKey?: string
  /** Pagination mode. Defaults to 'none'. */
  paginationMode?: 'none' | 'paginated' | 'infinite'
  /** Current page (1-indexed). Used with paginationMode='paginated'. */
  page?: number
  /** Rows per page. Defaults to 20. */
  pageSize?: number
  /** Total number of rows across all pages. Required for paginated mode. */
  totalRows?: number
  /** Whether more rows can be loaded. Used with paginationMode='infinite'. */
  hasMore?: boolean
  /** Whether data is currently loading. */
  loading?: boolean
  /** CSS height for the scroll container (e.g. '400px'). Enables internal scrolling. */
  height?: string
  /** Viewport width (px) below which table switches to card mode. Defaults to 640. */
  cardBreakpoint?: number
  /** Estimated row height in px for virtualization. Defaults to 48. */
  estimatedRowHeight?: number
  /** Minimum row count to activate virtualization. Defaults to 100. */
  virtualThreshold?: number
  /** Visual size. Defaults to 'md'. */
  size?: Size
  /** Alternate row background colors. Defaults to false. */
  striped?: boolean
  /** Highlight rows on hover. Defaults to true. */
  hoverable?: boolean
  /** Visible caption above the table. */
  caption?: string
  /** Accessible label (falls back to caption). */
  label?: string
}

const props = withDefaults(defineProps<DataTableProps>(), {
  rowKey: 'id',
  paginationMode: 'none',
  page: 1,
  pageSize: 20,
  totalRows: 0,
  hasMore: false,
  loading: false,
  cardBreakpoint: 640,
  estimatedRowHeight: 48,
  virtualThreshold: 100,
  size: 'md',
  striped: false,
  hoverable: true,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'load-more': []
}>()

const attrs = useAttrs()

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

const {
  isCardMode,
  shouldVirtualize,
  startIndex,
  endIndex,
  topSpacerHeight,
  bottomSpacerHeight,
  onScroll,
} = useDataTable({
  rootRef,
  scrollRef,
  sentinelRef,
  cardBreakpoint: toRef(() => props.cardBreakpoint),
  rowCount: toRef(() => props.rows.length),
  estimatedRowHeight: toRef(() => props.estimatedRowHeight),
  virtualThreshold: toRef(() => props.virtualThreshold),
  height: toRef(() => props.height),
  hasMore: toRef(() => props.hasMore),
  onLoadMore: () => emit('load-more'),
})

const accessibleLabel = computed(
  () => props.label || props.caption || (attrs['aria-label'] as string) || undefined,
)

const gridTemplateColumns = computed(() =>
  props.columns.map((col) => col.width || '1fr').join(' '),
)

const visibleRows = computed(() => {
  if (isCardMode.value || !shouldVirtualize.value) return props.rows
  return props.rows.slice(startIndex.value, endIndex.value)
})

const visibleStartIndex = computed(() => {
  if (isCardMode.value || !shouldVirtualize.value) return 0
  return startIndex.value
})

const cardColumns = computed(() =>
  props.columns.filter((col) => col.visibleInCard !== false),
)

const totalPages = computed(() =>
  props.pageSize > 0 ? Math.ceil(props.totalRows / props.pageSize) : 1,
)

const rootClasses = computed(() => [
  'lucas-ui-data-table',
  `lucas-ui-data-table--size-${props.size}`,
  {
    'lucas-ui-data-table--card': isCardMode.value,
    'lucas-ui-data-table--striped': props.striped,
    'lucas-ui-data-table--hoverable': props.hoverable,
  },
])

function getRowKey(row: Record<string, unknown>, index: number): string | number {
  const key = row[props.rowKey]
  if (key != null) return String(key)
  return index
}

function onPageUpdate(page: number) {
  emit('update:page', page)
}

if (import.meta.env.DEV) {
  onMounted(() => {
    if (!props.label && !props.caption && !attrs['aria-label']) {
      console.warn(
        '[DataTable] Missing accessible name. Provide a `label`, `caption`, or `aria-label` prop.',
      )
    }
  })
}
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClasses"
    :role="isCardMode ? 'list' : 'table'"
    :aria-label="accessibleLabel"
    :aria-busy="loading || undefined"
  >
    <!-- Caption -->
    <div v-if="caption" class="lucas-ui-data-table__caption">{{ caption }}</div>

    <!-- Scroll container -->
    <div
      ref="scrollRef"
      class="lucas-ui-data-table__scroll"
      :style="height ? { height, overflow: 'auto' } : undefined"
      @scroll="onScroll"
    >
      <!-- ═══ TABLE MODE ═══ -->
      <template v-if="!isCardMode">
        <div
          class="lucas-ui-data-table__grid"
          :style="{ 'grid-template-columns': gridTemplateColumns }"
        >
          <!-- Header -->
          <div class="lucas-ui-data-table__header" role="rowgroup">
            <div class="lucas-ui-data-table__header-row" role="row">
              <div
                v-for="column in columns"
                :key="column.key"
                class="lucas-ui-data-table__header-cell"
                :class="column.align ? `lucas-ui-data-table__cell--align-${column.align}` : ''"
                role="columnheader"
              >
                <slot :name="`header-${column.key}`" :column="column">
                  <slot name="header" :column="column">
                    {{ column.label || column.key }}
                  </slot>
                </slot>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div
            class="lucas-ui-data-table__body"
            role="rowgroup"
          >
            <!-- Top spacer (virtualization) -->
            <div
              v-if="shouldVirtualize && topSpacerHeight > 0"
              class="lucas-ui-data-table__spacer"
              :style="{ height: `${topSpacerHeight}px` }"
            />

            <!-- Rows -->
            <div
              v-for="(row, i) in visibleRows"
              :key="getRowKey(row, visibleStartIndex + i)"
              class="lucas-ui-data-table__row"
              role="row"
            >
              <div
                v-for="column in columns"
                :key="column.key"
                class="lucas-ui-data-table__cell"
                :class="column.align ? `lucas-ui-data-table__cell--align-${column.align}` : ''"
                role="cell"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :column="column"
                  :value="row[column.key]"
                  :row-index="visibleStartIndex + i"
                >
                  <slot
                    name="cell"
                    :row="row"
                    :column="column"
                    :value="row[column.key]"
                    :row-index="visibleStartIndex + i"
                  >
                    {{ row[column.key] }}
                  </slot>
                </slot>
              </div>
            </div>

            <!-- Bottom spacer (virtualization) -->
            <div
              v-if="shouldVirtualize && bottomSpacerHeight > 0"
              class="lucas-ui-data-table__spacer"
              :style="{ height: `${bottomSpacerHeight}px` }"
            />
          </div>

          <!-- Empty state -->
          <div v-if="rows.length === 0 && !loading" class="lucas-ui-data-table__empty">
            <slot name="empty">No data</slot>
          </div>
        </div>
      </template>

      <!-- ═══ CARD MODE ═══ -->
      <template v-else>
        <div
          v-for="(row, i) in visibleRows"
          :key="getRowKey(row, i)"
          class="lucas-ui-data-table__card"
          role="listitem"
        >
          <div
            v-for="column in cardColumns"
            :key="column.key"
            class="lucas-ui-data-table__card-field"
          >
            <span class="lucas-ui-data-table__card-label">
              {{ column.label || column.key }}
            </span>
            <span class="lucas-ui-data-table__card-value">
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="row[column.key]"
                :row-index="i"
              >
                <slot
                  name="cell"
                  :row="row"
                  :column="column"
                  :value="row[column.key]"
                  :row-index="i"
                >
                  {{ row[column.key] }}
                </slot>
              </slot>
            </span>
          </div>
        </div>

        <!-- Empty state (card mode) -->
        <div v-if="rows.length === 0 && !loading" class="lucas-ui-data-table__empty">
          <slot name="empty">No data</slot>
        </div>
      </template>

      <!-- Sentinel for infinite scroll -->
      <div
        v-if="paginationMode === 'infinite' && hasMore"
        ref="sentinelRef"
        class="lucas-ui-data-table__sentinel"
      />

      <!-- Loading indicator -->
      <div v-if="loading" class="lucas-ui-data-table__loading">
        <slot name="loading">
          <LoadingOverlay size="lg" label="Loading data" />
        </slot>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="paginationMode === 'paginated'" class="lucas-ui-data-table__pagination">
      <slot name="pagination" :page="page" :total-pages="totalPages" :go-to-page="onPageUpdate">
        <DataTablePagination
          :page="page"
          :total-pages="totalPages"
          :disabled="loading"
          @update:page="onPageUpdate"
        />
      </slot>
    </div>
  </div>
</template>

<style>
/* ── Base ──────────────────────────────────────────────────────────────────── */

.lucas-ui-data-table {
  --_dt-font-size: var(--lucas-ui-font-size-md);
  --_dt-cell-py: var(--lucas-ui-data-table-cell-padding-y);
  --_dt-cell-px: var(--lucas-ui-data-table-cell-padding-x);
  font-family: inherit;
  font-size: var(--_dt-font-size);
  color: var(--lucas-ui-color-text);
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
  border-radius: var(--lucas-ui-radius-md);
  overflow: hidden;
}

/* ── Size modifiers ────────────────────────────────────────────────────────── */

.lucas-ui-data-table--size-xs {
  --_dt-font-size: var(--lucas-ui-font-size-xs);
  --_dt-cell-py: var(--lucas-ui-space-1);
  --_dt-cell-px: var(--lucas-ui-space-2);
}

.lucas-ui-data-table--size-sm {
  --_dt-font-size: var(--lucas-ui-font-size-sm);
  --_dt-cell-py: var(--lucas-ui-space-2);
  --_dt-cell-px: var(--lucas-ui-space-3);
}

.lucas-ui-data-table--size-md {
  --_dt-font-size: var(--lucas-ui-font-size-md);
  --_dt-cell-py: var(--lucas-ui-data-table-cell-padding-y);
  --_dt-cell-px: var(--lucas-ui-data-table-cell-padding-x);
}

.lucas-ui-data-table--size-lg {
  --_dt-font-size: var(--lucas-ui-font-size-md);
  --_dt-cell-py: var(--lucas-ui-space-4);
  --_dt-cell-px: var(--lucas-ui-space-5);
}

.lucas-ui-data-table--size-xl {
  --_dt-font-size: var(--lucas-ui-font-size-lg);
  --_dt-cell-py: var(--lucas-ui-space-5);
  --_dt-cell-px: var(--lucas-ui-space-6);
}

/* ── Caption ───────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__caption {
  padding: var(--_dt-cell-py) var(--_dt-cell-px);
  font-weight: var(--lucas-ui-data-table-header-font-weight);
  color: var(--lucas-ui-data-table-header-color);
  border-bottom: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
}

/* ── Scroll container ──────────────────────────────────────────────────────── */

.lucas-ui-data-table__scroll {
  position: relative;
}

/* ── Grid layout ───────────────────────────────────────────────────────────── */

.lucas-ui-data-table__grid {
  display: grid;
  min-width: 100%;
}

/* ── Header ────────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__header {
  display: contents;
}

.lucas-ui-data-table__header-row {
  display: contents;
}

.lucas-ui-data-table__header-cell {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: var(--_dt-cell-py) var(--_dt-cell-px);
  background: var(--lucas-ui-data-table-header-bg);
  color: var(--lucas-ui-data-table-header-color);
  font-weight: var(--lucas-ui-data-table-header-font-weight);
  text-align: left;
  border-bottom: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
}

/* ── Body ──────────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__body {
  display: contents;
}

.lucas-ui-data-table__row {
  display: contents;
}

.lucas-ui-data-table__cell {
  padding: var(--_dt-cell-py) var(--_dt-cell-px);
  background: var(--lucas-ui-data-table-row-bg);
  border-bottom: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
}

/* ── Alignment ─────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__cell--align-center {
  text-align: center;
}

.lucas-ui-data-table__cell--align-right {
  text-align: right;
}

/* ── Striped ───────────────────────────────────────────────────────────────── */

.lucas-ui-data-table--striped .lucas-ui-data-table__row:nth-child(even) .lucas-ui-data-table__cell {
  background: var(--lucas-ui-data-table-row-bg-striped);
}

/* ── Hoverable ─────────────────────────────────────────────────────────────── */

.lucas-ui-data-table--hoverable .lucas-ui-data-table__row:hover .lucas-ui-data-table__cell {
  background: var(--lucas-ui-data-table-row-bg-hover);
}

/* ── Spacer (virtualization) ───────────────────────────────────────────────── */

.lucas-ui-data-table__spacer {
  grid-column: 1 / -1;
}

/* ── Empty state ───────────────────────────────────────────────────────────── */

.lucas-ui-data-table__empty {
  grid-column: 1 / -1;
  padding: var(--lucas-ui-space-6) var(--_dt-cell-px);
  text-align: center;
  color: var(--lucas-ui-data-table-empty-color);
}

/* ── Loading ───────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__loading {
  position: relative;
  grid-column: 1 / -1;
  min-height: 48px;
}

/* ── Sentinel ──────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__sentinel {
  height: 1px;
  grid-column: 1 / -1;
}

/* ── Pagination ────────────────────────────────────────────────────────────── */

.lucas-ui-data-table__pagination {
  border-top: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARD MODE
   ═══════════════════════════════════════════════════════════════════════════ */

.lucas-ui-data-table--card {
  border: none;
}

.lucas-ui-data-table--card .lucas-ui-data-table__scroll {
  display: flex;
  flex-direction: column;
  gap: var(--lucas-ui-data-table-card-gap);
}

.lucas-ui-data-table__card {
  border: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
  border-radius: var(--lucas-ui-data-table-card-border-radius);
  padding: var(--lucas-ui-data-table-card-padding);
  background: var(--lucas-ui-data-table-row-bg);
  box-shadow: var(--lucas-ui-data-table-card-shadow);
}

.lucas-ui-data-table__card-field {
  display: flex;
  justify-content: space-between;
  padding: var(--lucas-ui-space-1) 0;
}

.lucas-ui-data-table__card-field + .lucas-ui-data-table__card-field {
  border-top: var(--lucas-ui-border-width) solid var(--lucas-ui-data-table-border-color);
}

.lucas-ui-data-table__card-label {
  font-weight: var(--lucas-ui-data-table-header-font-weight);
  color: var(--lucas-ui-data-table-header-color);
  flex-shrink: 0;
  margin-right: var(--lucas-ui-space-3);
}

.lucas-ui-data-table__card-value {
  text-align: right;
}

/* Card mode empty */
.lucas-ui-data-table--card .lucas-ui-data-table__empty {
  padding: var(--lucas-ui-space-6);
  text-align: center;
  color: var(--lucas-ui-data-table-empty-color);
}

/* Card mode loading */
.lucas-ui-data-table--card .lucas-ui-data-table__loading {
  position: relative;
  min-height: 48px;
}

/* Card mode pagination */
.lucas-ui-data-table--card .lucas-ui-data-table__pagination {
  border-top: none;
  padding-top: var(--lucas-ui-space-2);
}
</style>
