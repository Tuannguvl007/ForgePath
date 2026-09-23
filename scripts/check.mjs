import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const sourceRoots = ['src'];
const jsFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && file.endsWith('.js')) jsFiles.push(file);
  }
}

for (const rel of sourceRoots) walk(path.join(root, rel));

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
}

const forbidden = [
  /\bTHREE\b/,
  /\bWebGL\b/i,
  /\bGLTF\b/i,
  /\bGLB\b/,
  /viewer3d/i,
  /init3D/i,
  /forgepath-human/i,
  /@capacitor\//i,
  /navigator\.serviceWorker/i,
  /beforeinstallprompt/i,
];

const textFiles = ['index.html'];
for (const rel of ['src']) {
  const stack = [path.join(root, rel)];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (/\.(js|css|html)$/.test(entry.name)) textFiles.push(path.relative(root, file));
    }
  }
}

for (const rel of textFiles) {
  const content = fs.readFileSync(path.join(root, rel), 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(content)) {
      console.error(`Forbidden retired platform/runtime reference ${pattern} found in ${rel}`);
      process.exit(1);
    }
  }
}

console.log(`ForgePath checks passed (${jsFiles.length} JavaScript files).`);
