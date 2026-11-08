const crypto = require('crypto');

const SECRET = () => process.env.SESSION_SECRET || '';
const sign = p => crypto.createHmac('sha256', SECRET()).update(p).digest('base64url');

function makeToken(user) {
  const p = Buffer.from(JSON.stringify({ u: user, e: Date.now() + 30 * 864e5 })).toString('base64url');
  return `${p}.${sign(p)}`;
}
function readUser(req) {
  if (!SECRET()) return null;
  const t = /(?:^|;\s*)tz=([^;]+)/.exec(req.headers.cookie || '')?.[1];
  if (!t) return null;
  const [p, s] = t.split('.');
  if (!p || !s) return null;
  const a = Buffer.from(s), b = Buffer.from(sign(p));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { const d = JSON.parse(Buffer.from(p, 'base64url')); return d.e > Date.now() ? d.u : null; } catch { return null; }
}
const setCookie = (res, token) =>
  res.setHeader('Set-Cookie', `tz=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${token ? 2592000 : 0}`);
const valid = (u, p) =>
  typeof u === 'string' && /^[a-zA-Z0-9_]{3,20}$/.test(u) && typeof p === 'string' && p.length >= 6 && p.length <= 72;

module.exports = { makeToken, readUser, setCookie, valid };
