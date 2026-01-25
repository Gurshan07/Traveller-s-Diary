
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        external: [
          'react', 
          'react-dom', 
          'react-dom/client', 
          'react-router-dom', 
          'lucide-react', 
          'recharts'
        ],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM',
            'lucide-react': 'lucide',
            'recharts': 'Recharts'
          }
        }
      }
    },
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
