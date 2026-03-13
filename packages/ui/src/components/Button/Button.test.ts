import { render, screen, cleanup } from '@testing-library/vue'
import { h } from 'vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import Button from './Button.vue'
import IconTrash from '../../icons/IconTrash.vue'

afterEach(cleanup)

describe('Button', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders slot content', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect(screen.getByRole('button', { name: 'Click me' })).toBeTruthy()
  })

  it('applies the solid variant class by default', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect(screen.getByRole('button').classList.contains('lucas-ui-button--solid')).toBe(true)
  })

  it('applies the correct variant class', () => {
    render(Button, { props: { variant: 'outline' }, slots: { default: 'Click me' } })
    expect(screen.getByRole('button').classList.contains('lucas-ui-button--outline')).toBe(true)
  })

  it('is not disabled by default', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false)
  })

  it('applies disabled state', () => {
    render(Button, { props: { disabled: true }, slots: { default: 'Click me' } })
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.classList.contains('is-disabled')).toBe(true)
  })

  // ── Color prop ────────────────────────────────────────────────────────────

  it('applies the primary color class by default', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect(screen.getByRole('button').classList.contains('lucas-ui-button--color-primary')).toBe(true)
  })

  it.each(['primary', 'danger', 'success', 'warning', 'neutral'] as const)(
    'applies the correct color class for "%s"',
    (color) => {
      render(Button, { props: { color }, slots: { default: 'Click me' } })
      expect(
        screen.getByRole('button').classList.contains(`lucas-ui-button--color-${color}`),
      ).toBe(true)
    },
  )

  it('applies only one color class', () => {
    render(Button, { props: { color: 'danger' }, slots: { default: 'Click me' } })
    const button = screen.getByRole('button')
    const colorClasses = Array.from(button.classList).filter((c) =>
      c.startsWith('lucas-ui-button--color-'),
    )
    expect(colorClasses).toHaveLength(1)
    expect(colorClasses[0]).toBe('lucas-ui-button--color-danger')
  })

  // ── Loading state ─────────────────────────────────────────────────────────

  it('renders a spinner when loading is true', () => {
    const { container } = render(Button, {
      props: { loading: true },
      slots: { default: 'Save' },
    })
    expect(container.querySelector('.lucas-ui-loading-overlay__spinner')).toBeTruthy()
  })

  it('applies is-loading class when loading', () => {
    render(Button, { props: { loading: true }, slots: { default: 'Save' } })
    expect(screen.getByRole('button').classList.contains('is-loading')).toBe(true)
  })

  it('disables the button when loading', () => {
    render(Button, { props: { loading: true }, slots: { default: 'Save' } })
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('sets aria-busy when loading', () => {
    render(Button, { props: { loading: true }, slots: { default: 'Save' } })
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true')
  })

  it('does not set aria-busy when not loading', () => {
    render(Button, { slots: { default: 'Save' } })
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBeNull()
  })

  it('does not apply is-disabled class when loading (to avoid opacity conflict)', () => {
    render(Button, { props: { loading: true }, slots: { default: 'Save' } })
    expect(screen.getByRole('button').classList.contains('is-disabled')).toBe(false)
  })

  it('disables the button when both disabled and loading', () => {
    render(Button, { props: { disabled: true, loading: true }, slots: { default: 'Save' } })
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('renders the loading overlay in a button with an icon', () => {
    const { container } = render(Button, {
      props: { icon: 'save', iconPosition: 'left', loading: true },
      slots: { default: 'Save' },
    })
    expect(container.querySelector('.lucas-ui-loading-overlay__spinner')).toBeTruthy()
    expect(container.querySelector('.lucas-ui-loading-overlay')).toBeTruthy()
  })

  it('renders spinner in icon-only loading button', () => {
    const { container } = render(Button, {
      props: { icon: 'trash', loading: true },
      attrs: { 'aria-label': 'Delete' },
    })
    expect(container.querySelector('.lucas-ui-loading-overlay__spinner')).toBeTruthy()
  })

  // ── Icon only ─────────────────────────────────────────────────────────────

  it('renders an svg when icon prop is set', () => {
    const { container } = render(Button, {
      props: { icon: 'trash' },
      attrs: { 'aria-label': 'Delete' },
    })
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('applies icon-only class when icon is set with no iconPosition override', () => {
    const { container } = render(Button, {
      props: { icon: 'trash' },
      attrs: { 'aria-label': 'Delete' },
    })
    expect(container.querySelector('.lucas-ui-button--icon-only')).toBeTruthy()
  })

  it('does not render the label span in icon-only mode', () => {
    const { container } = render(Button, {
      props: { icon: 'trash' },
      slots: { default: 'Should not appear' },
      attrs: { 'aria-label': 'Delete' },
    })
    expect(container.querySelector('.lucas-ui-button__label')).toBeNull()
  })

  // ── Icon positions ────────────────────────────────────────────────────────

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'applies icon-%s class when iconPosition is %s',
    (position) => {
      const { container } = render(Button, {
        props: { icon: 'save', iconPosition: position },
        slots: { default: 'Save' },
      })
      expect(container.querySelector(`.lucas-ui-button--icon-${position}`)).toBeTruthy()
    },
  )

  it('renders the label when iconPosition is left', () => {
    render(Button, {
      props: { icon: 'save', iconPosition: 'left' },
      slots: { default: 'Save' },
    })
    expect(screen.getByRole('button', { name: /Save/ })).toBeTruthy()
  })

  it('renders icon before label when iconPosition is left', () => {
    const { container } = render(Button, {
      props: { icon: 'save', iconPosition: 'left' },
      slots: { default: 'Save' },
    })
    const button = container.querySelector('button')!
    const children = Array.from(button.children)
    const iconIndex = children.findIndex((el) => el.classList.contains('lucas-ui-icon-wrapper'))
    const labelIndex = children.findIndex((el) => el.classList.contains('lucas-ui-button__label'))
    expect(iconIndex).toBeLessThan(labelIndex)
  })

  it('renders icon after label when iconPosition is right', () => {
    const { container } = render(Button, {
      props: { icon: 'save', iconPosition: 'right' },
      slots: { default: 'Save' },
    })
    const button = container.querySelector('button')!
    const children = Array.from(button.children)
    const labelIndex = children.findIndex((el) => el.classList.contains('lucas-ui-button__label'))
    const iconIndex = children.findIndex((el) => el.classList.contains('lucas-ui-icon-wrapper'))
    expect(labelIndex).toBeLessThan(iconIndex)
  })

  // ── #icon slot ────────────────────────────────────────────────────────────

  it('renders custom icon via #icon slot', () => {
    const { container } = render(Button, {
      props: { iconPosition: 'left' },
      slots: {
        icon: () => h(IconTrash),
        default: 'Delete',
      },
    })
    expect(container.querySelector('svg')).toBeTruthy()
    expect(screen.getByText('Delete')).toBeTruthy()
  })

  it('renders icon-only with custom #icon slot', () => {
    const { container } = render(Button, {
      props: { iconPosition: 'only' },
      attrs: { 'aria-label': 'Delete' },
      slots: {
        icon: () => h(IconTrash),
      },
    })
    expect(container.querySelector('svg')).toBeTruthy()
    expect(container.querySelector('.lucas-ui-button__label')).toBeNull()
  })

  // ── Size prop ─────────────────────────────────────────────────────────────

  it('applies size-md class by default', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect(screen.getByRole('button').classList.contains('lucas-ui-button--size-md')).toBe(true)
  })

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class when size is %s',
    (size) => {
      render(Button, { props: { size }, slots: { default: 'Click me' } })
      expect(
        screen.getByRole('button').classList.contains(`lucas-ui-button--size-${size}`),
      ).toBe(true)
    },
  )

  it('applies only one size class', () => {
    render(Button, { props: { size: 'lg' }, slots: { default: 'Click me' } })
    const button = screen.getByRole('button')
    const sizeClasses = Array.from(button.classList).filter((c) =>
      c.startsWith('lucas-ui-button--size-'),
    )
    expect(sizeClasses).toHaveLength(1)
    expect(sizeClasses[0]).toBe('lucas-ui-button--size-lg')
  })

  // ── Pill shape ────────────────────────────────────────────────────────────

  it('does not apply pill class by default', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect(screen.getByRole('button').classList.contains('lucas-ui-button--pill')).toBe(false)
  })

  it('applies pill class when pill is true', () => {
    render(Button, { props: { pill: true }, slots: { default: 'Click me' } })
    expect(screen.getByRole('button').classList.contains('lucas-ui-button--pill')).toBe(true)
  })

  it('pill works with all variants', () => {
    (['solid', 'outline', 'ghost'] as const).forEach((variant) => {
      const { unmount } = render(Button, { props: { pill: true, variant }, slots: { default: 'Click me' } })
      expect(screen.getByRole('button').classList.contains('lucas-ui-button--pill')).toBe(true)
      unmount()
    })
  })

  // ── No icon class when no icon ────────────────────────────────────────────

  it('does not apply icon classes when no icon is provided', () => {
    const { container } = render(Button, { slots: { default: 'Click me' } })
    expect(container.querySelector('button')!.className).not.toMatch(/lucas-ui-button--icon-/)
  })

  // ── Accessibility warning ─────────────────────────────────────────────────

  describe('accessibility warning', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('warns in dev when icon-only button has no aria-label', async () => {
      render(Button, { props: { icon: 'trash' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('aria-label'))
    })

    it('does not warn when aria-label is provided', async () => {
      render(Button, { props: { icon: 'trash' }, attrs: { 'aria-label': 'Delete' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
