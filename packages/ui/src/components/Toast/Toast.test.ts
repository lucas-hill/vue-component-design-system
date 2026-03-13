import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import Toast from './Toast.vue'
import ToastContainer from './ToastContainer.vue'
import { useToast, toasts } from './useToast'
import type { ToastInstance } from './useToast'

function clearToasts() {
  toasts.splice(0, toasts.length)
}

afterEach(() => {
  cleanup()
  clearToasts()
})

// ── useToast composable ───────────────────────────────────────────────────────

describe('useToast', () => {
  it('show() adds a toast to the store', () => {
    const { show } = useToast()
    show({ title: 'Hello' })
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Hello')
  })

  it('show() returns a string id', () => {
    const { show } = useToast()
    const id = show({ title: 'Test' })
    expect(typeof id).toBe('string')
  })

  it('show() applies defaults', () => {
    const { show } = useToast()
    show({ title: 'Defaults' })
    const t = toasts[0]
    expect(t.body).toBe('')
    expect(t.color).toBe('primary')
    expect(t.position).toBe('top-right')
    expect(t.closable).toBe(false)
    expect(t.duration).toBe(5000)
  })

  it('show() respects provided options', () => {
    const { show } = useToast()
    show({
      title: 'Custom',
      body: 'Body text',
      color: 'danger',
      icon: 'trash',
      position: 'bottom-left',
      closable: true,
      duration: 3000,
    })
    const t = toasts[0]
    expect(t.body).toBe('Body text')
    expect(t.color).toBe('danger')
    expect(t.icon).toBe('trash')
    expect(t.position).toBe('bottom-left')
    expect(t.closable).toBe(true)
    expect(t.duration).toBe(3000)
  })

  it('dismiss() removes a toast by id', () => {
    const { show, dismiss } = useToast()
    const id = show({ title: 'Remove me' })
    expect(toasts).toHaveLength(1)
    dismiss(id)
    expect(toasts).toHaveLength(0)
  })

  it('dismiss() does nothing for unknown id', () => {
    const { show, dismiss } = useToast()
    show({ title: 'Stay' })
    dismiss('nonexistent')
    expect(toasts).toHaveLength(1)
  })

  it('dismissAll() clears all toasts', () => {
    const { show, dismissAll } = useToast()
    show({ title: 'A' })
    show({ title: 'B' })
    show({ title: 'C' })
    expect(toasts).toHaveLength(3)
    dismissAll()
    expect(toasts).toHaveLength(0)
  })
})

// ── Toast.vue component ───────────────────────────────────────────────────────

describe('Toast', () => {
  function makeToast(overrides: Partial<ToastInstance> = {}): ToastInstance {
    return {
      id: 'test-1',
      title: 'Test Toast',
      body: '',
      color: 'primary',
      position: 'top-right',
      closable: false,
      duration: 5000,
      ...overrides,
    }
  }

  it('renders the title', () => {
    render(Toast, { props: { toast: makeToast({ title: 'Hello World' }) } })
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('renders the body when provided', () => {
    render(Toast, { props: { toast: makeToast({ body: 'Body text here' }) } })
    expect(screen.getByText('Body text here')).toBeTruthy()
  })

  it('does not render body paragraph when body is empty', () => {
    const { container } = render(Toast, { props: { toast: makeToast({ body: '' }) } })
    expect(container.querySelector('.lucas-ui-toast__body')).toBeNull()
  })

  it('renders icon when provided', () => {
    const { container } = render(Toast, {
      props: { toast: makeToast({ icon: 'save' }) },
    })
    expect(container.querySelector('.lucas-ui-toast__icon svg')).toBeTruthy()
  })

  it('does not render icon when not provided', () => {
    const { container } = render(Toast, { props: { toast: makeToast() } })
    expect(container.querySelector('.lucas-ui-toast__icon')).toBeNull()
  })

  it('applies color class', () => {
    const { container } = render(Toast, {
      props: { toast: makeToast({ color: 'danger' }) },
    })
    expect(container.querySelector('.lucas-ui-toast--color-danger')).toBeTruthy()
  })

  it.each(['primary', 'danger', 'success', 'warning', 'neutral'] as const)(
    'applies color class for %s',
    (color) => {
      const { container } = render(Toast, {
        props: { toast: makeToast({ color }) },
      })
      expect(container.querySelector(`.lucas-ui-toast--color-${color}`)).toBeTruthy()
    },
  )

  // ── Closable ──────────────────────────────────────────────────────────────

  it('renders close button when closable', () => {
    render(Toast, { props: { toast: makeToast({ closable: true }) } })
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy()
  })

  it('does not render close button when not closable', () => {
    render(Toast, { props: { toast: makeToast({ closable: false }) } })
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull()
  })

  it('dismiss button removes toast from store', async () => {
    const t = makeToast({ id: 'closable-1', closable: true })
    toasts.push(t)
    render(Toast, { props: { toast: t } })
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(toasts.find((x) => x.id === 'closable-1')).toBeUndefined()
  })

  // ── Auto-dismiss ──────────────────────────────────────────────────────────

  it('auto-dismisses after duration', () => {
    vi.useFakeTimers()
    const t = makeToast({ id: 'auto-1', closable: false, duration: 3000 })
    toasts.push(t)
    render(Toast, { props: { toast: t } })
    expect(toasts.find((x) => x.id === 'auto-1')).toBeTruthy()
    vi.advanceTimersByTime(3000)
    expect(toasts.find((x) => x.id === 'auto-1')).toBeUndefined()
    vi.useRealTimers()
  })

  it('does not auto-dismiss closable toast', () => {
    vi.useFakeTimers()
    const t = makeToast({ id: 'closable-2', closable: true, duration: 3000 })
    toasts.push(t)
    render(Toast, { props: { toast: t } })
    vi.advanceTimersByTime(10000)
    expect(toasts.find((x) => x.id === 'closable-2')).toBeTruthy()
    vi.useRealTimers()
  })
})

// ── ToastContainer ────────────────────────────────────────────────────────────

describe('ToastContainer', () => {
  it('renders toasts in the container', () => {
    const { show } = useToast()
    show({ title: 'Container toast' })
    render(ToastContainer)
    expect(screen.getByText('Container toast')).toBeTruthy()
  })

  it('renders toasts in the correct corner', () => {
    const { show } = useToast()
    show({ title: 'Top right toast', position: 'top-right' })
    show({ title: 'Bottom left toast', position: 'bottom-left' })
    const { container } = render(ToastContainer)
    const topRight = container.querySelector('.lucas-ui-toast-container__corner--top-right')!
    const bottomLeft = container.querySelector('.lucas-ui-toast-container__corner--bottom-left')!
    expect(topRight.textContent).toContain('Top right toast')
    expect(bottomLeft.textContent).toContain('Bottom left toast')
  })

  it('renders all 4 corner regions', () => {
    const { container } = render(ToastContainer)
    expect(container.querySelector('.lucas-ui-toast-container__corner--top-left')).toBeTruthy()
    expect(container.querySelector('.lucas-ui-toast-container__corner--top-right')).toBeTruthy()
    expect(container.querySelector('.lucas-ui-toast-container__corner--bottom-left')).toBeTruthy()
    expect(container.querySelector('.lucas-ui-toast-container__corner--bottom-right')).toBeTruthy()
  })

  it('has aria-live for screen reader announcements', () => {
    const { container } = render(ToastContainer)
    expect(container.querySelector('[aria-live="polite"]')).toBeTruthy()
  })
})
