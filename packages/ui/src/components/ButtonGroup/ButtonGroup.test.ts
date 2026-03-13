import { render, screen, cleanup } from '@testing-library/vue'
import { describe, it, expect, afterEach } from 'vitest'
import ButtonGroup from './ButtonGroup.vue'
import Button from '../Button/Button.vue'

afterEach(cleanup)

describe('ButtonGroup', () => {
  describe('rendering', () => {
    it('renders a group container', () => {
      const { container } = render(ButtonGroup)
      expect(container.querySelector('.lucas-ui-button-group')).toBeTruthy()
    })

    it('has role="group"', () => {
      render(ButtonGroup, { slots: { default: 'content' } })
      expect(screen.getByRole('group')).toBeTruthy()
    })

    it('renders slotted children', () => {
      const { container } = render(ButtonGroup, {
        slots: {
          default: '<button class="lucas-ui-button">A</button><button class="lucas-ui-button">B</button>',
        },
      })
      expect(container.querySelectorAll('.lucas-ui-button')).toHaveLength(2)
    })
  })

  describe('orientation prop', () => {
    it('defaults to horizontal (no vertical class)', () => {
      const { container } = render(ButtonGroup)
      expect(container.querySelector('.lucas-ui-button-group--vertical')).toBeNull()
    })

    it('applies vertical class when orientation is vertical', () => {
      const { container } = render(ButtonGroup, { props: { orientation: 'vertical' } })
      expect(container.querySelector('.lucas-ui-button-group--vertical')).toBeTruthy()
    })

    it('does not apply vertical class for horizontal orientation', () => {
      const { container } = render(ButtonGroup, { props: { orientation: 'horizontal' } })
      expect(container.querySelector('.lucas-ui-button-group--vertical')).toBeNull()
    })
  })

  describe('label prop', () => {
    it('sets aria-label when label is provided', () => {
      render(ButtonGroup, { props: { label: 'Text alignment' } })
      expect(screen.getByRole('group', { name: 'Text alignment' })).toBeTruthy()
    })

    it('has no aria-label when label is omitted', () => {
      render(ButtonGroup)
      expect(screen.getByRole('group').getAttribute('aria-label')).toBeNull()
    })
  })

  describe('with Button children', () => {
    it('renders Button components inside the group', async () => {
      const { container } = render({
        components: { ButtonGroup, Button },
        template: `
          <ButtonGroup label="Actions">
            <Button>Save</Button>
            <Button>Cancel</Button>
          </ButtonGroup>
        `,
      })
      expect(container.querySelectorAll('.lucas-ui-button')).toHaveLength(2)
      expect(container.querySelector('.lucas-ui-button-group')).toBeTruthy()
    })

    it('all Button children are inside the group container', async () => {
      const { container } = render({
        components: { ButtonGroup, Button },
        template: `
          <ButtonGroup label="Actions">
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        `,
      })
      const group = container.querySelector('.lucas-ui-button-group')!
      const buttons = group.querySelectorAll('.lucas-ui-button')
      expect(buttons).toHaveLength(3)
    })
  })
})
