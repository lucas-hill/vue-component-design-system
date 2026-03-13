import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { describe, it, expect, afterEach } from 'vitest'
import Tag from './Tag.vue'
import IconTrash from '../../icons/IconTrash.vue'

afterEach(cleanup)

describe('Tag', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders default slot content as text', () => {
    render(Tag, { slots: { default: 'Status' } })
    expect(screen.getByText('Status')).toBeTruthy()
  })

  it('root element is a span', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.firstElementChild!.tagName).toBe('SPAN')
  })

  it('has the base class', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.firstElementChild!.classList.contains('lucas-ui-tag')).toBe(true)
  })

  // ── Variant classes ─────────────────────────────────────────────────────

  it('applies subtle variant class by default', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.firstElementChild!.classList.contains('lucas-ui-tag--subtle')).toBe(true)
  })

  it.each(['solid', 'subtle', 'outline'] as const)(
    'applies the correct variant class for "%s"',
    (variant) => {
      const { container } = render(Tag, { props: { variant }, slots: { default: 'Status' } })
      expect(container.firstElementChild!.classList.contains(`lucas-ui-tag--${variant}`)).toBe(true)
    },
  )

  it('applies only one variant class at a time', () => {
    const { container } = render(Tag, { props: { variant: 'solid' }, slots: { default: 'Status' } })
    const variantClasses = Array.from(container.firstElementChild!.classList).filter((c) =>
      ['lucas-ui-tag--solid', 'lucas-ui-tag--subtle', 'lucas-ui-tag--outline'].includes(c),
    )
    expect(variantClasses).toHaveLength(1)
    expect(variantClasses[0]).toBe('lucas-ui-tag--solid')
  })

  // ── Color classes ───────────────────────────────────────────────────────

  it('applies neutral color class by default', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.firstElementChild!.classList.contains('lucas-ui-tag--color-neutral')).toBe(true)
  })

  it.each(['primary', 'danger', 'success', 'warning', 'neutral'] as const)(
    'applies the correct color class for "%s"',
    (color) => {
      const { container } = render(Tag, { props: { color }, slots: { default: 'Status' } })
      expect(
        container.firstElementChild!.classList.contains(`lucas-ui-tag--color-${color}`),
      ).toBe(true)
    },
  )

  it('applies only one color class at a time', () => {
    const { container } = render(Tag, { props: { color: 'danger' }, slots: { default: 'Status' } })
    const colorClasses = Array.from(container.firstElementChild!.classList).filter((c) =>
      c.startsWith('lucas-ui-tag--color-'),
    )
    expect(colorClasses).toHaveLength(1)
    expect(colorClasses[0]).toBe('lucas-ui-tag--color-danger')
  })

  // ── Size classes ────────────────────────────────────────────────────────

  it('applies size-md class by default', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.firstElementChild!.classList.contains('lucas-ui-tag--size-md')).toBe(true)
  })

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class when size is %s',
    (size) => {
      const { container } = render(Tag, { props: { size }, slots: { default: 'Status' } })
      expect(
        container.firstElementChild!.classList.contains(`lucas-ui-tag--size-${size}`),
      ).toBe(true)
    },
  )

  // ── Pill shape ──────────────────────────────────────────────────────────

  it('does not apply pill class by default', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.firstElementChild!.classList.contains('lucas-ui-tag--pill')).toBe(false)
  })

  it('applies pill class when pill is true', () => {
    const { container } = render(Tag, { props: { pill: true }, slots: { default: 'Status' } })
    expect(container.firstElementChild!.classList.contains('lucas-ui-tag--pill')).toBe(true)
  })

  // ── Closable ────────────────────────────────────────────────────────────

  it('does not render close button by default', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.querySelector('.lucas-ui-tag__close')).toBeNull()
  })

  it('renders close button when closable is true', () => {
    const { container } = render(Tag, { props: { closable: true }, slots: { default: 'Status' } })
    expect(container.querySelector('.lucas-ui-tag__close')).toBeTruthy()
  })

  it('close button has aria-label "Remove"', () => {
    const { container } = render(Tag, { props: { closable: true }, slots: { default: 'Status' } })
    expect(container.querySelector('.lucas-ui-tag__close')!.getAttribute('aria-label')).toBe('Remove')
  })

  it('emits close event when close button is clicked', async () => {
    const { container, emitted } = render(Tag, {
      props: { closable: true },
      slots: { default: 'Status' },
    })
    await fireEvent.click(container.querySelector('.lucas-ui-tag__close')!)
    expect(emitted().close).toHaveLength(1)
  })

  it('does not emit close when closable is false', async () => {
    const { emitted } = render(Tag, { slots: { default: 'Status' } })
    expect(emitted().close).toBeUndefined()
  })

  // ── Icon prop ───────────────────────────────────────────────────────────

  it('renders Icon component when icon prop is set', () => {
    const { container } = render(Tag, {
      props: { icon: 'trash' },
      slots: { default: 'Delete' },
    })
    expect(container.querySelector('.lucas-ui-tag__icon')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('does not render icon wrapper when no icon provided', () => {
    const { container } = render(Tag, { slots: { default: 'Status' } })
    expect(container.querySelector('.lucas-ui-tag__icon')).toBeNull()
  })

  // ── Icon slot ───────────────────────────────────────────────────────────

  it('renders custom icon via #icon slot', () => {
    const { container } = render(Tag, {
      slots: {
        icon: () => h(IconTrash),
        default: 'Delete',
      },
    })
    expect(container.querySelector('.lucas-ui-tag__icon')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
    expect(screen.getByText('Delete')).toBeTruthy()
  })

  it('slot overrides icon prop', () => {
    const { container } = render(Tag, {
      props: { icon: 'save' },
      slots: {
        icon: () => h(IconTrash),
        default: 'Delete',
      },
    })
    // Should render the slot content (IconTrash), not the icon prop
    expect(container.querySelector('.lucas-ui-tag__icon')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
