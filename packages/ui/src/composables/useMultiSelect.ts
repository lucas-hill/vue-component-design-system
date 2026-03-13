import { ref, computed, type Ref } from 'vue'
import type { SelectOption } from '../types'

export interface UseMultiSelectOptions {
  modelValue: Ref<(string | number)[]>
  options: Ref<SelectOption[]>
  searchable: Ref<boolean>
  max: Ref<number | undefined>
  onUpdate: (value: (string | number)[]) => void
}

export function useMultiSelect({
  modelValue,
  options,
  searchable,
  max,
  onUpdate,
}: UseMultiSelectOptions) {
  const isOpen = ref(false)
  const searchQuery = ref('')
  const activeIndex = ref(-1)

  const filteredOptions = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return options.value
    return options.value.filter((opt) => {
      const label = (opt.label ?? String(opt.value)).toLowerCase()
      return label.includes(query)
    })
  })

  const maxReached = computed(() => {
    if (max.value == null) return false
    return modelValue.value.length >= max.value
  })

  function isSelected(value: string | number): boolean {
    return modelValue.value.includes(value)
  }

  function isOptionDisabled(option: SelectOption): boolean {
    if (option.disabled) return true
    if (maxReached.value && !isSelected(option.value)) return true
    return false
  }

  function toggleOption(option: SelectOption) {
    if (option.disabled) return
    if (isSelected(option.value)) {
      onUpdate(modelValue.value.filter((v) => v !== option.value))
    } else {
      if (maxReached.value) return
      onUpdate([...modelValue.value, option.value])
    }
    searchQuery.value = ''
  }

  function removeValue(value: string | number) {
    onUpdate(modelValue.value.filter((v) => v !== value))
  }

  function clearAll() {
    onUpdate([])
    searchQuery.value = ''
  }

  function open() {
    isOpen.value = true
    activeIndex.value = -1
  }

  function close() {
    isOpen.value = false
    searchQuery.value = ''
    activeIndex.value = -1
  }

  function toggle() {
    if (isOpen.value) close()
    else open()
  }

  function onKeydown(event: KeyboardEvent) {
    const count = filteredOptions.value.length

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen.value) {
          open()
          activeIndex.value = 0
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
          const option = filteredOptions.value[activeIndex.value]
          if (!isOptionDisabled(option)) {
            toggleOption(option)
          }
        }
        break

      case ' ':
        if (isOpen.value && !searchQuery.value) {
          event.preventDefault()
          if (activeIndex.value >= 0 && activeIndex.value < count) {
            const option = filteredOptions.value[activeIndex.value]
            if (!isOptionDisabled(option)) {
              toggleOption(option)
            }
          }
        }
        break

      case 'Escape':
        if (isOpen.value) {
          event.preventDefault()
          close()
        }
        break

      case 'Backspace':
        if (!searchQuery.value && modelValue.value.length > 0) {
          removeValue(modelValue.value[modelValue.value.length - 1])
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
    searchQuery,
    activeIndex,
    filteredOptions,
    maxReached,
    isSelected,
    isOptionDisabled,
    toggleOption,
    removeValue,
    clearAll,
    open,
    close,
    toggle,
    onKeydown,
  }
}
