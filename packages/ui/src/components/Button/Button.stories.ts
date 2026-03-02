import type { Meta, StoryObj } from '@storybook/vue3'
import { Button } from '.'
import { IconTrash } from '../../icons'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    color: {
      control: 'select',
      options: ['primary', 'danger', 'success', 'warning', 'neutral'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: {
      control: 'select',
      options: [undefined, 'home', 'save', 'trash'],
    },
    iconPosition: {
      control: 'select',
      options: ['only', 'left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// ── Variants ─────────────────────────────────────────────────────────────────

export const Solid: Story = {
  args: { variant: 'solid', color: 'primary' },
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
}

export const Outline: Story = {
  args: { variant: 'outline', color: 'primary' },
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
}

export const Ghost: Story = {
  args: { variant: 'ghost', color: 'primary' },
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
}

// ── Color × Variant matrix ───────────────────────────────────────────────────

export const Colors: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <Button variant="solid" color="primary">Primary</Button>
          <Button variant="solid" color="danger">Danger</Button>
          <Button variant="solid" color="success">Success</Button>
          <Button variant="solid" color="warning">Warning</Button>
          <Button variant="solid" color="neutral">Neutral</Button>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Button variant="outline" color="primary">Primary</Button>
          <Button variant="outline" color="danger">Danger</Button>
          <Button variant="outline" color="success">Success</Button>
          <Button variant="outline" color="warning">Warning</Button>
          <Button variant="outline" color="neutral">Neutral</Button>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <Button variant="ghost" color="primary">Primary</Button>
          <Button variant="ghost" color="danger">Danger</Button>
          <Button variant="ghost" color="success">Success</Button>
          <Button variant="ghost" color="warning">Warning</Button>
          <Button variant="ghost" color="neutral">Neutral</Button>
        </div>
      </div>
    `,
  }),
}

// ── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Button variant="solid" disabled>Solid</Button>
        <Button variant="outline" disabled>Outline</Button>
        <Button variant="ghost" disabled>Ghost</Button>
      </div>
    `,
  }),
}

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: { variant: 'solid', color: 'primary', loading: true },
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Save changes</Button>`,
  }),
}

export const LoadingAllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Button variant="solid" loading>Saving…</Button>
        <Button variant="outline" loading>Saving…</Button>
        <Button variant="ghost" loading>Saving…</Button>
      </div>
    `,
  }),
}

export const LoadingAllColors: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <Button color="primary" loading>Primary</Button>
        <Button color="danger" loading>Deleting…</Button>
        <Button color="success" loading>Saving…</Button>
        <Button color="warning" loading>Processing…</Button>
        <Button color="neutral" loading>Loading…</Button>
      </div>
    `,
  }),
}

export const LoadingWithIcon: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Button icon="save" icon-position="left" loading>Saving…</Button>
        <Button icon="trash" aria-label="Delete" loading />
      </div>
    `,
  }),
}

// ── Icons ─────────────────────────────────────────────────────────────────────

export const IconOnly: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Button icon="trash" color="danger" aria-label="Delete (solid)" />
        <Button icon="trash" color="danger" variant="outline" aria-label="Delete (outline)" />
        <Button icon="trash" color="danger" variant="ghost" aria-label="Delete (ghost)" />
      </div>
    `,
  }),
}

export const IconLeft: Story = {
  args: { variant: 'solid', color: 'primary', icon: 'save', iconPosition: 'left' },
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Save</Button>`,
  }),
}

export const AllIconPositions: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <Button icon="trash" color="danger" aria-label="Delete" />
        <Button icon="save" icon-position="left">Save</Button>
        <Button icon="save" icon-position="right">Save</Button>
        <Button icon="save" icon-position="top">Save</Button>
        <Button icon="save" icon-position="bottom">Save</Button>
      </div>
    `,
  }),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <Button size="xs" variant="outline">Extra Small</Button>
          <Button size="sm" variant="outline">Small</Button>
          <Button size="md" variant="outline">Medium</Button>
          <Button size="lg" variant="outline">Large</Button>
          <Button size="xl" variant="outline">Extra Large</Button>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <Button size="xs" icon="trash" aria-label="Delete (xs)" />
          <Button size="sm" icon="trash" aria-label="Delete (sm)" />
          <Button size="md" icon="trash" aria-label="Delete (md)" />
          <Button size="lg" icon="trash" aria-label="Delete (lg)" />
          <Button size="xl" icon="trash" aria-label="Delete (xl)" />
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <Button size="xs" icon="save" icon-position="left">Save</Button>
          <Button size="sm" icon="save" icon-position="left">Save</Button>
          <Button size="md" icon="save" icon-position="left">Save</Button>
          <Button size="lg" icon="save" icon-position="left">Save</Button>
          <Button size="xl" icon="save" icon-position="left">Save</Button>
        </div>
      </div>
    `,
  }),
}

export const SizesLoading: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <Button size="xs" loading>XS</Button>
        <Button size="sm" loading>SM</Button>
        <Button size="md" loading>MD</Button>
        <Button size="lg" loading>LG</Button>
        <Button size="xl" loading>XL</Button>
      </div>
    `,
  }),
}

export const CustomIconSlot: Story = {
  render: () => ({
    components: { Button, IconTrash },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <Button color="danger" icon-position="only" aria-label="Delete">
          <template #icon><IconTrash /></template>
        </Button>
        <Button color="danger" icon-position="left">
          <template #icon><IconTrash /></template>
          Delete
        </Button>
      </div>
    `,
  }),
}
