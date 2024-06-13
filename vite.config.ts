import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, './src'),
      name: 'ReactDashBoard',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['sass'],
      output: {
        format: 'es',
        globals: {
          sass: 'sass'
        }
      }
    }
  }
})
