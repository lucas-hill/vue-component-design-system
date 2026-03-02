import type { Meta, StoryObj } from '@storybook/vue3'
import { Button } from '.'

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['solid', 'outline', 'ghost'],
        },
        disabled: {
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof Button>

export const Solid: Story = {
    args: { variant: 'solid', disabled: false },
    render: (args) => ({
        components: { Button },
        setup() { return { args } },
        template: `<Button v-bind="args">Click me</Button>`,
    }),
}

export const Outline: Story = {
    args: { variant: 'outline', disabled: false },
    render: (args) => ({
        components: { Button },
        setup() { return { args } },
        template: `<Button v-bind="args">Click me</Button>`,
    }),
}

export const Ghost: Story = {
    args: { variant: 'ghost', disabled: false },
    render: (args) => ({
        components: { Button },
        setup() { return { args } },
        template: `<Button v-bind="args">Click me</Button>`,
    }),
}

export const Disabled: Story = {
    args: { variant: 'solid', disabled: true },
    render: (args) => ({
        components: { Button },
        setup() { return { args } },
        template: `<Button v-bind="args">Click me</Button>`,
    }),
}
