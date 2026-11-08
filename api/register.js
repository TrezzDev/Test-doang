const bcrypt = require('bcryptjs');
const { db } = require('../lib/db');
const { makeToken, setCookie, valid } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan' });
  if (!process.env.SESSION_SECRET) return res.status(500).json({ error: 'SESSION_SECRET belum diatur di Vercel.' });
  const { username, password } = req.body || {};
  if (!valid(username, password))
    return res.status(400).json({ error: 'Username 3-20 karakter (huruf, angka, _), password minimal 6 karakter.' });
  try {
    const sql = await db();
    const ex = await sql`SELECT 1 FROM users WHERE lower(username)=lower(${username})`;
    if (ex.length) return res.status(409).json({ error: 'Username sudah dipakai.' });
    await sql`INSERT INTO users(username,password) VALUES(${username}, ${bcrypt.hashSync(password, 10)})`;
    setCookie(res, makeToken(username));
    res.json({ username });
  } catch (e) {
    res.status(500).json({ error: 'Database error. Pastikan DATABASE_URL sudah diatur.' });
  }
};
