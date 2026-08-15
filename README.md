# ShotProject — Landing Page + Form + Admin Panel

Landing page 2 halaman (beranda + form pendaftaran) buat "ShotProject", lengkap
dengan admin panel buat update semua teks, gambar, dan background tanpa nyentuh kode.

Storage-nya pakai **Redis** (konten + data pendaftar, lewat integrasi Marketplace
Vercel — mis. Upstash) dan **Vercel Blob** (upload gambar), jadi aman dipakai di
Vercel — nggak kayak nyimpen ke file lokal yang ilang tiap redeploy.

> **Catatan:** "Vercel KV" sebagai produk standalone udah di-sunset (dipindah ke
> Upstash Redis Desember 2024). Sekarang cara resminya nyambungin Redis ke project
> Vercel itu lewat **Marketplace**, bukan lewat tombol "Create KV Database" yang
> udah nggak ada lagi. Project ini udah disesuaikan pakai `@upstash/redis`.

## Struktur

- `/` — Halaman 1: landing page (hero + 7 section, sesuai referensi `Landingpage_1.png`)
- `/join` — Halaman 2: form pendaftaran (sesuai referensi `Framework-III.png`), sudah
  ditambahkan field **Jenis Kelamin** dan background-nya **bisa dicustom** dari admin
- `/admin` — Admin panel buat edit semua konten kedua halaman + lihat data pendaftar

## Setup di Vercel

1. Push project ini ke GitHub, lalu import ke Vercel seperti biasa.
2. Buka [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=redis) →
   pilih integrasi Redis (**Upstash** yang paling umum dipakai) → install & connect
   ke project ini. Vercel/Upstash otomatis nambahin env var — biasanya
   `KV_REST_API_URL` + `KV_REST_API_TOKEN`, atau `UPSTASH_REDIS_REST_URL` +
   `UPSTASH_REDIS_REST_TOKEN` (kode di `lib/content.ts` udah nge-cek dua-duanya,
   jadi nggak masalah integrasi mana yang muncul).
3. Masih di Marketplace / tab **Storage**, tambahin juga **Blob** buat upload
   gambar. Ini bakal nambahin `BLOB_READ_WRITE_TOKEN` otomatis.
4. Di tab **Settings → Environment Variables**, tambahin:
   ```
   ADMIN_PASSWORD=passwordrahasialo
   ```
   (jangan pakai password default di production)
5. Redeploy. Halaman pertama kali dibuka bakal otomatis nge-seed konten default
   ke Redis.

## Jalanin di lokal

```bash
npm install
vercel link          # hubungin folder ini ke project Vercel yang udah dibikin
vercel env pull .env.development.local   # tarik kredensial Redis, Blob, dll
npm run dev
```

Tanpa `vercel env pull`, `npm run dev` tetap jalan tapi `/api/content`,
`/api/submissions`, dan `/api/upload` bakal ngelempar error yang jelas ("Redis
belum terhubung...") karena nggak ada kredensial.

Buka `http://localhost:3000` (landing), `http://localhost:3000/join` (form),
`http://localhost:3000/admin` (admin panel).

## Login Admin

Password default (kalau `ADMIN_PASSWORD` belum diset): `shotproject2026`.
**Wajib diganti** lewat environment variable sebelum go live.

## Cara kerja penyimpanan

| Data | Disimpan di |
|---|---|
| Konten landing page & form (semua teks/path gambar yang bisa diedit di admin) | Redis, key `shotproject:content` |
| Data pendaftar (submission form `/join`) | Redis, key `shotproject:submissions` |
| Gambar yang diupload dari admin panel | Vercel Blob, folder `shotproject/` |

Auth admin masih pakai cookie session sederhana (bukan disimpan di Redis) — cukup
buat kebutuhan satu admin panel internal kayak gini.

## Ganti gambar placeholder

Gambar default di `public/assets/` itu placeholder abu-abu bertuliskan nama
section — ganti lewat tombol upload di admin panel (otomatis kesimpen ke Blob
dan konten ke-update ke Redis), terutama:

- `hero.jpg` — foto hero halaman utama
- `section01.jpg`, `section07.jpg` — foto section 01 & 07
- `gallery-1.jpg` sampai `gallery-5.jpg` — grid galeri section 02
- `form-bg.jpg` — background halaman form (bisa juga diganti langsung dari
  tab **Halaman Form** di admin panel, termasuk atur gelap-terangnya overlay)

## Field Jenis Kelamin di Form

Ditambahkan sebagai pilihan (Laki-laki / Perempuan / Lainnya) di sebelah field
Usia pada halaman `/join`, dan datanya ikut kesimpen di tab **Pendaftar** admin panel.

## Tab-tab di Admin Panel

| Tab | Isi |
|---|---|
| Hero | Judul, subjudul, CTA, gambar hero, social media links |
| 01–07 | Semua teks & gambar tiap section landing page |
| Halaman Form | Background (gambar + overlay + warna), judul, 4 poin manfaat, catatan kecil |
| Pendaftar | List orang yang udah isi form (otomatis muncul begitu ada yang submit) |
| Nav & Sosial | Menu navbar |
