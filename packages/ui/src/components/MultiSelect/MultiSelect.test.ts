import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import MultiSelect from './MultiSelect.vue'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

afterEach(cleanup)

describe('MultiSelect', () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it('renders a combobox input', () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    expect(screen.getByRole('combobox')).toBeTruthy()
  })

  it('renders placeholder when empty', () => {
    render(MultiSelect, { props: { label: 'Fruit', options, placeholder: 'Pick fruits…' } })
    expect(screen.getByPlaceholderText('Pick fruits…')).toBeTruthy()
  })

  it('does not show dropdown initially', () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // ── Opening/closing ────────────────────────────────────────────────────────

  it('opens dropdown on click', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    await fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('shows options when open', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    await fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.getByText('Banana')).toBeTruthy()
    expect(screen.getByText('Cherry')).toBeTruthy()
  })

  it('closes dropdown on Escape', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const input = screen.getByRole('combobox')
    await fireEvent.click(input)
    expect(screen.getByRole('listbox')).toBeTruthy()
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes dropdown on click outside', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    await fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeTruthy()
    await fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // ── Selection ──────────────────────────────────────────────────────────────

  it('toggles selection on option click and emits update:modelValue', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: [] },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    await fireEvent.click(screen.getByText('Apple'))
    expect(emitted()['update:modelValue'][0]).toEqual([['apple']])
  })

  it('renders tags for selected values', () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple', 'banana'] },
    })
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.getByText('Banana')).toBeTruthy()
  })

  it('removes value when tag X button is clicked', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple', 'banana'] },
    })
    const removeButtons = screen.getAllByLabelText(/^Remove/)
    await fireEvent.click(removeButtons[0])
    expect(emitted()['update:modelValue'][0]).toEqual([['banana']])
  })

  it('deselects already-selected option on click', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple'] },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    const appleOption = screen.getAllByRole('option')[0]
    await fireEvent.click(appleOption)
    expect(emitted()['update:modelValue'][0]).toEqual([[]])
  })

  // ── Clear all ──────────────────────────────────────────────────────────────

  it('clear button emits empty array', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple', 'banana'] },
    })
    await fireEvent.click(screen.getByLabelText('Clear all'))
    expect(emitted()['update:modelValue'][0]).toEqual([[]])
  })

  it('hides clear button when clearable is false', () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple'], clearable: false },
    })
    expect(screen.queryByLabelText('Clear all')).toBeNull()
  })

  it('hides clear button when no selections', () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: [] },
    })
    expect(screen.queryByLabelText('Clear all')).toBeNull()
  })

  // ── Max selections ─────────────────────────────────────────────────────────

  it('disables unselected options when max reached', async () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple', 'banana'], max: 2 },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    const cherryOption = screen.getByText('Cherry').closest('[role="option"]')!
    expect(cherryOption.getAttribute('aria-disabled')).toBe('true')
  })

  it('allows deselecting when max reached', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple', 'banana'], max: 2 },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    const appleOption = screen.getAllByRole('option')[0]
    await fireEvent.click(appleOption)
    expect(emitted()['update:modelValue'][0]).toEqual([['banana']])
  })

  // ── Search/filter ──────────────────────────────────────────────────────────

  it('filters options by search query', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const input = screen.getByRole('combobox')
    await fireEvent.click(input)
    await fireEvent.update(input, 'app')
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.queryByText('Banana')).toBeNull()
    expect(screen.queryByText('Cherry')).toBeNull()
  })

  it('shows empty state when search matches nothing', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const input = screen.getByRole('combobox')
    await fireEvent.click(input)
    await fireEvent.update(input, 'xyz')
    expect(screen.getByText('No options found')).toBeTruthy()
  })

  it('clears search on close', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const input = screen.getByRole('combobox') as HTMLInputElement
    await fireEvent.click(input)
    await fireEvent.update(input, 'app')
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.value).toBe('')
  })

  // ── Keyboard ───────────────────────────────────────────────────────────────

  it('ArrowDown opens dropdown', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const input = screen.getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('Enter toggles highlighted option', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: [] },
    })
    const input = screen.getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(emitted()['update:modelValue'][0]).toEqual([['apple']])
  })

  it('Backspace removes last tag when search empty', async () => {
    const { emitted } = render(MultiSelect, {
      props: { label: 'Fruit', options, modelValue: ['apple', 'banana'] },
    })
    const input = screen.getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'Backspace' })
    expect(emitted()['update:modelValue'][0]).toEqual([['apple']])
  })

  // ── Field chrome ───────────────────────────────────────────────────────────

  it('renders label with correct for association', () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const label = screen.getByText('Fruit')
    const input = screen.getByRole('combobox')
    expect(label.tagName).toBe('LABEL')
    expect(label.getAttribute('for')).toBe(input.id)
  })

  it('renders error with role="alert"', () => {
    render(MultiSelect, { props: { label: 'Fruit', options, error: 'Required' } })
    expect(screen.getByRole('alert').textContent).toBe('Required')
  })

  it('sets aria-invalid when error is set', () => {
    render(MultiSelect, { props: { label: 'Fruit', options, error: 'Required' } })
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true')
  })

  it('renders description', () => {
    render(MultiSelect, { props: { label: 'Fruit', options, description: 'Pick many' } })
    expect(screen.getByText('Pick many')).toBeTruthy()
  })

  it('links aria-describedby to error and description', () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options, error: 'Required', description: 'Pick one' },
    })
    const input = screen.getByRole('combobox')
    const describedBy = input.getAttribute('aria-describedby')!
    const ids = describedBy.split(' ')
    expect(ids).toHaveLength(2)
    ids.forEach((id) => {
      expect(document.getElementById(id)).toBeTruthy()
    })
  })

  // ── Size modifiers ─────────────────────────────────────────────────────────

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies size-%s class',
    (size) => {
      const { container } = render(MultiSelect, { props: { label: 'Fruit', options, size } })
      expect(container.querySelector(`.lucas-ui-multi-select--size-${size}`)).toBeTruthy()
    },
  )

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('disables input when disabled', () => {
    render(MultiSelect, { props: { label: 'Fruit', options, disabled: true } })
    expect((screen.getByRole('combobox') as HTMLInputElement).disabled).toBe(true)
  })

  it('does not open dropdown when disabled', async () => {
    const { container } = render(MultiSelect, { props: { label: 'Fruit', options, disabled: true } })
    await fireEvent.click(container.querySelector('.lucas-ui-multi-select__control')!)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('applies disabled modifier class', () => {
    const { container } = render(MultiSelect, { props: { label: 'Fruit', options, disabled: true } })
    expect(container.querySelector('.lucas-ui-multi-select__control--disabled')).toBeTruthy()
  })

  // ── Slots ──────────────────────────────────────────────────────────────────

  it('#empty slot renders custom content', async () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options },
      slots: { empty: 'Nothing here!' },
    })
    const input = screen.getByRole('combobox')
    await fireEvent.click(input)
    await fireEvent.update(input, 'zzz')
    expect(screen.getByText('Nothing here!')).toBeTruthy()
  })

  // ── Accessibility warning ──────────────────────────────────────────────────

  describe('accessibility warning', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('warns in dev when no label or aria-label', async () => {
      render(MultiSelect, { props: { options } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('label'))
    })

    it('does not warn when label is provided', async () => {
      render(MultiSelect, { props: { label: 'Fruit', options } })
      await new Promise((r) => setTimeout(r, 0))
      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  // ── ARIA attributes ────────────────────────────────────────────────────────

  it('sets aria-expanded on combobox', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    const input = screen.getByRole('combobox')
    expect(input.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.click(input)
    expect(input.getAttribute('aria-expanded')).toBe('true')
  })

  it('sets aria-multiselectable on listbox', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options } })
    await fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true')
  })

  it('sets aria-selected on options', async () => {
    render(MultiSelect, { props: { label: 'Fruit', options, modelValue: ['apple'] } })
    await fireEvent.click(screen.getByRole('combobox'))
    const opts = screen.getAllByRole('option')
    expect(opts[0].getAttribute('aria-selected')).toBe('true')
    expect(opts[1].getAttribute('aria-selected')).toBe('false')
  })

  // ── Option value as label fallback ─────────────────────────────────────────

  it('renders option value as label when label is not provided', async () => {
    render(MultiSelect, {
      props: { label: 'Fruit', options: [{ value: 'mango' }] },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('mango')).toBeTruthy()
  })
})
