/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // fail loudly if 5173 is taken, never wander to 5174
    open: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
