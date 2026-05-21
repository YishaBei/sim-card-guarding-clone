import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url));
const port = process.env.PORT || 4173;
const target = 'https://c.cmccsim.com';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};
const hop = new Set(['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers','transfer-encoding','upgrade','host','content-length']);

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

function cors() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization,x-requested-with',
    'access-control-expose-headers': 'content-type,content-length,x-request-id,traceparent,tracestate'
  };
}

async function bodyBuffer(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function proxy(req, res, pathname, search = '') {
  if ((req.method || 'GET').toUpperCase() === 'OPTIONS') {
    return send(res, 204, cors(), '');
  }
  const upstreamUrl = `${target}${pathname}${search}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (!v || hop.has(k.toLowerCase())) continue;
    headers.set(k, Array.isArray(v) ? v.join(', ') : v);
  }
  headers.set('origin', target);
  headers.set('referer', `${target}/sim-card-guarding/#/home`);
  headers.set('user-agent', req.headers['user-agent'] || 'Mozilla/5.0');
  headers.set('accept', req.headers['accept'] || 'application/json, text/plain, */*');

  const init = { method: req.method, headers, redirect: 'manual' };
  if (!['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase())) {
    const body = await bodyBuffer(req);
    if (body) init.body = body;
  }

  try {
    const upstream = await fetch(upstreamUrl, init);
    const outHeaders = { ...cors() };
    upstream.headers.forEach((v, k) => {
      if (!hop.has(k.toLowerCase())) outHeaders[k] = v;
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    return send(res, upstream.status, outHeaders, body);
  } catch (error) {
    return send(res, 502, { 'content-type': 'application/json; charset=utf-8', ...cors() }, JSON.stringify({ code: -1, msg: 'proxy_failed', detail: String(error?.message || error) }));
  }
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/', true);
  const pathname = parsed.pathname || '/';
  if (pathname.startsWith('/sim/')) return proxy(req, res, pathname, parsed.search || '');

  const filePath = pathname === '/' ? '/index.html' : pathname;
  const abs = path.join(root, filePath);
  if (!abs.startsWith(root)) return send(res, 403, { 'content-type': 'text/plain; charset=utf-8', ...cors() }, 'Forbidden');
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    const ext = path.extname(abs).toLowerCase();
    return send(res, 200, { 'content-type': types[ext] || 'application/octet-stream', ...cors() }, fs.readFileSync(abs));
  }
  return send(res, 200, { 'content-type': 'text/html; charset=utf-8', ...cors() }, fs.readFileSync(path.join(root, 'index.html')));
});

server.listen(port, () => console.log(`sim-card-guarding-clone running at http://localhost:${port}`));
