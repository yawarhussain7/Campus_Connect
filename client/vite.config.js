import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // The password-reset email hardcodes this origin (CLIENT_URL in server/.env),
  // so the student app must always own 5173. Without strictPort Vite silently
  // falls back to 5174 when the admin panel grabs 5173 first, and reset links
  // then open the wrong app.
  server: {
    port: 5173,
    strictPort: true,
  },
})
