import path from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';

function getCertPath(fileName) {
  return path.join(homedir(), `.skyux/certs/${fileName}`);
}

export default defineConfig({
  preview: {
    open: true,
  },
  server: {
    https: {
      cert: readFileSync(getCertPath('skyux-server.crt')),
      key: readFileSync(getCertPath('skyux-server.key')),
    },
    open: true,
  },
});
