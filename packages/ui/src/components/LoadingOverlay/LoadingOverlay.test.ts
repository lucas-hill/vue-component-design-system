import { render, cleanup } from '@testing-library/vue'
import { describe, it, expect, afterEach } from 'vitest'
import LoadingOverlay from './LoadingOverlay.vue'

afterEach(cleanup)

describe('LoadingOverlay', () => {
  describe('rendering', () => {
    it('renders a spinner svg', () => {
      const { container } = render(LoadingOverlay)
      expect(container.querySelector('.lucas-ui-loading-overlay__spinner')).toBeTruthy()
    })

    it('renders the overlay container', () => {
      const { container } = render(LoadingOverlay)
      expect(container.querySelector('.lucas-ui-loading-overlay')).toBeTruthy()
    })
  })

  describe('size prop', () => {
    it('applies md size class by default', () => {
      const { container } = render(LoadingOverlay)
      expect(container.querySelector('.lucas-ui-loading-overlay--md')).toBeTruthy()
    })

    it.each(['sm', 'md', 'lg', 'xl'] as const)('applies the correct class for size "%s"', (size) => {
      const { container } = render(LoadingOverlay, { props: { size } })
      expect(container.querySelector(`.lucas-ui-loading-overlay--${size}`)).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('is aria-hidden by default (parent owns aria-busy)', () => {
      const { container } = render(LoadingOverlay)
      expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
    })

    it('has role="status" and aria-label when label is provided', () => {
      const { getByRole } = render(LoadingOverlay, { props: { label: 'Loading content' } })
      const el = getByRole('status')
      expect(el.getAttribute('aria-label')).toBe('Loading content')
    })

    it('removes aria-hidden when label is provided', () => {
      const { getByRole } = render(LoadingOverlay, { props: { label: 'Loading' } })
      expect(getByRole('status').getAttribute('aria-hidden')).toBeNull()
    })
  })
})
