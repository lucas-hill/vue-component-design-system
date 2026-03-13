import { reactive } from 'vue'
import type { IconName } from '../../icons'

export type ToastColor = 'primary' | 'danger' | 'success' | 'warning' | 'neutral'
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ToastOptions {
  title: string
  body?: string
  color?: ToastColor
  icon?: IconName
  position?: ToastPosition
  /**
   * When true the toast shows a close button and only dismisses on user action.
   * When false (default) the toast auto-dismisses after `duration` ms.
   */
  closable?: boolean
  /** Auto-dismiss delay in ms. Only used when `closable` is false. Defaults to 5000. */
  duration?: number
}

export interface ToastInstance {
  id: string
  title: string
  body: string
  color: ToastColor
  icon?: IconName
  position: ToastPosition
  closable: boolean
  duration: number
}

let nextId = 0

/** Internal shared reactive state — consumed by ToastContainer. */
export const toasts = reactive<ToastInstance[]>([])

function show(options: ToastOptions): string {
  const id = `toast-${nextId++}`
  toasts.push({
    id,
    title: options.title,
    body: options.body ?? '',
    color: options.color ?? 'primary',
    icon: options.icon,
    position: options.position ?? 'top-right',
    closable: options.closable ?? false,
    duration: options.duration ?? 5000,
  })
  return id
}

function dismiss(id: string) {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

function dismissAll() {
  toasts.splice(0, toasts.length)
}

export function useToast() {
  return { show, dismiss, dismissAll }
}
