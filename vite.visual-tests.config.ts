import path from 'path';
import { defineConfig, type Connect, type Plugin } from 'vite';

/** Bundles reference `../images/`, but images are built to `assets/images/`. */
function serveTokenImages(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url?.startsWith('/images/')) {
      req.url = `/assets${req.url}`;
    }
    next();
  };

  return {
    name: 'serve-token-images',
    configureServer: (server) => {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  root: path.resolve(import.meta.dirname, 'src/visual-tests'),
  base: './',
  publicDir: path.resolve(import.meta.dirname, 'dist'),
  plugins: [serveTokenImages()],
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
