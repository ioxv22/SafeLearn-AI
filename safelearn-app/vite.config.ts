import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://de3.bot-hosting.net:21007/kilwa-chat',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '')
      },
      '/api/video': {
        target: 'http://de3.bot-hosting.net:21007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/video/, '/kilwa-video')
      }
    }
  }
})
