import type { Meta, StoryObj } from '@storybook/vue3'
import { TextArea } from '.'
import type { TextAreaProps } from '.'

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof TextArea>

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Bio', placeholder: 'Tell us about yourself…' },
  render: (args: TextAreaProps) => ({
    components: { TextArea },
    setup() { return { args } },
    template: `<TextArea v-bind="args" />`,
  }),
}

// ── With Description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: { label: 'Bio', placeholder: 'Tell us about yourself…', description: 'Max 500 characters' },
  render: (args: TextAreaProps) => ({
    components: { TextArea },
    setup() { return { args } },
    template: `<TextArea v-bind="args" />`,
  }),
}

// ── With Error ───────────────────────────────────────────────────────────────

export const WithError: Story = {
  args: { label: 'Bio', modelValue: 'x', error: 'Must be at least 10 characters' },
  render: (args: TextAreaProps) => ({
    components: { TextArea },
    setup() { return { args } },
    template: `<TextArea v-bind="args" />`,
  }),
}

// ── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { label: 'Bio', modelValue: 'Cannot edit this', disabled: true },
  render: (args: TextAreaProps) => ({
    components: { TextArea },
    setup() { return { args } },
    template: `<TextArea v-bind="args" />`,
  }),
}

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { TextArea },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <TextArea label="Extra Small" size="xs" placeholder="xs" :rows="2" />
        <TextArea label="Small" size="sm" placeholder="sm" :rows="2" />
        <TextArea label="Medium" size="md" placeholder="md" :rows="2" />
        <TextArea label="Large" size="lg" placeholder="lg" :rows="2" />
        <TextArea label="Extra Large" size="xl" placeholder="xl" :rows="2" />
      </div>
    `,
  }),
}

// ── Resize Options ───────────────────────────────────────────────────────────

export const ResizeOptions: Story = {
  render: () => ({
    components: { TextArea },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <TextArea label="None" resize="none" placeholder="Cannot resize" :rows="2" />
        <TextArea label="Vertical (default)" resize="vertical" placeholder="Vertical only" :rows="2" />
        <TextArea label="Horizontal" resize="horizontal" placeholder="Horizontal only" :rows="2" />
        <TextArea label="Both" resize="both" placeholder="Both directions" :rows="2" />
      </div>
    `,
  }),
}
