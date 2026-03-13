import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import Select from './Select.vue'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

afterEach(cleanup)

describe('Select', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders a select element', () => {
    render(Select, { props: { label: 'Fruit', options } })
    expect(screen.getByRole('combobox')).toBeTruthy()
  })

  it('renders all options', () => {
    render(Select, { props: { label: 'Fruit', options } })
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.getByText('Banana')).toBeTruthy()
    expect(screen.getByText('Cherry')).toBeTruthy()
  })

  it('renders placeholder option', () => {
    render(Select, { props: { label: 'Fruit', options, placeholder: 'Pick one…' } })
    expect(screen.getByText('Pick one…')).toBeTruthy()
  })

  it('renders option value as label when label is not provided', () => {
    render(Select, {
      props: { label: 'Fruit', options: [{ value: 'mango' }] },
    })
    expect(screen.getByText('mango')).toBeTruthy()
  })

  it('renders disabled option', () => {
    const opts = [{ value: 'a', label: 'A', disabled: true }]
    render(Select, { props: { label: 'Test', options: opts } })
    expect((screen.getByText('A') as HTMLOptionElement).disabled).toBe(true)
  })

  // ── Label ─────────────────────────────────────────────────────────────────

  it('renders label with correct for association', () => {
    render(Select, { props: { label: 'Fruit', options } })
    const label = screen.getByText('Fruit')
    const select = screen.getByRole('combobox')
    expect(label.tagName).toBe('LABEL')
    expect(label.getAttribute('for')).toBe(select.id)
  })

  it('does not render label when not provided', () => {
    render(Select, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
    expect(screen.queryByText('Fruit')).toBeNull()
  })

  // ── Error ─────────────────────────────────────────────────────────────────

  it('renders error with role="alert"', () => {
    render(Select, { props: { label: 'Fruit', options, error: 'Required' } })
    expect(screen.getByRole('alert').textContent).toBe('Required')
  })

  it('sets aria-invalid when error is set', () => {
    render(Select, { props: { label: 'Fruit', options, error: 'Required' } })
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when no error', () => {
    render(Select, { props: { label: 'Fruit', options } })
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBeNull()
  })

  // ── Description ───────────────────────────────────────────────────────────

  it('renders description', () => {
    render(Select, { props: { label: 'Fruit', options, description: 'Pick your fave' } })
    expect(screen.getByText('Pick your fave')).toBeTruthy()
  })

  // ── aria-describedby ──────────────────────────────────────────────────────

  it('links aria-describedby to error and description', () => {
    render(Select, {
      props: { label: 'Fruit', options, error: 'Required', description: 'Pick one' },
    })
    const select = screen.getByRole('combobox')
    const describedBy = select.getAttribute('aria-describedby')!
    const ids = describedBy.split(' ')
    expect(ids).toHaveLength(2)
    ids.forEach((id) => {
      expect(document.getElementById(id)).toBeTruthy()
    })
  })

  it('does not set aria-describedby when no error or description', () => {
    render(Select, { props: { label: 'Fruit', options } })
    expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBeNull()
  })

  // ── Size modifiers ────────────────────────────────────────────────────────

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class',
    (size) => {
      const { container } = render(Select, { props: { label: 'Fruit', options, size } })
      expect(container.querySelector(`.lucas-ui-select--size-${size}`)).toBeTruthy()
    },
  )

  // ── Disabled state ────────────────────────────────────────────────────────

  it('disables the select when disabled prop is true', () => {
    render(Select, { props: { label: 'Fruit', options, disabled: true } })
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(true)
  })

  // ── v-model ───────────────────────────────────────────────────────────────

  it('emits update:modelValue on change', async () => {
    const { emitted } = render(Select, {
      props: { label: 'Fruit', options, modelValue: 'apple' },
    })
    await fireEvent.update(screen.getByRole('combobox'), 'banana')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['banana'])
  })

  it('renders the selected modelValue', () => {
    render(Select, { props: { label: 'Fruit', options, modelValue: 'banana' } })
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('banana')
  })

  // ── Numeric values ────────────────────────────────────────────────────────

  it('handles numeric option values', async () => {
    const numOptions = [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }]
    const { emitted } = render(Select, {
      props: { label: 'Num', options: numOptions, modelValue: 1 },
    })
    await fireEvent.update(screen.getByRole('combobox'), '2')
    expect(emitted()['update:modelValue'][0]).toEqual([2])
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
      render(Select, { props: { options } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('label'))
    })

    it('does not warn when label is provided', async () => {
      render(Select, { props: { label: 'Fruit', options } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
