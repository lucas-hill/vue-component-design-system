import type { Meta, StoryObj } from '@storybook/vue3'
import { ButtonGroup } from '.'
import { Button } from '../Button'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    label: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

// ── Variants ─────────────────────────────────────────────────────────────────

export const SolidHorizontal: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup label="View options">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    `,
  }),
}

export const OutlineHorizontal: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup label="Text alignment">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    `,
  }),
}

export const GhostHorizontal: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup label="Zoom controls">
        <Button variant="ghost">−</Button>
        <Button variant="ghost">100%</Button>
        <Button variant="ghost">+</Button>
      </ButtonGroup>
    `,
  }),
}

// ── Vertical orientation ──────────────────────────────────────────────────────

export const SolidVertical: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup label="File actions" orientation="vertical">
        <Button>New</Button>
        <Button>Open</Button>
        <Button>Save</Button>
      </ButtonGroup>
    `,
  }),
}

export const OutlineVertical: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup label="Sort order" orientation="vertical">
        <Button variant="outline">Ascending</Button>
        <Button variant="outline">Descending</Button>
      </ButtonGroup>
    `,
  }),
}

// ── Colors ────────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <ButtonGroup label="Primary actions">
          <Button color="primary">Save</Button>
          <Button color="primary">Save as…</Button>
        </ButtonGroup>
        <ButtonGroup label="Danger actions">
          <Button color="danger">Delete</Button>
          <Button color="danger">Delete all</Button>
        </ButtonGroup>
        <ButtonGroup label="Mixed actions" variant="outline">
          <Button variant="outline" color="success">Approve</Button>
          <Button variant="outline" color="danger">Reject</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

// ── With icons ────────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
        <ButtonGroup label="Document actions">
          <Button icon="save" icon-position="left" variant="outline">Save</Button>
          <Button icon="trash" icon-position="left" variant="outline" color="danger">Delete</Button>
        </ButtonGroup>
        <ButtonGroup label="Icon-only actions">
          <Button icon="home" variant="outline" aria-label="Home" />
          <Button icon="save" variant="outline" aria-label="Save" />
          <Button icon="trash" variant="outline" color="danger" aria-label="Delete" />
        </ButtonGroup>
      </div>
    `,
  }),
}

// ── Loading state in a group ──────────────────────────────────────────────────

export const WithLoading: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <ButtonGroup label="File actions">
          <Button icon="save" icon-position="left" :loading="true">Saving…</Button>
          <Button>Discard</Button>
        </ButtonGroup>
        <ButtonGroup label="File actions (outline)" >
          <Button variant="outline" icon="save" icon-position="left" :loading="true">Saving…</Button>
          <Button variant="outline">Discard</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

// ── Single button (edge case) ─────────────────────────────────────────────────

export const SingleButton: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup label="Single action">
        <Button>Only button</Button>
      </ButtonGroup>
    `,
  }),
}
