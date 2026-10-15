import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssTarget: 'safari15',
    sourcemap: false,
    rollupOptions: {
      output: {
        // three.js живёт в отдельном чанке: он грузится только когда
        // на экране появляется 3D-сцена первого экрана.
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) return 'form';
        },
      },
    },
  },
});
