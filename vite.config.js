import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // describe, it y expect sin importarlos en cada archivo
    environment: 'jsdom',
    setupFiles: './setupTests.js',
  },
})
