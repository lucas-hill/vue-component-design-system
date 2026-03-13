import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { MultiSelect } from '.'
import type { MultiSelectProps } from '.'

const sampleOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragonfruit', label: 'Dragonfruit' },
  { value: 'elderberry', label: 'Elderberry' },
]

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof MultiSelect>

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Fruits', options: sampleOptions, placeholder: 'Select fruits…' },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}

// ── With Preselected Values ──────────────────────────────────────────────────

export const WithPreselectedValues: Story = {
  args: { label: 'Fruits', options: sampleOptions, placeholder: 'Select fruits…' },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>(['apple', 'cherry'])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}

// ── With Error ───────────────────────────────────────────────────────────────

export const WithError: Story = {
  args: { label: 'Fruits', options: sampleOptions, error: 'At least one fruit is required' },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}

// ── With Description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: { label: 'Fruits', options: sampleOptions, description: 'Choose your favourite fruits', placeholder: 'Select fruits…' },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}

// ── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { label: 'Fruits', options: sampleOptions, disabled: true },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>(['apple', 'banana'])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const options = sampleOptions
      const xs = ref(['apple'])
      const sm = ref(['apple'])
      const md = ref(['apple'])
      const lg = ref(['apple'])
      const xl = ref(['apple'])
      return { options, xs, sm, md, lg, xl }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <MultiSelect label="Extra Small" size="xs" :options="options" v-model="xs" />
        <MultiSelect label="Small" size="sm" :options="options" v-model="sm" />
        <MultiSelect label="Medium" size="md" :options="options" v-model="md" />
        <MultiSelect label="Large" size="lg" :options="options" v-model="lg" />
        <MultiSelect label="Extra Large" size="xl" :options="options" v-model="xl" />
      </div>
    `,
  }),
}

// ── Disabled Options ─────────────────────────────────────────────────────────

export const DisabledOptions: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana', disabled: true },
        { value: 'cherry', label: 'Cherry' },
        { value: 'dragonfruit', label: 'Dragonfruit', disabled: true },
      ]
      return { selected, options }
    },
    template: `<MultiSelect label="Fruits" :options="options" v-model="selected" placeholder="Some options disabled…" />`,
  }),
}

// ── Max Selections ───────────────────────────────────────────────────────────

export const MaxSelections: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      return { selected, options: sampleOptions }
    },
    template: `<MultiSelect label="Fruits (max 3)" :options="options" v-model="selected" :max="3" placeholder="Pick up to 3…" />`,
  }),
}

// ── Search Filtering ─────────────────────────────────────────────────────────

export const SearchFiltering: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'apricot', label: 'Apricot' },
        { value: 'banana', label: 'Banana' },
        { value: 'blueberry', label: 'Blueberry' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'coconut', label: 'Coconut' },
        { value: 'dragonfruit', label: 'Dragonfruit' },
        { value: 'elderberry', label: 'Elderberry' },
        { value: 'fig', label: 'Fig' },
        { value: 'grape', label: 'Grape' },
        { value: 'guava', label: 'Guava' },
        { value: 'kiwi', label: 'Kiwi' },
        { value: 'lemon', label: 'Lemon' },
        { value: 'mango', label: 'Mango' },
        { value: 'orange', label: 'Orange' },
        { value: 'papaya', label: 'Papaya' },
      ]
      return { selected, options }
    },
    template: `<MultiSelect label="Fruits" :options="options" v-model="selected" placeholder="Search and select…" />`,
  }),
}

// ── No Search ────────────────────────────────────────────────────────────────

export const NoSearch: Story = {
  args: { label: 'Fruits', options: sampleOptions, searchable: false, placeholder: 'Select fruits…' },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>([])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}

// ── No Clear ─────────────────────────────────────────────────────────────────

export const NoClear: Story = {
  args: { label: 'Fruits', options: sampleOptions, clearable: false },
  render: (args: MultiSelectProps) => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<(string | number)[]>(['apple', 'banana'])
      return { args, selected }
    },
    template: `<MultiSelect v-bind="args" v-model="selected" />`,
  }),
}
