# TrezzHub

## Deploy ke Vercel
1. Upload folder ini ke repo GitHub, lalu "Add New > Project" di Vercel dan pilih repo itu
   (Framework Preset: Other). Atau jalankan `npx vercel` dari folder ini.
2. Di project Vercel: Storage > Create Database > Neon (Postgres), hubungkan ke project.
   Vercel otomatis menambahkan DATABASE_URL.
3. Settings > Environment Variables, tambahkan SESSION_SECRET (teks acak panjang, mis. hasil `openssl rand -hex 32`).
   Opsional: API_KEY (default FREE).
4. Redeploy. Tabel users dibuat otomatis saat register pertama.
