const bcrypt = require('bcryptjs');
const { db } = require('../lib/db');
const { makeToken, setCookie } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan' });
  if (!process.env.SESSION_SECRET) return res.status(500).json({ error: 'SESSION_SECRET belum diatur di Vercel.' });
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string')
    return res.status(400).json({ error: 'Isi username dan password.' });
  try {
    const sql = await db();
    const [u] = await sql`SELECT username,password FROM users WHERE lower(username)=lower(${username})`;
    if (!u || !bcrypt.compareSync(password, u.password))
      return res.status(401).json({ error: 'Username atau password salah.' });
    setCookie(res, makeToken(u.username));
    res.json({ username: u.username });
  } catch (e) {
    res.status(500).json({ error: 'Database error. Pastikan DATABASE_URL sudah diatur.' });
  }
};
