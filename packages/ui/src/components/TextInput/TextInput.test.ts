import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import TextInput from './TextInput.vue'
import IconTrash from '../../icons/IconTrash.vue'

afterEach(cleanup)

describe('TextInput', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders an input element', () => {
    render(TextInput, { props: { label: 'Name' } })
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('renders with text type by default', () => {
    render(TextInput, { props: { label: 'Name' } })
    expect((screen.getByRole('textbox') as HTMLInputElement).type).toBe('text')
  })

  it('renders the correct input type', () => {
    const { container } = render(TextInput, { props: { label: 'Email', type: 'email' } })
    expect(container.querySelector('input[type="email"]')).toBeTruthy()
  })

  it('renders placeholder text', () => {
    render(TextInput, { props: { label: 'Name', placeholder: 'Enter name' } })
    expect(screen.getByPlaceholderText('Enter name')).toBeTruthy()
  })

  // ── Label ─────────────────────────────────────────────────────────────────

  it('renders label with correct for association', () => {
    render(TextInput, { props: { label: 'Name' } })
    const label = screen.getByText('Name')
    const input = screen.getByRole('textbox')
    expect(label.tagName).toBe('LABEL')
    expect(label.getAttribute('for')).toBe(input.id)
  })

  it('does not render label when not provided', () => {
    render(TextInput, { attrs: { 'aria-label': 'Name' } })
    expect(screen.queryByText('Name')).toBeNull()
  })

  // ── Error ─────────────────────────────────────────────────────────────────

  it('renders error with role="alert"', () => {
    render(TextInput, { props: { label: 'Name', error: 'Required' } })
    expect(screen.getByRole('alert').textContent).toBe('Required')
  })

  it('sets aria-invalid when error is set', () => {
    render(TextInput, { props: { label: 'Name', error: 'Required' } })
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when no error', () => {
    render(TextInput, { props: { label: 'Name' } })
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBeNull()
  })

  // ── Description ───────────────────────────────────────────────────────────

  it('renders description', () => {
    render(TextInput, { props: { label: 'Name', description: 'Your legal name' } })
    expect(screen.getByText('Your legal name')).toBeTruthy()
  })

  // ── aria-describedby ──────────────────────────────────────────────────────

  it('links aria-describedby to error and description', () => {
    render(TextInput, {
      props: { label: 'Name', error: 'Required', description: 'Your legal name' },
    })
    const input = screen.getByRole('textbox')
    const describedBy = input.getAttribute('aria-describedby')!
    const ids = describedBy.split(' ')
    expect(ids).toHaveLength(2)
    ids.forEach((id) => {
      expect(document.getElementById(id)).toBeTruthy()
    })
  })

  it('does not set aria-describedby when no error or description', () => {
    render(TextInput, { props: { label: 'Name' } })
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
  })

  // ── Size modifiers ────────────────────────────────────────────────────────

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class',
    (size) => {
      const { container } = render(TextInput, { props: { label: 'Name', size } })
      expect(container.querySelector(`.lucas-ui-text-input--size-${size}`)).toBeTruthy()
    },
  )

  // ── Disabled state ────────────────────────────────────────────────────────

  it('disables the input when disabled prop is true', () => {
    render(TextInput, { props: { label: 'Name', disabled: true } })
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
  })

  // ── Readonly state ────────────────────────────────────────────────────────

  it('sets readonly attribute', () => {
    render(TextInput, { props: { label: 'Name', readonly: true } })
    expect((screen.getByRole('textbox') as HTMLInputElement).readOnly).toBe(true)
  })

  // ── v-model ───────────────────────────────────────────────────────────────

  it('emits update:modelValue on input', async () => {
    const { emitted } = render(TextInput, { props: { label: 'Name', modelValue: '' } })
    await fireEvent.update(screen.getByRole('textbox'), 'hello')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['hello'])
  })

  it('renders the modelValue', () => {
    render(TextInput, { props: { label: 'Name', modelValue: 'Jane' } })
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Jane')
  })

  // ── Icons ─────────────────────────────────────────────────────────────────

  it('renders leading icon by name', () => {
    const { container } = render(TextInput, {
      props: { label: 'Search', leadingIcon: 'home' },
    })
    expect(container.querySelector('.lucas-ui-text-input__leading svg')).toBeTruthy()
  })

  it('renders trailing icon by name', () => {
    const { container } = render(TextInput, {
      props: { label: 'Search', trailingIcon: 'save' },
    })
    expect(container.querySelector('.lucas-ui-text-input__trailing svg')).toBeTruthy()
  })

  it('renders custom leading slot', () => {
    const { container } = render(TextInput, {
      props: { label: 'Search' },
      slots: { leading: () => h(IconTrash) },
    })
    expect(container.querySelector('.lucas-ui-text-input__leading svg')).toBeTruthy()
  })

  // ── Accessibility warning ─────────────────────────────────────────────────

  describe('accessibility warning', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('warns in dev when no label or aria-label', async () => {
      render(TextInput)
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('label'))
    })

    it('does not warn when label is provided', async () => {
      render(TextInput, { props: { label: 'Name' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })

    it('does not warn when aria-label is provided', async () => {
      render(TextInput, { attrs: { 'aria-label': 'Name' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
