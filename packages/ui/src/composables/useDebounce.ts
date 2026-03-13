import { onBeforeUnmount, type Ref, isRef } from 'vue'

export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: Ref<number> | number,
): { debounced: (...args: Parameters<T>) => void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function debounced(...args: Parameters<T>) {
    cancel()
    const ms = isRef(delay) ? delay.value : delay
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, ms)
  }

  onBeforeUnmount(cancel)

  return { debounced, cancel }
}
