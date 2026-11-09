import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative assets so the app works on GitHub Pages project URLs.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS && !process.env.VERCEL ? './' : '/',
  plugins: [react()],
})
