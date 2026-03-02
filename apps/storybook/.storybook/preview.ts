import type { Preview } from '@storybook/vue3'
import { computed } from 'vue'
import '@vue-design-system/theme-default/tokens.css'
import '@vue-design-system/theme-dark/tokens.css'

const preview: Preview = {
    globalTypes: {
        theme: {
            name: 'Theme',
            defaultValue: 'default',
            toolbar: {
                icon: 'paintbrush',
                items: [
                    { value: 'default', title: 'Default' },
                    { value: 'dark', title: 'Dark' },
                ],
                dynamicTitle: true,
            },
        },
    },
    decorators: [
        (story, context) => ({
            components: { story: story() },
            setup() {
                const theme = computed(() => context.globals.theme)
                return { theme }
            },
            template: `
                <div :data-theme="theme" style="padding: 1.5rem; min-height: 100vh;">
                    <story />
                </div>
            `,
        }),
    ],
}

export default preview
