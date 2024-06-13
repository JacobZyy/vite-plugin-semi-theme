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
      external: ['sass', 'node:path', 'node:url', 'node:os', 'node:fs'],
      output: {
        format: 'es',
        globals: {
          sass: 'sass',
          node: 'node',
          'node:path': 'node:path',
          'node:url': 'node:url',
          'node:os': 'node:os',
          'node:fs': 'node:fs'
        }
      }
    }
  }
})
