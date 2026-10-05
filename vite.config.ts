import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * The Spring Boot backend that /api is proxied to (same-origin API calls in development). Parallel dev or test
 * runs point a private dev server at a private backend with AGRISCAN_API_TARGET and give it its own dependency
 * cache with AGRISCAN_VITE_CACHE_DIR.
 */
const apiTarget = process.env.AGRISCAN_API_TARGET ?? 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: process.env.AGRISCAN_VITE_CACHE_DIR ?? 'node_modules/.vite',
  server: {
    port: 5173,
    proxy: {
      '/api': apiTarget,
    },
  },
})
