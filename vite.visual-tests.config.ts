import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: path.resolve(import.meta.dirname, 'src/visual-tests'),
  base: './',
  publicDir: path.resolve(import.meta.dirname, 'dist'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist-visual-tests'),
    emptyOutDir: true,
  },
  preview: {
    open: true,
  },
  server: {
    open: true,
  },
});
