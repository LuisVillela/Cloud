import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Cloud/',   // 👈 el nombre exacto del repo
  plugins: [react()],
})
