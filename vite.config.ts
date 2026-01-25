
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize system environment variable (Vercel) over .env file
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // JSON.stringify is crucial here to wrap the string value in quotes for the JS output
      'process.env.API_KEY': JSON.stringify(apiKey),
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
  };
});
