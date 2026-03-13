import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// process.cwd() = apps/storybook/ when run via npm workspace
const uiSrc = resolve(process.cwd(), '../../packages/ui/src')

const config: StorybookConfig = {
    stories: [`${uiSrc}/**/*.stories.@(ts|tsx)`],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    async viteFinal(config) {
        config.plugins ??= []
        config.plugins.push(vue())

        config.resolve ??= {}
        config.resolve.alias = {
            ...config.resolve.alias,
            '@vue-design-system/ui': resolve(uiSrc, 'index.ts'),
            '@vue-design-system/theme-forest': resolve(process.cwd(), '../../packages/theme-forest'),
            '@vue-design-system/theme-forest-dark': resolve(process.cwd(), '../../packages/theme-forest-dark'),
        }
        return config
    },
}

export default config
