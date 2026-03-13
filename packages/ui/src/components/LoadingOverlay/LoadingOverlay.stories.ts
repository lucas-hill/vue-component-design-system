import type { Meta, StoryObj } from '@storybook/vue3'
import { LoadingOverlay } from '.'
import type { LoadingOverlayProps } from '.'

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Components/LoadingOverlay',
  component: LoadingOverlay,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    label: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof LoadingOverlay>

// Wrapper styles used across stories to demonstrate the overlay in context
const containerStyle = 'position: relative; display: inline-flex; align-items: center; justify-content: center;'

export const Default: Story = {
  args: { size: 'md' },
  render: (args: LoadingOverlayProps) => ({
    components: { LoadingOverlay },
    setup() { return { args } },
    template: `
      <div style="${containerStyle} width: 120px; height: 48px; background: #2563eb; border-radius: 6px; color: #fff;">
        <span style="opacity: 0.35;">Save changes</span>
        <LoadingOverlay v-bind="args" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { LoadingOverlay },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="${containerStyle} width: 80px; height: 40px; background: #2563eb; border-radius: 6px; color: #fff;">
          <LoadingOverlay size="sm" />
        </div>
        <div style="${containerStyle} width: 120px; height: 48px; background: #2563eb; border-radius: 6px; color: #fff;">
          <LoadingOverlay size="md" />
        </div>
        <div style="${containerStyle} width: 160px; height: 56px; background: #2563eb; border-radius: 6px; color: #fff;">
          <LoadingOverlay size="lg" />
        </div>
        <div style="${containerStyle} width: 240px; height: 160px; background: #f3f4f6; border-radius: 8px; color: #2563eb; border: 1px solid #e5e7eb;">
          <span style="opacity: 0.35;">Card content</span>
          <LoadingOverlay size="xl" />
        </div>
      </div>
    `,
  }),
}

export const OnDifferentColors: Story = {
  render: () => ({
    components: { LoadingOverlay },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="${containerStyle} width: 120px; height: 48px; background: #2563eb; border-radius: 6px; color: #fff;">
          <span style="opacity: 0.35;">Primary</span>
          <LoadingOverlay />
        </div>
        <div style="${containerStyle} width: 120px; height: 48px; background: #dc2626; border-radius: 6px; color: #fff;">
          <span style="opacity: 0.35;">Danger</span>
          <LoadingOverlay />
        </div>
        <div style="${containerStyle} width: 120px; height: 48px; background: #16a34a; border-radius: 6px; color: #fff;">
          <span style="opacity: 0.35;">Success</span>
          <LoadingOverlay />
        </div>
        <div style="${containerStyle} width: 120px; height: 48px; background: transparent; border: 1px solid #2563eb; border-radius: 6px; color: #2563eb;">
          <span style="opacity: 0.35;">Outline</span>
          <LoadingOverlay />
        </div>
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  args: { size: 'xl', label: 'Loading card content, please wait' },
  render: (args: LoadingOverlayProps) => ({
    components: { LoadingOverlay },
    setup() { return { args } },
    template: `
      <div style="${containerStyle} width: 320px; height: 200px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; color: #2563eb;">
        <p style="opacity: 0.35; margin: 0;">Article content here…</p>
        <LoadingOverlay v-bind="args" />
      </div>
    `,
  }),
}
