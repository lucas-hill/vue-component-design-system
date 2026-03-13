import type { Meta, StoryObj } from '@storybook/vue3'
import { Select } from '.'
import type { SelectProps } from '.'

const sampleOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragonfruit', label: 'Dragonfruit' },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Fruit', options: sampleOptions, placeholder: 'Pick a fruit…' },
  render: (args: SelectProps) => ({
    components: { Select },
    setup() { return { args } },
    template: `<Select v-bind="args" />`,
  }),
}

// ── With Description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: { label: 'Fruit', options: sampleOptions, placeholder: 'Pick a fruit…', description: 'Choose your favourite' },
  render: (args: SelectProps) => ({
    components: { Select },
    setup() { return { args } },
    template: `<Select v-bind="args" />`,
  }),
}

// ── With Error ───────────────────────────────────────────────────────────────

export const WithError: Story = {
  args: { label: 'Fruit', options: sampleOptions, error: 'Selection is required' },
  render: (args: SelectProps) => ({
    components: { Select },
    setup() { return { args } },
    template: `<Select v-bind="args" />`,
  }),
}

// ── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { label: 'Fruit', options: sampleOptions, modelValue: 'banana', disabled: true },
  render: (args: SelectProps) => ({
    components: { Select },
    setup() { return { args } },
    template: `<Select v-bind="args" />`,
  }),
}

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { Select },
    setup() { return { options: sampleOptions } },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px;">
        <Select label="Extra Small" size="xs" :options="options" placeholder="xs" />
        <Select label="Small" size="sm" :options="options" placeholder="sm" />
        <Select label="Medium" size="md" :options="options" placeholder="md" />
        <Select label="Large" size="lg" :options="options" placeholder="lg" />
        <Select label="Extra Large" size="xl" :options="options" placeholder="xl" />
      </div>
    `,
  }),
}

// ── With Disabled Options ────────────────────────────────────────────────────

export const WithDisabledOptions: Story = {
  render: () => ({
    components: { Select },
    setup() {
      return {
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana', disabled: true },
          { value: 'cherry', label: 'Cherry' },
        ],
      }
    },
    template: `<Select label="Fruit" :options="options" placeholder="Pick a fruit…" />`,
  }),
}

// ── Numeric Values ───────────────────────────────────────────────────────────

export const NumericValues: Story = {
  render: () => ({
    components: { Select },
    setup() {
      return {
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
      }
    },
    template: `<Select label="Number" :options="options" placeholder="Pick a number…" />`,
  }),
}
