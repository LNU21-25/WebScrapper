import { defineConfig } from 'vite'

export default defineConfig({
  root: './src', // Ensures Vite looks for `src/index.html`
  build: {
    outDir: '../dist', // Outputs build files to `dist/`
    emptyOutDir: true
  },
  server: {
    open: true // Automatically open the app in the browser
  }
})
