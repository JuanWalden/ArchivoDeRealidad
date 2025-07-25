import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: { // Añade este bloque
    outDir: 'docs', // Esto cambiará la carpeta de salida de 'dist' a 'docs'
  },
});
