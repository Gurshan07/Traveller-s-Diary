import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/game_record': {
        target: 'https://ho-yo-lab-api-interface.vercel.app',
        changeOrigin: true,
      },
    },
  },
});