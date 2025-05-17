import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // (за потреби) налаштуй базовий шлях, проксі тощо
})