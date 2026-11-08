const { neon } = require('@neondatabase/serverless');

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = neon(url);
let ready;

// Buat tabel otomatis saat pertama kali dipakai
async function db() {
  ready ??= sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  )`.then(() => sql`CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower ON users (lower(username))`);
  await ready;
  return sql;
}
module.exports = { db };
