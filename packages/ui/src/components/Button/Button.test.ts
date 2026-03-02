import { render, screen, cleanup } from '@testing-library/vue'
import { describe, it, expect, afterEach } from 'vitest'
import Button from './Button.vue'

afterEach(cleanup)

describe('Button', () => {
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
})
