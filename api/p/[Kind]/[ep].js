const { readUser } = require('../../../lib/auth');
const BASE = 'https://api.synoxcloud.xyz';
const KINDS = { anime: 'anime/samehadaku', komik: 'komik/shinigami' };

// Proxy ke API synoxcloud: hanya untuk user yang sudah login, apikey tidak terlihat di browser
module.exports = async (req, res) => {
  if (!readUser(req)) return res.status(401).json({ error: 'Belum login' });
  const { kind, ep, ...rest } = req.query;
  const base = KINDS[kind];
  if (!base || !/^[a-z]+$/.test(ep || '')) return res.status(400).json({ error: 'Endpoint tidak valid' });
  const q = new URLSearchParams(rest);
  q.set('apikey', process.env.API_KEY || 'FREE');
  try {
    const r = await fetch(`${BASE}/${base}/${ep}?${q}`, { signal: AbortSignal.timeout(25000) });
    res.status(r.status).setHeader('Content-Type', 'application/json').send(await r.text());
  } catch {
    res.status(502).json({ error: 'API sumber tidak merespons.' });
  }
};
