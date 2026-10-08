import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // 5173 belongs to the student client (its origin is baked into the reset-email
  // link), so the admin panel is pinned to 5174 — still inside the server's CORS
  // list. strictPort makes a port clash fail loudly instead of shifting ports.
  server: {
    port: 5174,
    strictPort: true,
  },
})
