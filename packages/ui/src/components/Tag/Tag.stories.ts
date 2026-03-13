import type { Meta, StoryObj } from '@storybook/vue3'
import { Tag } from '.'
import type { TagProps } from '.'
import { IconTrash } from '../../icons'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'],
    },
    color: {
      control: 'select',
      options: ['primary', 'danger', 'success', 'warning', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    pill: { control: 'boolean' },
    closable: { control: 'boolean' },
    icon: {
      control: 'select',
      options: [undefined, 'home', 'save', 'trash'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Tag>

// ── Default (interactive) ───────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: 'subtle', color: 'neutral' },
  render: (args: TagProps) => ({
    components: { Tag },
    setup() { return { args } },
    template: `<Tag v-bind="args">Label</Tag>`,
  }),
}

// ── Variants ────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Tag variant="solid" color="primary">Solid</Tag>
        <Tag variant="subtle" color="primary">Subtle</Tag>
        <Tag variant="outline" color="primary">Outline</Tag>
      </div>
    `,
  }),
}

// ── Colors ──────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="solid" color="primary">Primary</Tag>
          <Tag variant="solid" color="danger">Danger</Tag>
          <Tag variant="solid" color="success">Success</Tag>
          <Tag variant="solid" color="warning">Warning</Tag>
          <Tag variant="solid" color="neutral">Neutral</Tag>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="subtle" color="primary">Primary</Tag>
          <Tag variant="subtle" color="danger">Danger</Tag>
          <Tag variant="subtle" color="success">Success</Tag>
          <Tag variant="subtle" color="warning">Warning</Tag>
          <Tag variant="subtle" color="neutral">Neutral</Tag>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="outline" color="primary">Primary</Tag>
          <Tag variant="outline" color="danger">Danger</Tag>
          <Tag variant="outline" color="success">Success</Tag>
          <Tag variant="outline" color="warning">Warning</Tag>
          <Tag variant="outline" color="neutral">Neutral</Tag>
        </div>
      </div>
    `,
  }),
}

// ── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Tag size="xs">Extra Small</Tag>
        <Tag size="sm">Small</Tag>
        <Tag size="md">Medium</Tag>
        <Tag size="lg">Large</Tag>
        <Tag size="xl">Extra Large</Tag>
      </div>
    `,
  }),
}

// ── Pill ────────────────────────────────────────────────────────────────────

export const Pill: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Tag pill size="xs">Extra Small</Tag>
        <Tag pill size="sm">Small</Tag>
        <Tag pill size="md">Medium</Tag>
        <Tag pill size="lg">Large</Tag>
        <Tag pill size="xl">Extra Large</Tag>
      </div>
    `,
  }),
}

// ── Pill vs Default ─────────────────────────────────────────────────────────

export const PillVsDefault: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag color="primary">Default</Tag>
          <Tag color="primary" pill>Pill</Tag>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="solid" color="success">Default</Tag>
          <Tag variant="solid" color="success" pill>Pill</Tag>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="outline" color="danger">Default</Tag>
          <Tag variant="outline" color="danger" pill>Pill</Tag>
        </div>
      </div>
    `,
  }),
}

// ── Closable ────────────────────────────────────────────────────────────────

export const Closable: Story = {
  render: () => ({
    components: { Tag },
    setup() {
      const onClose = () => console.log('Tag closed')
      return { onClose }
    },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Tag closable color="primary" @close="onClose">Closable</Tag>
        <Tag closable color="danger" variant="solid" @close="onClose">Closable</Tag>
        <Tag closable color="success" variant="outline" @close="onClose">Closable</Tag>
      </div>
    `,
  }),
}

// ── With Icon ───────────────────────────────────────────────────────────────

export const WithIcon: Story = {
  render: () => ({
    components: { Tag, IconTrash },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Tag icon="home" color="primary">Home</Tag>
        <Tag icon="save" color="success" variant="solid">Saved</Tag>
        <Tag icon="trash" color="danger" variant="outline" closable>Delete</Tag>
        <Tag color="warning" variant="subtle">
          <template #icon><IconTrash /></template>
          Custom Icon
        </Tag>
      </div>
    `,
  }),
}

// ── Colors × Closable ───────────────────────────────────────────────────────

export const ColorsClosable: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="solid" color="primary" closable>Primary</Tag>
          <Tag variant="solid" color="danger" closable>Danger</Tag>
          <Tag variant="solid" color="success" closable>Success</Tag>
          <Tag variant="solid" color="warning" closable>Warning</Tag>
          <Tag variant="solid" color="neutral" closable>Neutral</Tag>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="subtle" color="primary" closable>Primary</Tag>
          <Tag variant="subtle" color="danger" closable>Danger</Tag>
          <Tag variant="subtle" color="success" closable>Success</Tag>
          <Tag variant="subtle" color="warning" closable>Warning</Tag>
          <Tag variant="subtle" color="neutral" closable>Neutral</Tag>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Tag variant="outline" color="primary" closable>Primary</Tag>
          <Tag variant="outline" color="danger" closable>Danger</Tag>
          <Tag variant="outline" color="success" closable>Success</Tag>
          <Tag variant="outline" color="warning" closable>Warning</Tag>
          <Tag variant="outline" color="neutral" closable>Neutral</Tag>
        </div>
      </div>
    `,
  }),
}
