import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@vue-design-system/ui': path.resolve(__dirname, '../packages/ui/src/index.ts'),
        },
    },
})
