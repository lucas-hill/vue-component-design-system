import type { Meta, StoryObj } from '@storybook/vue3'
import { TextInput } from '.'
import type { TextInputProps } from '.'

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'tel', 'search', 'number'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    leadingIcon: {
      control: 'select',
      options: [undefined, 'home', 'save', 'trash'],
    },
    trailingIcon: {
      control: 'select',
      options: [undefined, 'home', 'save', 'trash'],
    },
  },
}

export default meta
type Story = StoryObj<typeof TextInput>

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Full name', placeholder: 'Enter your name' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

// ── With Description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: { label: 'Full name', placeholder: 'Enter your name', description: 'As it appears on your ID' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

// ── With Error ───────────────────────────────────────────────────────────────

export const WithError: Story = {
  args: { label: 'Email', type: 'email', modelValue: 'not-an-email', error: 'Please enter a valid email address' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

// ── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { label: 'Full name', modelValue: 'Jane Doe', disabled: true },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { TextInput },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px;">
        <TextInput label="Extra Small" size="xs" placeholder="xs" />
        <TextInput label="Small" size="sm" placeholder="sm" />
        <TextInput label="Medium" size="md" placeholder="md" />
        <TextInput label="Large" size="lg" placeholder="lg" />
        <TextInput label="Extra Large" size="xl" placeholder="xl" />
      </div>
    `,
  }),
}

// ── With Icons ───────────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  args: { label: 'Search', placeholder: 'Search…', leadingIcon: 'home' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

export const WithTrailingIcon: Story = {
  args: { label: 'Search', placeholder: 'Search…', trailingIcon: 'save' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

export const WithBothIcons: Story = {
  args: { label: 'Search', placeholder: 'Search…', leadingIcon: 'home', trailingIcon: 'save' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}

// ── Input Types ──────────────────────────────────────────────────────────────

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: 'Enter password' },
  render: (args: TextInputProps) => ({
    components: { TextInput },
    setup() { return { args } },
    template: `<TextInput v-bind="args" />`,
  }),
}
