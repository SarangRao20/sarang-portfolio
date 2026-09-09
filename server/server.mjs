// SARANG.OS remote-terminal backend — zero dependencies.
// Node >= 20. Real bash over a PTY (via `script`), streamed to the browser over WebSocket.
//
//   PORT=3001 node server.mjs          -> ws://host:3001/term
//   TERM_TOKEN=secret  -> clients must connect with ?token=secret
//   TERM_WORKDIR=/x    -> run the shell here (default: a fresh temp sandbox per session)
//   TERM_SHELL=/bin/bash
//
// Serves: GET /health, GET / (tiny status page), WS  /term.
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const PORT = Number(process.env.PORT || 3001);
const TOKEN = process.env.TERM_TOKEN || '';
const SHELL = process.env.TERM_SHELL || '/bin/bash';
const MAX_OUT = Number(process.env.TERM_MAX_OUT || 262144);
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const log = (...a) => console.log(new Date().toISOString(), ...a);

// ----- sandbox -----
function buildSandbox() {
  if (process.env.TERM_WORKDIR) {
    fs.mkdirSync(process.env.TERM_WORKDIR, { recursive: true });
    return process.env.TERM_WORKDIR;
  }
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'sarangos-'));
  fs.writeFileSync(path.join(d, 'hello.txt'), 'hi from the real backend — a real bash runs inside this browser now.\n');
  fs.writeFileSync(path.join(d, 'who-am-i.txt'), 'sarang.rao — the one who owns this page.\n');
  fs.mkdirSync(path.join(d, 'projects'), { recursive: true });
  fs.writeFileSync(path.join(d, 'projects', 'README.md'), 'agentic-doc\ncv-inventory\nelysia\nnbfc\nnivana\nbattery\n');
  return d;
}

const DENY_DEFAULTS = [
  'rm\\s+(?:-rf|--recursive)?\\s*(?:/|~|/home)',
  'sudo',
  'poweroff\\b', 'reboot\\b', 'shutdown\\b', 'mkfs\\.', 'fdisk',
  'dd\\s+(?:if|of)=/(?:dev|etc)',
  'chmod\\s+777\\s+/(?:etc|usr|root)'
];
const DENY = new RegExp(
  '(?:' + DENY_DEFAULTS.join(')|(?:') + ')(?:' + (process.env.TERM_DENY || '') + ')?'
);

// ----- minimal RFC6455 frame codec -----
function frame(opcode, payload) {
  const buf = Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload), 'utf8');
  let h;
  const n = buf.length;
  if (n < 126) h = Buffer.from([0x80 | opcode, n]);
  else if (n < 65536) { h = Buffer.alloc(4); h[0] = 0x80 | opcode; h[1] = 126; h.writeUInt16BE(n, 2); }
  else { h = Buffer.alloc(10); h[0] = 0x80 | opcode; h[1] = 127; h.writeBigUInt64BE(BigInt(n), 2); }
  return Buffer.concat([h, buf]);
}

class WSSession {
  constructor(req) {
    this.socket = req.socket;
    this.inbuf = Buffer.alloc(0);
    this.parts = [];
    this.partsLen = 0;
    this.closed = false;
    this.onmessage = null;
    this.onclose = null;
  }
  _write(f) { if (!this.closed && this.socket.writable) { try { this.socket.write(f); } catch { /* ignore */ } } }
  sendText(t) { this._write(frame(0x1, t)); }
  sendClose(code = 1000) {
    if (this.closed) return;
    this.closed = true;
    this._write(frame(0x8, Buffer.from([(code >> 8) & 255, code & 255])));
    setTimeout(() => { try { this.socket.destroy(); } catch { /* ignore */ } }, 150);
  }
  handle(chunk) {
    this.inbuf = Buffer.concat([this.inbuf, chunk]);
    while (!this.closed) {
      const b = this.inbuf;
      if (b.length < 2) break;
      const fin = (b[0] & 0x80) !== 0;
      const opcode = b[0] & 0x0f;
      const masked = (b[1] & 0x80) !== 0;
      let len = b[1] & 0x7f;
      let off = 2;
      if (len === 126) { if (b.length < 4) break; len = b.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (b.length < 10) break; len = Number(b.readBigUInt64BE(2)); off = 10; }
      let mask = null;
      if (masked) { if (b.length < off + 4) break; mask = b.subarray(off, off + 4); off += 4; }
      if (b.length < off + len) break;
      let payload = b.subarray(off, off + len);
      this.inbuf = b.subarray(off + len);
      if (mask) {
        payload = Buffer.from(payload);
        for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
      }
      if (opcode === 0x8) { this.sendClose(payload.length ? (payload.readUInt16BE(0) || 1000) : 1000); if (this.onclose) this.onclose(); return; }
      if (opcode === 0x9) { this._write(frame(0xA, payload)); continue; }
      if (opcode === 0xA) continue;
      if (opcode === 0x1 || opcode === 0x2) {
        this.parts.push(payload); this.partsLen += payload.length;
        if (fin) {
          const msg = this.parts.length === 1 ? payload : Buffer.concat(this.parts, this.partsLen);
          this.parts = []; this.partsLen = 0;
          if (this.onmessage && !this.closed) this.onmessage(msg.toString('utf8'));
        }
      }
    }
  }
}

// ----- shell session -----
function startSession(ws) {
  const dir = buildSandbox();
  const child = spawn('script',
    ['-qefc', SHELL + ' --noprofile --norc', '/dev/null'],
    {
      cwd: dir,
      env: { ...process.env, TERM: 'xterm-256color', PS1: 'sarang@remote> ', COLUMNS: '110', LINES: '36' }
    });
  let outBytes = 0;
  log('session up', JSON.stringify({ pid: child.pid, cwd: dir }));

  const push = (d) => {
    outBytes += d.length;
    if (outBytes > MAX_OUT) {
      ws.sendText('\n[cap: output limit reached — reconnect to restart the shell]\n');
      try { child.kill(); } catch { /* ignore */ }
      return;
    }
    ws.sendText(d.toString('utf8'));
  };
  child.stdout.on('data', push);
  child.stderr.on('data', push);
  child.on('error', (e) => { log('spawn error', e.message); });
  child.on('exit', (code) => {
    log('session exit', String(code));
    try { ws.sendClose(1000); } catch { /* ignore */ }
  });

  ws.onmessage = (text) => {
    if (DENY.test(text)) {
      ws.sendText('sarang@remote> bash: denied by the sandbox. nice try.\n');
      return;
    }
    try { child.stdin.write(text); } catch { /* ignore */ }
  };
  ws.onclose = () => { try { child.kill(); } catch { /* ignore */ } };
}

// ----- http + upgrade server -----
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true,"shell":"' + SHELL + '"}');
    return;
  }
  if (u.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset=utf-8><title>sarang.terminal</title>
<pre style="font:14px/1.6 monospace;color:#cfe">
SARANG.OS remote-terminal backend — online.

connect from the OS terminal inside the portfolio:

    remote ws://${req.headers.host}/term
    exit            ← returns to the local shell

health: GET /health
</pre>`);
    return;
  }
  res.writeHead(404); res.end('not found');
});

server.on('upgrade', (req, socket, head) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname !== '/term') { try { socket.destroy(); } catch { /* ignore */ } return; }
  if (TOKEN) {
    const t = u.searchParams.get('token') || '';
    if (!crypto.timingSafeEqual(crypto.createHash('sha256').update(t).digest(), crypto.createHash('sha256').update(TOKEN).digest())) {
      try { socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n'); socket.destroy(); } catch { /* ignore */ }
      return;
    }
  }
  const key = req.headers['sec-websocket-key'];
  if (!key) { try { socket.destroy(); } catch { /* ignore */ } return; }
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  try {
    socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  } catch { try { socket.destroy(); } catch { /* ignore */ } return; }
  const ws = new WSSession(req);
  socket.on('data', (c) => { if (!head || head.length) { head = null; } ws.handle(c); });
  const ws2 = ws;
  startSession(ws2);
  socket.on('close', () => { if (ws2.onclose) ws2.onclose(); });
  socket.on('error', () => { if (ws2.onclose) ws2.onclose(); });
  // leftover `head` bytes (if any came with the upgrade)
  if (head && head.length) ws.handle(head);
});

server.listen(PORT, () => log('sarang.terminal listening on :' + PORT + (TOKEN ? ' (token-protected)' : ' (open) — set TERM_TOKEN for prod')));