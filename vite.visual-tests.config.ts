import path from 'path';
import { defineConfig } from 'vite';

/**
 * Serves the visual test page in `src/visual-tests` with the built package
 * from `dist` as static files, so the page tests exactly what gets published.
 * Run `npm run build` first.
 */
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
