import { ref, computed, watch, type Ref } from 'vue'
import { useDebounce } from './useDebounce'
import type { SearchOption } from '../types'

export interface UseSearchOptions {
  options: Ref<SearchOption[] | undefined>
  onSearch: Ref<((query: string) => Promise<SearchOption[]>) | undefined>
  debounce: Ref<number>
  minChars: Ref<number>
  openOnFocus: Ref<boolean>
  noCache: Ref<boolean>
  modelValue: Ref<string | number | null | undefined>
  onSelect: (option: SearchOption) => void
  onClear: () => void
}

export function useSearch({
  options,
  onSearch,
  debounce,
  minChars,
  openOnFocus,
  noCache,
  modelValue,
  onSelect,
  onClear,
}: UseSearchOptions) {
  const isOpen = ref(false)
  const query = ref('')
  const activeIndex = ref(-1)
  const asyncResults = ref<SearchOption[]>([])
  const isLoading = ref(false)
  const suppressOpen = ref(false)
  const cache = new Map<string, SearchOption[]>()

  const isAsync = computed(() => !!onSearch.value && !options.value)

  // Local mode: filter and rank
  const localResults = computed(() => {
    if (!options.value) return []
    const q = query.value.toLowerCase().trim()
    if (!q) return options.value.filter((o) => !o.disabled)

    const scored: { option: SearchOption; score: number; index: number }[] = []
    options.value.forEach((option, index) => {
      const label = (option.label ?? String(option.value)).toLowerCase()
      let score = 0
      if (label === q) score = 3
      else if (label.startsWith(q)) score = 2
      else if (label.includes(q)) score = 1

      if (score > 0) scored.push({ option, score, index })
    })

    scored.sort((a, b) => b.score - a.score || a.index - b.index)
    return scored.map((s) => s.option)
  })

  const results = computed(() => (isAsync.value ? asyncResults.value : localResults.value))

  const meetsMinChars = computed(() => query.value.trim().length >= minChars.value)

  // Async fetching
  async function fetchResults(q: string) {
    if (!onSearch.value) return

    if (!noCache.value && cache.has(q)) {
      asyncResults.value = cache.get(q)!
      return
    }

    isLoading.value = true
    try {
      const res = await onSearch.value(q)
      if (!noCache.value) cache.set(q, res)
      asyncResults.value = res
    } catch {
      asyncResults.value = []
    } finally {
      isLoading.value = false
    }
  }

  const { debounced: debouncedFetch, cancel: cancelFetch } = useDebounce(
    (q: string) => fetchResults(q),
    debounce,
  )

  // Watch query changes
  watch(query, (q) => {
    const trimmed = q.trim()
    activeIndex.value = -1

    if (!meetsMinChars.value) {
      if (isAsync.value) {
        asyncResults.value = []
        cancelFetch()
      }
      return
    }

    if (isAsync.value) {
      debouncedFetch(trimmed)
    }

    if (!isOpen.value && trimmed && !suppressOpen.value) {
      isOpen.value = true
    }
    suppressOpen.value = false
  })

  function getOptionLabel(option: SearchOption): string {
    return option.label ?? String(option.value)
  }

  function findOptionByValue(value: string | number | null | undefined): SearchOption | undefined {
    if (value == null) return undefined
    const pool = options.value ?? asyncResults.value
    return pool.find((o) => o.value === value)
  }

  // Sync query text with modelValue
  watch(
    modelValue,
    (val) => {
      if (val == null) {
        query.value = ''
        return
      }
      const opt = findOptionByValue(val)
      if (opt) query.value = getOptionLabel(opt)
    },
    { immediate: true },
  )

  function open() {
    isOpen.value = true
    activeIndex.value = -1

    if (isAsync.value && meetsMinChars.value && query.value.trim()) {
      debouncedFetch(query.value.trim())
    }
  }

  function close() {
    isOpen.value = false
    activeIndex.value = -1
    cancelFetch()

    // Restore input to selected label (suppress watcher from re-opening)
    suppressOpen.value = true
    const opt = findOptionByValue(modelValue.value)
    if (opt) {
      query.value = getOptionLabel(opt)
    } else if (modelValue.value == null) {
      query.value = ''
    }
  }

  function selectOption(option: SearchOption) {
    if (option.disabled) return
    suppressOpen.value = true
    onSelect(option)
    isOpen.value = false
    activeIndex.value = -1
  }

  function clear() {
    query.value = ''
    asyncResults.value = []
    onClear()
  }

  function onFocus() {
    if (openOnFocus.value && !isOpen.value) {
      open()
    }
  }

  function onKeydown(event: KeyboardEvent) {
    const count = results.value.length

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen.value) {
          open()
          activeIndex.value = count > 0 ? 0 : -1
        } else {
          activeIndex.value = count > 0 ? (activeIndex.value + 1) % count : -1
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        if (isOpen.value && count > 0) {
          activeIndex.value = activeIndex.value <= 0 ? count - 1 : activeIndex.value - 1
        }
        break

      case 'Home':
        if (isOpen.value) {
          event.preventDefault()
          activeIndex.value = 0
        }
        break

      case 'End':
        if (isOpen.value) {
          event.preventDefault()
          activeIndex.value = count - 1
        }
        break

      case 'Enter':
        if (isOpen.value && activeIndex.value >= 0 && activeIndex.value < count) {
          event.preventDefault()
          selectOption(results.value[activeIndex.value])
        }
        break

      case 'Escape':
        if (isOpen.value) {
          event.preventDefault()
          close()
        }
        break

      case 'Tab':
        if (isOpen.value) {
          close()
        }
        break
    }
  }

  return {
    isOpen,
    query,
    activeIndex,
    results,
    isLoading,
    isAsync,
    meetsMinChars,
    getOptionLabel,
    open,
    close,
    selectOption,
    clear,
    onFocus,
    onKeydown,
  }
}
