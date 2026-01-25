
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // Removed external configuration.
    // We want Vite to bundle React and other dependencies to ensure a single instance of React is used.
    // This fixes "Cannot read properties of null (reading 'useRef')" errors.
    server: {
      proxy: {
        '/api/game_record': {
          target: 'https://ho-yo-lab-api-interface.vercel.app',
          changeOrigin: true,
        },
      },
    },
  };
});
