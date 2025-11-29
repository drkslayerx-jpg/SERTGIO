import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Garante que process.env.API_KEY seja substituído pelo valor real durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
        },
      },
    },
  };
});