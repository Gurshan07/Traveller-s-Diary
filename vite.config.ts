
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        'react-dom/client', 
        'react-router-dom', 
        'lucide-react', 
        'recharts', 
        '@google/genai'
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          'lucide-react': 'lucide',
          'recharts': 'Recharts',
          '@google/genai': 'GoogleGenAI'
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
});
