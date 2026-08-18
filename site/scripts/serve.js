// Локальный статический сервер: доступен с компьютера и с телефона в той же Wi-Fi сети.
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, path.normalize(rel));
  if (!file.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      const alt = path.join(file, 'index.html');
      return fs.stat(alt, (e2, s2) => {
        if (e2 || !s2.isFile()) {
          return fs.readFile(path.join(ROOT, '404.html'), (e3, b3) =>
            send(res, 404, e3 ? 'Not found' : b3, 'text/html; charset=utf-8'));
        }
        send(res, 200, fs.readFileSync(alt), TYPES['.html']);
      });
    }
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
}).listen(PORT, '0.0.0.0', () => {
  const ips = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const i of list || []) if (i.family === 'IPv4' && !i.internal) ips.push(i.address);
  }
  console.log('Компьютер:  http://localhost:' + PORT + '/');
  ips.forEach(ip => console.log('Wi-Fi:      http://' + ip + ':' + PORT + '/'));
});
