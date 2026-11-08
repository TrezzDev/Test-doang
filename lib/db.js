const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = neon(url);
let ready;

// Buat tabel otomatis + seed akun developer (centang biru) dari DEV_USERNAME / DEV_PASSWORD
async function init() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower ON users (lower(username))`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`;
  // Akun developer bawaan (bisa ditimpa lewat env DEV_USERNAME / DEV_PASSWORD)
  const u = process.env.DEV_USERNAME || 'TrezzHub';
  const p = process.env.DEV_PASSWORD || 'Rezki2000';
  if (u && p) {
    const ex = await sql`SELECT 1 FROM users WHERE lower(username)=lower(${u})`;
    if (ex.length) await sql`UPDATE users SET role='dev' WHERE lower(username)=lower(${u})`;
    else await sql`INSERT INTO users(username,password,role) VALUES(${u}, ${bcrypt.hashSync(p, 10)}, 'dev')`;
  }
}
async function db() { ready ??= init(); await ready; return sql; }
module.exports = { db };
