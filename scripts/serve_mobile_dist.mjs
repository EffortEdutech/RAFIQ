import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('apps/mobile/dist');
const port = Number(process.env.RAFIQ_STATIC_PORT ?? 8057);

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
};

function fileForUrl(url = '/') {
  const cleanUrl = url.split('?')[0] || '/';
  const requested = normalize(cleanUrl).replace(/^([/\\])+/, '');
  const candidate = resolve(join(root, requested || 'index.html'));
  if (!candidate.startsWith(root)) return join(root, 'index.html');
  try {
    const info = statSync(candidate);
    if (info.isFile()) return candidate;
  } catch {
    return join(root, 'index.html');
  }
  return join(root, 'index.html');
}

createServer((request, response) => {
  const file = fileForUrl(request.url);
  response.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
  createReadStream(file)
    .on('error', () => {
      response.writeHead(500);
      response.end('Unable to read RAFIQ mobile export.');
    })
    .pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`RAFIQ mobile export serving http://127.0.0.1:${port}`);
});
