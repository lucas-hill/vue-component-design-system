import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import Search from './Search.vue'
import type { SearchOption } from '../../types'

const options: SearchOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'blueberry', label: 'Blueberry' },
]

afterEach(cleanup)

async function openDropdown() {
  await fireEvent.click(screen.getByRole('combobox'))
}

describe('Search', () => {
  // ── Core rendering ──────────────────────────────────────────────────────

  it('renders a combobox input', () => {
    render(Search, { props: { label: 'Search', options } })
    expect(screen.getByRole('combobox')).toBeTruthy()
  })

  it('renders placeholder', () => {
    render(Search, { props: { label: 'Search', options, placeholder: 'Type to search…' } })
    expect(screen.getByPlaceholderText('Type to search…')).toBeTruthy()
  })

  it('does not show dropdown initially', () => {
    render(Search, { props: { label: 'Search', options } })
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // ── Open/close ──────────────────────────────────────────────────────────

  it('opens dropdown on click in local mode (openOnFocus defaults true)', async () => {
    render(Search, { props: { label: 'Search', options } })
    await openDropdown()
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('opens dropdown when typing', async () => {
    render(Search, { props: { label: 'Search', options, openOnFocus: false } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'app')
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('closes dropdown on Escape', async () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    await openDropdown()
    expect(screen.getByRole('listbox')).toBeTruthy()
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes dropdown on click outside', async () => {
    render(Search, { props: { label: 'Search', options } })
    await openDropdown()
    expect(screen.getByRole('listbox')).toBeTruthy()
    await fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // ── Local filtering ─────────────────────────────────────────────────────

  it('filters results as user types', async () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'ap')
    const listItems = screen.getAllByRole('option')
    expect(listItems.length).toBe(2) // Apple, Apricot
  })

  it('ranks exact match above starts-with above contains', async () => {
    const opts: SearchOption[] = [
      { value: 1, label: 'Pineapple' },
      { value: 2, label: 'Apple pie' },
      { value: 3, label: 'Apple' },
    ]
    render(Search, { props: { label: 'Search', options: opts } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'apple')
    const listItems = screen.getAllByRole('option')
    expect(listItems[0].textContent).toContain('Apple')
    expect(listItems[1].textContent).toContain('Apple pie')
    expect(listItems[2].textContent).toContain('Pineapple')
  })

  it('shows empty state when no results match', async () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'zzz')
    expect(screen.getByText('No results found')).toBeTruthy()
  })

  // ── Async mode ──────────────────────────────────────────────────────────

  it('calls onSearch with debounce in async mode', async () => {
    vi.useFakeTimers()
    const onSearch = vi.fn().mockResolvedValue([{ value: 'result', label: 'Result' }])
    render(Search, { props: { label: 'Search', onSearch, debounce: 100 } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'test')

    expect(onSearch).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(100)
    expect(onSearch).toHaveBeenCalledWith('test')

    vi.useRealTimers()
  })

  it('shows loading state in async mode', async () => {
    vi.useFakeTimers()
    let resolveSearch: (val: SearchOption[]) => void
    const onSearch = vi.fn().mockImplementation(
      () => new Promise<SearchOption[]>((resolve) => { resolveSearch = resolve }),
    )
    render(Search, { props: { label: 'Search', onSearch, debounce: 0 } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'test')
    await vi.advanceTimersByTimeAsync(0)

    const spinners = document.querySelectorAll('.lucas-ui-search__spinner')
    expect(spinners.length).toBeGreaterThan(0)

    resolveSearch!([{ value: 'a', label: 'A' }])
    await vi.advanceTimersByTimeAsync(0)
    vi.useRealTimers()
  })

  it('renders async results after resolution', async () => {
    const onSearch = vi.fn().mockResolvedValue([
      { value: 'foo', label: 'Foo' },
      { value: 'bar', label: 'Bar' },
    ])
    render(Search, { props: { label: 'Search', onSearch, debounce: 0 } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'f')

    // Wait for debounce (0ms setTimeout) + promise resolution + Vue update
    await new Promise((r) => setTimeout(r, 50))
    await nextTick()

    // Text is split by highlight spans, so use option role
    const opts = screen.getAllByRole('option')
    expect(opts.length).toBe(2)
    expect(opts[0].textContent).toContain('oo') // "Foo" highlighted
    expect(opts[1].textContent).toContain('Bar')
  })

  it('respects minChars in async mode', async () => {
    vi.useFakeTimers()
    const onSearch = vi.fn().mockResolvedValue([])
    render(Search, { props: { label: 'Search', onSearch, debounce: 0, minChars: 3 } })
    const input = screen.getByRole('combobox')
    await fireEvent.update(input, 'ab')
    await vi.advanceTimersByTimeAsync(0)
    expect(onSearch).not.toHaveBeenCalled()

    await fireEvent.update(input, 'abc')
    await vi.advanceTimersByTimeAsync(0)
    expect(onSearch).toHaveBeenCalledWith('abc')
    vi.useRealTimers()
  })

  // ── Caching ─────────────────────────────────────────────────────────────

  it('caches async results by default', async () => {
    vi.useFakeTimers()
    const onSearch = vi.fn().mockResolvedValue([{ value: 'a', label: 'A' }])
    render(Search, { props: { label: 'Search', onSearch, debounce: 0 } })
    const input = screen.getByRole('combobox')

    await fireEvent.update(input, 'test')
    await vi.advanceTimersByTimeAsync(0)
    await vi.runAllTimersAsync()
    expect(onSearch).toHaveBeenCalledTimes(1)

    await fireEvent.update(input, '')
    await fireEvent.update(input, 'test')
    await vi.advanceTimersByTimeAsync(0)
    await vi.runAllTimersAsync()
    expect(onSearch).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('noCache disables caching', async () => {
    vi.useFakeTimers()
    const onSearch = vi.fn().mockResolvedValue([{ value: 'a', label: 'A' }])
    render(Search, { props: { label: 'Search', onSearch, debounce: 0, noCache: true } })
    const input = screen.getByRole('combobox')

    await fireEvent.update(input, 'test')
    await vi.advanceTimersByTimeAsync(0)
    await vi.runAllTimersAsync()
    expect(onSearch).toHaveBeenCalledTimes(1)

    await fireEvent.update(input, '')
    await fireEvent.update(input, 'test')
    await vi.advanceTimersByTimeAsync(0)
    await vi.runAllTimersAsync()
    expect(onSearch).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  // ── Selection ───────────────────────────────────────────────────────────

  it('emits update:modelValue and select on option click', async () => {
    const { emitted } = render(Search, { props: { label: 'Search', options } })
    await openDropdown()
    await fireEvent.click(screen.getByText('Apple'))
    expect(emitted()['update:modelValue'][0]).toEqual(['apple'])
    expect(emitted()['select'][0][0]).toMatchObject({ value: 'apple', label: 'Apple' })
  })

  it('shows selected label in input after selection', async () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox') as HTMLInputElement
    await openDropdown()
    await fireEvent.click(screen.getByText('Apple'))
    expect(input.value).toBe('Apple')
  })

  it('closes dropdown after selection', async () => {
    render(Search, { props: { label: 'Search', options } })
    await openDropdown()
    await fireEvent.click(screen.getByText('Apple'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // ── Clear ───────────────────────────────────────────────────────────────

  it('shows clear button when value is selected', () => {
    render(Search, { props: { label: 'Search', options, modelValue: 'apple' } })
    expect(screen.getByLabelText('Clear')).toBeTruthy()
  })

  it('does not show clear button when no value', () => {
    render(Search, { props: { label: 'Search', options } })
    expect(screen.queryByLabelText('Clear')).toBeNull()
  })

  it('emits null on clear', async () => {
    const { emitted } = render(Search, {
      props: { label: 'Search', options, modelValue: 'apple' },
    })
    await fireEvent.click(screen.getByLabelText('Clear'))
    expect(emitted()['update:modelValue'][0]).toEqual([null])
  })

  it('does not show clear button when clearable is false', () => {
    render(Search, { props: { label: 'Search', options, modelValue: 'apple', clearable: false } })
    expect(screen.queryByLabelText('Clear')).toBeNull()
  })

  // ── clearOnSelect ───────────────────────────────────────────────────────

  it('clears input text after selection when clearOnSelect is true', async () => {
    render(Search, { props: { label: 'Search', options, clearOnSelect: true } })
    const input = screen.getByRole('combobox') as HTMLInputElement
    await openDropdown()
    await fireEvent.click(screen.getByText('Apple'))
    expect(input.value).toBe('')
  })

  // ── Keyboard ────────────────────────────────────────────────────────────

  it('ArrowDown opens dropdown and highlights first option', async () => {
    render(Search, { props: { label: 'Search', options, openOnFocus: false } })
    const input = screen.getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeTruthy()
    const firstOption = screen.getAllByRole('option')[0]
    expect(firstOption.classList.contains('lucas-ui-search__option--active')).toBe(true)
  })

  it('ArrowDown wraps from last to first', async () => {
    const shortOptions: SearchOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]
    render(Search, { props: { label: 'Search', options: shortOptions } })
    const input = screen.getByRole('combobox')
    await openDropdown()
    await fireEvent.keyDown(input, { key: 'ArrowDown' }) // index 0
    await fireEvent.keyDown(input, { key: 'ArrowDown' }) // index 1
    await fireEvent.keyDown(input, { key: 'ArrowDown' }) // wrap to 0
    const opts = screen.getAllByRole('option')
    expect(opts[0].classList.contains('lucas-ui-search__option--active')).toBe(true)
  })

  it('Enter selects highlighted option', async () => {
    const { emitted } = render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    await openDropdown()
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(emitted()['update:modelValue'][0]).toEqual(['apple'])
  })

  it('Escape closes and restores input to selected label', async () => {
    render(Search, { props: { label: 'Search', options, modelValue: 'apple' } })
    const input = screen.getByRole('combobox') as HTMLInputElement
    await openDropdown()
    await fireEvent.update(input, 'ban')
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(input.value).toBe('Apple')
  })

  it('Home highlights first option, End highlights last', async () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    await openDropdown()
    await fireEvent.keyDown(input, { key: 'End' })
    const opts = screen.getAllByRole('option')
    expect(opts[opts.length - 1].classList.contains('lucas-ui-search__option--active')).toBe(true)
    await fireEvent.keyDown(input, { key: 'Home' })
    expect(opts[0].classList.contains('lucas-ui-search__option--active')).toBe(true)
  })

  // ── Field chrome ────────────────────────────────────────────────────────

  it('renders label with for attribute', () => {
    render(Search, { props: { label: 'Search Fruits', options } })
    const label = screen.getByText('Search Fruits')
    const input = screen.getByRole('combobox')
    expect(label.getAttribute('for')).toBe(input.id)
  })

  it('renders error with aria-invalid', () => {
    render(Search, { props: { label: 'Search', options, error: 'Required' } })
    expect(screen.getByText('Required')).toBeTruthy()
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true')
  })

  it('renders description', () => {
    render(Search, { props: { label: 'Search', options, description: 'Search for a fruit' } })
    expect(screen.getByText('Search for a fruit')).toBeTruthy()
  })

  // ── Size modifiers ──────────────────────────────────────────────────────

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies size-%s class', (size) => {
    const { container } = render(Search, { props: { label: 'Search', options, size } })
    expect(container.querySelector(`.lucas-ui-search--size-${size}`)).toBeTruthy()
  })

  // ── Disabled ────────────────────────────────────────────────────────────

  it('disables input when disabled', () => {
    render(Search, { props: { label: 'Search', options, disabled: true } })
    expect((screen.getByRole('combobox') as HTMLInputElement).disabled).toBe(true)
  })

  it('does not open dropdown when disabled', async () => {
    render(Search, { props: { label: 'Search', options, disabled: true } })
    await fireEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // ── Dev warnings ────────────────────────────────────────────────────────

  it('warns when no label or aria-label', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(Search, { props: { options } })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[Search] Missing'))
    warnSpy.mockRestore()
  })

  it('warns when both options and onSearch are provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onSearch = vi.fn().mockResolvedValue([])
    render(Search, { props: { label: 'Search', options, onSearch } })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Both `options` and `onSearch`'))
    warnSpy.mockRestore()
  })

  it('warns when neither options nor onSearch provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(Search, { props: { label: 'Search' } })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Neither `options` nor `onSearch`'))
    warnSpy.mockRestore()
  })

  // ── ARIA attributes ─────────────────────────────────────────────────────

  it('sets combobox ARIA attributes', () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    expect(input.getAttribute('aria-haspopup')).toBe('listbox')
    expect(input.getAttribute('aria-expanded')).toBe('false')
    expect(input.getAttribute('aria-autocomplete')).toBe('list')
    expect(input.getAttribute('autocomplete')).toBe('off')
  })

  it('updates aria-expanded when open', async () => {
    render(Search, { props: { label: 'Search', options } })
    const input = screen.getByRole('combobox')
    await openDropdown()
    expect(input.getAttribute('aria-expanded')).toBe('true')
  })
})
