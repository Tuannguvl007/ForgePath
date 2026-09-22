import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.css':'text/css; charset=utf-8'};

http.createServer(async (req,res) => {
  try {
    const raw = decodeURIComponent((req.url || '/').split('?')[0]);
    let safe = normalize(raw).replace(/^([.][.][/\\])+/, '');
    if (safe === '/' || safe === '.') safe = '/index.html';
    let file = join(root, safe);
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); }
    catch { file = join(root, 'index.html'); }
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache'});
    res.end(body);
  } catch (e) {
    res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});res.end(String(e));
  }
}).listen(port, '127.0.0.1', () => console.log(`ForgePath: http://127.0.0.1:${port}`));
