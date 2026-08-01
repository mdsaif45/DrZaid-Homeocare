import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Build config for the standalone landing page deployed to GitHub Pages.
 *
 * Kept separate from vite.config.ts so the main SPA build (which needs the API
 * proxy and serves from root) stays untouched. Entry is index.landing.html.
 *
 * BASE_PATH lets the same config serve a project page (/dr-zaid-homeocare/), a
 * user page or custom domain (/), and local preview.
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/dr-zaid-homeocare/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-landing',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.landing.html'),
    },
  },
})
