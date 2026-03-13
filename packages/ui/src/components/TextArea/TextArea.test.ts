import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import TextArea from './TextArea.vue'

afterEach(cleanup)

describe('TextArea', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders a textarea element', () => {
    render(TextArea, { props: { label: 'Bio' } })
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
  })

  it('renders placeholder text', () => {
    render(TextArea, { props: { label: 'Bio', placeholder: 'Tell us…' } })
    expect(screen.getByPlaceholderText('Tell us…')).toBeTruthy()
  })

  it('renders with default rows of 3', () => {
    render(TextArea, { props: { label: 'Bio' } })
    expect(screen.getByRole('textbox').getAttribute('rows')).toBe('3')
  })

  it('renders with custom rows', () => {
    render(TextArea, { props: { label: 'Bio', rows: 5 } })
    expect(screen.getByRole('textbox').getAttribute('rows')).toBe('5')
  })

  // ── Label ─────────────────────────────────────────────────────────────────

  it('renders label with correct for association', () => {
    render(TextArea, { props: { label: 'Bio' } })
    const label = screen.getByText('Bio')
    const textarea = screen.getByRole('textbox')
    expect(label.tagName).toBe('LABEL')
    expect(label.getAttribute('for')).toBe(textarea.id)
  })

  it('does not render label when not provided', () => {
    render(TextArea, { attrs: { 'aria-label': 'Bio' } })
    expect(screen.queryByText('Bio')).toBeNull()
  })

  // ── Error ─────────────────────────────────────────────────────────────────

  it('renders error with role="alert"', () => {
    render(TextArea, { props: { label: 'Bio', error: 'Too short' } })
    expect(screen.getByRole('alert').textContent).toBe('Too short')
  })

  it('sets aria-invalid when error is set', () => {
    render(TextArea, { props: { label: 'Bio', error: 'Too short' } })
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when no error', () => {
    render(TextArea, { props: { label: 'Bio' } })
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBeNull()
  })

  // ── Description ───────────────────────────────────────────────────────────

  it('renders description', () => {
    render(TextArea, { props: { label: 'Bio', description: 'Max 500 chars' } })
    expect(screen.getByText('Max 500 chars')).toBeTruthy()
  })

  // ── aria-describedby ──────────────────────────────────────────────────────

  it('links aria-describedby to error and description', () => {
    render(TextArea, {
      props: { label: 'Bio', error: 'Too short', description: 'Max 500' },
    })
    const textarea = screen.getByRole('textbox')
    const describedBy = textarea.getAttribute('aria-describedby')!
    const ids = describedBy.split(' ')
    expect(ids).toHaveLength(2)
    ids.forEach((id) => {
      expect(document.getElementById(id)).toBeTruthy()
    })
  })

  it('does not set aria-describedby when no error or description', () => {
    render(TextArea, { props: { label: 'Bio' } })
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
  })

  // ── Size modifiers ────────────────────────────────────────────────────────

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class',
    (size) => {
      const { container } = render(TextArea, { props: { label: 'Bio', size } })
      expect(container.querySelector(`.lucas-ui-textarea--size-${size}`)).toBeTruthy()
    },
  )

  // ── Disabled state ────────────────────────────────────────────────────────

  it('disables the textarea when disabled prop is true', () => {
    render(TextArea, { props: { label: 'Bio', disabled: true } })
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true)
  })

  // ── Readonly state ────────────────────────────────────────────────────────

  it('sets readonly attribute', () => {
    render(TextArea, { props: { label: 'Bio', readonly: true } })
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).readOnly).toBe(true)
  })

  // ── Resize ────────────────────────────────────────────────────────────────

  it('applies resize style', () => {
    render(TextArea, { props: { label: 'Bio', resize: 'none' } })
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).style.resize).toBe('none')
  })

  it('defaults to vertical resize', () => {
    render(TextArea, { props: { label: 'Bio' } })
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).style.resize).toBe('vertical')
  })

  // ── v-model ───────────────────────────────────────────────────────────────

  it('emits update:modelValue on input', async () => {
    const { emitted } = render(TextArea, { props: { label: 'Bio', modelValue: '' } })
    await fireEvent.update(screen.getByRole('textbox'), 'hello')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['hello'])
  })

  it('renders the modelValue', () => {
    render(TextArea, { props: { label: 'Bio', modelValue: 'Hello world' } })
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Hello world')
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
      render(TextArea)
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('label'))
    })

    it('does not warn when label is provided', async () => {
      render(TextArea, { props: { label: 'Bio' } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
