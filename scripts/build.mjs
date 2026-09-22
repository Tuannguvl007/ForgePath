import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'public'), dist, { recursive: true });
await cp(join(root, 'src'), join(dist, 'src'), { recursive: true });
await cp(join(root, 'index.html'), join(dist, 'index.html'));

// Stamp a tiny build marker without touching the legacy application logic.
const marker = {
  app: 'ForgePath',
  version: '4.0.0',
  architecture: 'Web/PWA + Capacitor',
  builtAt: new Date().toISOString()
};
await writeFile(join(dist, 'build.json'), JSON.stringify(marker, null, 2) + '\n');
console.log(`ForgePath build complete: ${dist}`);
