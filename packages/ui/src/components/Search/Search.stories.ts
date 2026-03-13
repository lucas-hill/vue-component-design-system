import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Search } from '.'
import type { SearchProps } from '.'
import type { SearchOption } from '../../types'

const fruitOptions: SearchOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragonfruit', label: 'Dragonfruit' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
]

const meta: Meta<typeof Search> = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    clearOnSelect: { control: 'boolean' },
    noCache: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Search>

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Fruit', options: fruitOptions, placeholder: 'Search fruits…' },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── With Preselected Value ────────────────────────────────────────────────────

export const WithPreselectedValue: Story = {
  args: { label: 'Fruit', options: fruitOptions, placeholder: 'Search fruits…' },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>('cherry')
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── Async Mode ────────────────────────────────────────────────────────────────

export const AsyncMode: Story = {
  args: { label: 'Search Users', placeholder: 'Type to search users…', debounce: 300 },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      const allUsers: SearchOption[] = [
        { value: 1, label: 'Alice Johnson' },
        { value: 2, label: 'Bob Smith' },
        { value: 3, label: 'Charlie Brown' },
        { value: 4, label: 'Diana Prince' },
        { value: 5, label: 'Eve Davis' },
      ]
      const onSearch = async (query: string): Promise<SearchOption[]> => {
        await new Promise((r) => setTimeout(r, 500))
        const q = query.toLowerCase()
        return allUsers.filter((u) => (u.label ?? '').toLowerCase().includes(q))
      }
      return { args, selected, onSearch }
    },
    template: `<Search v-bind="args" v-model="selected" :on-search="onSearch" />`,
  }),
}

// ── With Error ────────────────────────────────────────────────────────────────

export const WithError: Story = {
  args: { label: 'Fruit', options: fruitOptions, error: 'Please select a fruit', placeholder: 'Search fruits…' },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── With Description ──────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: { label: 'Fruit', options: fruitOptions, description: 'Choose your favourite fruit', placeholder: 'Search fruits…' },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { label: 'Fruit', options: fruitOptions, disabled: true, placeholder: 'Search fruits…' },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>('apple')
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { Search },
    setup() {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
      const values = ref<Record<string, string | number | null>>({
        xs: null, sm: null, md: null, lg: null, xl: null,
      })
      return { sizes, values, fruitOptions }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Search
          v-for="size in sizes"
          :key="size"
          :label="size.toUpperCase()"
          :size="size"
          :options="fruitOptions"
          v-model="values[size]"
          :placeholder="'Size ' + size"
        />
      </div>
    `,
  }),
}

// ── With Leading Icon ─────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  args: { label: 'Search', options: fruitOptions, placeholder: 'Search fruits…', leadingIcon: 'home' },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── Min Char Threshold ────────────────────────────────────────────────────────

export const MinCharThreshold: Story = {
  args: { label: 'Search', options: fruitOptions, placeholder: 'Type 3+ characters…', minChars: 3 },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── Clearable ─────────────────────────────────────────────────────────────────

export const Clearable: Story = {
  args: { label: 'Fruit', options: fruitOptions, placeholder: 'Search fruits…', clearable: true },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>('banana')
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── Clear On Select ───────────────────────────────────────────────────────────

export const ClearOnSelect: Story = {
  args: { label: 'Quick Search', options: fruitOptions, placeholder: 'Search and go…', clearOnSelect: true },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `<Search v-bind="args" v-model="selected" />`,
  }),
}

// ── No Cache (Async) ──────────────────────────────────────────────────────────

export const NoCache: Story = {
  args: { label: 'Search Users', placeholder: 'Type to search…', noCache: true, debounce: 200 },
  render: (args: SearchProps) => ({
    components: { Search },
    setup() {
      const selected = ref<string | number | null>(null)
      let callCount = 0
      const allUsers: SearchOption[] = [
        { value: 1, label: 'Alice Johnson' },
        { value: 2, label: 'Bob Smith' },
        { value: 3, label: 'Charlie Brown' },
      ]
      const onSearch = async (query: string): Promise<SearchOption[]> => {
        callCount++
        console.log(`API call #${callCount}: "${query}"`)
        await new Promise((r) => setTimeout(r, 300))
        const q = query.toLowerCase()
        return allUsers.filter((u) => (u.label ?? '').toLowerCase().includes(q))
      }
      return { args, selected, onSearch }
    },
    template: `<Search v-bind="args" v-model="selected" :on-search="onSearch" />`,
  }),
}
