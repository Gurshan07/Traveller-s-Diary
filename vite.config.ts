
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cast process to any to resolve TypeScript error regarding cwd property
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/game_record': {
          target: 'https://ho-yo-lab-api-interface.vercel.app',
          changeOrigin: true,
        },
      },
    }
  };
});
