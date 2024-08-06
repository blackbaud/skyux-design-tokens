import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());

  return defineConfig({
    preview: {
      open: true,
    },
    server: {
      https: viteEnv.VITE_DEV_CERT
        ? {
            cert: viteEnv.VITE_DEV_CERT,
            key: viteEnv.VITE_DEV_KEY,
          }
        : undefined,
      open: true,
    },
  });
};
