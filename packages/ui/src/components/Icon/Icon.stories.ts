import type { Meta, StoryObj } from '@storybook/vue3'
import { Icon } from '.'
import type { IconProps } from '.'
import { IconHome, IconSave, IconTrash } from '../../icons'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['home', 'save', 'trash'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    label: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const ByName: Story = {
  args: { name: 'home', size: 'md' },
  render: (args: IconProps) => ({
    components: { Icon },
    setup() { return { args } },
    template: `<Icon v-bind="args" />`,
  }),
}

export const AllIcons: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px;">
          <Icon name="home" size="lg" label="Home" />
          <span>home</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px;">
          <Icon name="save" size="lg" label="Save" />
          <span>save</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px;">
          <Icon name="trash" size="lg" label="Trash" />
          <span>trash</span>
        </div>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <Icon name="home" size="sm" label="Home small" />
        <Icon name="home" size="md" label="Home medium" />
        <Icon name="home" size="lg" label="Home large" />
      </div>
    `,
  }),
}

export const CustomViaSlot: Story = {
  render: () => ({
    components: { Icon, IconTrash },
    template: `
      <Icon size="lg" label="Delete item">
        <IconTrash />
      </Icon>
    `,
  }),
}

export const DecorativeNoLabel: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <p style="display: flex; align-items: center; gap: 8px;">
        <Icon name="home" size="md" />
        <span>Home page — icon is decorative, text provides context</span>
      </p>
    `,
  }),
}
