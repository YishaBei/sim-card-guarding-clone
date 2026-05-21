import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url));
const port = process.env.PORT || 4173;
const upstreamOrigin = 'https://c.cmccsim.com';
const upstreamReferer = 'https://c.cmccsim.com/sim-card-guarding/#/home';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const hopByHop = new Set(['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade', 'host', 'content-length']);
const proxiedPrefixes = ['/sim/'];

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization,x-requested-with',
    'access-control-expose-headers': 'content-type,content-length,x-request-id,traceparent,tracestate'
  };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function proxyRequest(req, res, pathname, search = '') {
  if ((req.method || 'GET').toUpperCase() === 'OPTIONS') {
    return send(res, 204, corsHeaders(), '');
  }

  const targetUrl = `${upstreamOrigin}${pathname}${search}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || hopByHop.has(key.toLowerCase())) continue;
    if (Array.isArray(value)) headers.set(key, value.join(', '));
    else headers.set(key, value);
  }
  headers.set('origin', upstreamOrigin);
  headers.set('referer', upstreamReferer);
  headers.set('user-agent', req.headers['user-agent'] || 'Mozilla/5.0');
  headers.set('accept', req.headers['accept'] || 'application/json, text/plain, */*');

  const init = {
    method: req.method,
    headers,
    redirect: 'manual'
  };
  if (!['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase())) {
    const body = await readBody(req);
    if (body) init.body = body;
  }

  try {
    const upstream = await fetch(targetUrl, init);
    const responseHeaders = { ...corsHeaders() };
    for (const [key, value] of upstream.headers.entries()) {
      if (hopByHop.has(key.toLowerCase())) continue;
      responseHeaders[key] = value;
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    return send(res, upstream.status, responseHeaders, body);
  } catch (error) {
    return send(res, 502, { 'content-type': 'application/json; charset=utf-8', ...corsHeaders() }, JSON.stringify({ code: -1, msg: 'proxy_failed', detail: String(error?.message || error) }));
  }
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/', true);
  const reqUrl = parsed.pathname || '/';

  if (proxiedPrefixes.some(prefix => reqUrl.startsWith(prefix))) {
    return proxyRequest(req, res, reqUrl, parsed.search || '');
  }

  const filePath = reqUrl === '/' ? '/index.html' : reqUrl;
  const abs = path.join(root, filePath);
  if (!abs.startsWith(root)) return send(res, 403, { 'content-type': 'text/plain; charset=utf-8', ...corsHeaders() }, 'Forbidden');
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    const ext = path.extname(abs).toLowerCase();
    return send(res, 200, { 'content-type': types[ext] || 'application/octet-stream', ...corsHeaders() }, fs.readFileSync(abs));
  }
  return send(res, 200, { 'content-type': 'text/html; charset=utf-8', ...corsHeaders() }, fs.readFileSync(path.join(root, 'index.html')));
});

server.listen(port, () => {
  console.log(`sim-card-guarding-clone running at http://localhost:${port}`);
});
