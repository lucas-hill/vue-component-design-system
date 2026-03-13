import { ref, computed, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface UseDataTableOptions {
  rootRef: Ref<HTMLElement | null>
  scrollRef: Ref<HTMLElement | null>
  sentinelRef: Ref<HTMLElement | null>
  cardBreakpoint: Ref<number>
  rowCount: Ref<number>
  estimatedRowHeight: Ref<number>
  virtualThreshold: Ref<number>
  height: Ref<string | undefined>
  hasMore: Ref<boolean>
  onLoadMore: () => void
}

export function useDataTable(options: UseDataTableOptions) {
  const {
    rootRef,
    scrollRef,
    sentinelRef,
    cardBreakpoint,
    rowCount,
    estimatedRowHeight,
    virtualThreshold,
    height,
    hasMore,
    onLoadMore,
  } = options

  // ── Breakpoint detection ──────────────────────────────────────────────────

  const isCardMode = ref(false)
  let resizeObserver: ResizeObserver | null = null

  function setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined' || !rootRef.value) return
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        isCardMode.value = entry.contentRect.width < cardBreakpoint.value
      }
    })
    resizeObserver.observe(rootRef.value)
  }

  function teardownResizeObserver() {
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  // ── Virtualization ────────────────────────────────────────────────────────

  const scrollTop = ref(0)
  const containerHeight = ref(0)
  const overscan = 5

  const shouldVirtualize = computed(
    () => !!height.value && rowCount.value > virtualThreshold.value,
  )

  const totalHeight = computed(
    () => rowCount.value * estimatedRowHeight.value,
  )

  const startIndex = computed(() => {
    if (!shouldVirtualize.value) return 0
    return Math.max(0, Math.floor(scrollTop.value / estimatedRowHeight.value) - overscan)
  })

  const endIndex = computed(() => {
    if (!shouldVirtualize.value) return rowCount.value
    const visibleEnd = Math.ceil(
      (scrollTop.value + containerHeight.value) / estimatedRowHeight.value,
    )
    return Math.min(rowCount.value, visibleEnd + overscan)
  })

  const topSpacerHeight = computed(
    () => startIndex.value * estimatedRowHeight.value,
  )

  const bottomSpacerHeight = computed(() => {
    if (!shouldVirtualize.value) return 0
    return Math.max(0, (rowCount.value - endIndex.value) * estimatedRowHeight.value)
  })

  function onScroll() {
    if (!scrollRef.value) return
    scrollTop.value = scrollRef.value.scrollTop
    containerHeight.value = scrollRef.value.clientHeight
  }

  // ── Infinite scroll ───────────────────────────────────────────────────────

  let intersectionObserver: IntersectionObserver | null = null

  function setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return
    teardownIntersectionObserver()
    if (!sentinelRef.value) return

    const root = height.value && scrollRef.value ? scrollRef.value : null
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onLoadMore()
          }
        }
      },
      { root, rootMargin: '100px' },
    )
    intersectionObserver.observe(sentinelRef.value)
  }

  function teardownIntersectionObserver() {
    intersectionObserver?.disconnect()
    intersectionObserver = null
  }

  // Watch sentinel changes to re-observe
  watch(
    [sentinelRef, hasMore],
    () => {
      if (sentinelRef.value && hasMore.value) {
        setupIntersectionObserver()
      } else {
        teardownIntersectionObserver()
      }
    },
    { flush: 'post' },
  )

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  onMounted(() => {
    setupResizeObserver()
    if (scrollRef.value) {
      containerHeight.value = scrollRef.value.clientHeight
    }
  })

  onBeforeUnmount(() => {
    teardownResizeObserver()
    teardownIntersectionObserver()
  })

  return {
    isCardMode,
    shouldVirtualize,
    startIndex,
    endIndex,
    topSpacerHeight,
    bottomSpacerHeight,
    totalHeight,
    onScroll,
  }
}
