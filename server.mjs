import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url));
const port = process.env.PORT || 4173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

function json(res, obj) {
  send(res, 200, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }, JSON.stringify(obj));
}

const apiResponses = {
  '/sim/silver/hair/api/init/config': {
    code: 0,
    data: {
      appName: '守护宝',
      version: 'clone-1.0.0',
      tabs: ['home', 'position', 'message', 'mine']
    }
  },
  '/sim/silver/hair/api/silver_hair_auth/silverUserserInfo': {
    code: 0,
    data: { name: '聖園彌香', phone: '138****0000', level: '黄金会员', region: '广东·深圳' }
  },
  '/sim/silver/hair/api/silverHair/guide/getGuideStatus': {
    code: 0,
    data: { finished: true, step: 'completed' }
  },
  '/sim/silver/hair/api/silver_hair_auth/get_sms_captcha': { code: 0, data: { captchaId: 'mock-captcha', sent: true } },
  '/sim/silver/hair/api/silver_hair_auth/user_login': { code: 0, data: { token: 'mock-token', login: true } },
  '/sim/silver/hair/api/silver_hair_auth/check_and_login': { code: 0, data: { token: 'mock-token', login: true } },
  '/sim/silver/hair/api/silver_hair_auth/getPhoneSimStatus': { code: 0, data: { status: 'active' } },
  '/sim/silver/hair/api/silverHair/position/reauthorize': { code: 0, data: { reauthorized: true } },
  '/sim/silver/hair/api/silver_hair_msg/messageSelect': { code: 0, data: [] },
  '/sim/silver/hair/api/silver_hair_msg/messageDeatilSelect': { code: 0, data: { title: '消息详情', body: 'mock' } },
  '/sim/silver/hair/api/silverHair/feedback/addFeedback': { code: 0, data: { saved: true } }
};

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true).pathname;

  if (reqUrl in apiResponses) return json(res, apiResponses[reqUrl]);

  const filePath = reqUrl === '/' ? '/index.html' : reqUrl;
  const abs = path.join(root, filePath);
  if (!abs.startsWith(root)) return send(res, 403, { 'content-type': 'text/plain' }, 'Forbidden');
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    const ext = path.extname(abs).toLowerCase();
    return send(res, 200, { 'content-type': types[ext] || 'application/octet-stream' }, fs.readFileSync(abs));
  }
  return send(res, 200, { 'content-type': 'text/html; charset=utf-8' }, fs.readFileSync(path.join(root, 'index.html')));
});

server.listen(port, () => {
  console.log(`sim-card-guarding-clone running at http://localhost:${port}`);
});
