import { render, screen, cleanup } from '@testing-library/vue'
import { h } from 'vue'
import { describe, it, expect, afterEach } from 'vitest'
import Icon from './Icon.vue'
import IconTrash from '../../icons/IconTrash.vue'

afterEach(cleanup)

describe('Icon', () => {
  describe('name prop (registry)', () => {
    it('renders an SVG when a valid name is provided', () => {
      const { container } = render(Icon, { props: { name: 'home' } })
      expect(container.querySelector('svg')).toBeTruthy()
    })

    it('renders the correct icon for each registered name', () => {
      const names = ['home', 'save', 'trash'] as const
      for (const name of names) {
        const { container, unmount } = render(Icon, { props: { name } })
        expect(container.querySelector('svg'), `expected svg for "${name}"`).toBeTruthy()
        unmount()
      }
    })

    it('renders nothing inside the wrapper when no name or slot is provided', () => {
      const { container } = render(Icon)
      expect(container.querySelector('svg')).toBeNull()
    })
  })

  describe('slot fallback', () => {
    it('renders slotted content when no name prop is given', () => {
      const { container } = render(Icon, {
        slots: { default: () => h(IconTrash) },
      })
      expect(container.querySelector('svg')).toBeTruthy()
    })
  })

  describe('size prop', () => {
    it('applies the correct size class', () => {
      const { container } = render(Icon, { props: { name: 'home', size: 'lg' } })
      expect(container.firstElementChild?.classList.contains('lucas-ui-icon-wrapper--lg')).toBe(true)
    })

    it('applies no size class when size is omitted', () => {
      const { container } = render(Icon, { props: { name: 'home' } })
      const wrapper = container.firstElementChild!
      expect(wrapper.className).not.toMatch(/lucas-ui-icon-wrapper--/)
    })
  })

  describe('accessibility', () => {
    it('is aria-hidden when no label is provided', () => {
      const { container } = render(Icon, { props: { name: 'home' } })
      expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
    })

    it('has role="img" and aria-label when label is provided', () => {
      render(Icon, { props: { name: 'home', label: 'Home' } })
      const img = screen.getByRole('img', { name: 'Home' })
      expect(img).toBeTruthy()
    })

    it('removes aria-hidden when label is provided', () => {
      render(Icon, { props: { name: 'home', label: 'Home' } })
      const wrapper = screen.getByRole('img', { name: 'Home' })
      expect(wrapper.getAttribute('aria-hidden')).toBeNull()
    })
  })
})
