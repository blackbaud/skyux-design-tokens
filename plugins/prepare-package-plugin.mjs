import fs from 'fs-extra';
import path from 'node:path';

export function preparePackagePlugin() {
  const rootPath = path.join(__dirname, '..');

  return {
    name: 'transform-package',
    async generateBundle() {
      const packageJson = fs.readFileSync(path.join(rootPath, 'package.json'));
      const readMe = fs.readFileSync(path.join(rootPath, 'README.md'));
      const changelog = fs.readFileSync(path.join(rootPath, 'CHANGELOG.md'));

      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: packageJson,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'README.md',
        source: readMe,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'CHANGELOG.md',
        source: changelog,
      });
    },
  };
}
