import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import checker from 'vite-plugin-checker';
import path from 'path';

const resolve = (p: string) => path.resolve(__dirname, p);

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve('./src')}/`,
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
    }),

    // Auto import APIs on-demand for Vite
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      dts: resolve('./src/auto-imports.d.ts'),
      imports: ['react', 'react-router-dom'],
      include: [/\.[tj]sx?$/],
      dirs: ['./src/hooks/**/*.ts'],
    }),
  ],
});
