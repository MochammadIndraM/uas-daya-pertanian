# UAS Daya Dalam Bidang Pertanian — lokal Windows

Aplikasi ini menggunakan tampilan paket Sites dan aturan ujian Apps Script V4. Backend Node.js menggunakan PostgreSQL; tidak membutuhkan akun atau login Vercel untuk localhost. Tidak ada deployment yang dijalankan.

## 1. Persiapan

1. Buka folder `C:\laragon\www\uas-daya-pertanian` di VS Code.
2. Gunakan terminal PowerShell. Pasang Node.js **24 LTS** jika belum ada. Periksa `node --version` dan `npm.cmd --version`.
3. Jalankan:

```powershell
cd C:\laragon\www\uas-daya-pertanian
npm.cmd ci
```

`npm.cmd` menjalankan npm yang sama dengan `npm`; pemakaian `.cmd` menghindari blokir `npm.ps1` pada kebijakan PowerShell Windows. Tidak perlu mengubah ExecutionPolicy, menyalakan Apache/MySQL Laragon, memasang Docker, atau login Vercel. Instalasi awal membutuhkan internet untuk dependensi dan binari PostgreSQL.

## 2. Hidupkan PostgreSQL lokal — terminal pertama

```powershell
npm.cmd run db:local
```

Perintah ini menjalankan PostgreSQL nyata melalui `embedded-postgres` pada `127.0.0.1:55432`, membuat database `uas_local`, dan menerapkan [skema SQL](sql/001-init.sql). Database dan kredensial acak disimpan dalam `.local/dev/` dan tetap tersedia sesudah server dihentikan. Biarkan terminal ini terbuka.

Jika `.env` belum ada, skrip membuatnya dengan `DATABASE_URL`, kode mulai **`MULAI-LOKAL`**, dan kode rekap acak. Buka `.env` di editor untuk melihat `KODE_REKAP_DOSEN`. Berkas `.env` dan `.local` diabaikan Git. Jika `.env` sudah ada, skrip tidak menimpanya.

## 3. Hidupkan aplikasi — terminal kedua

```powershell
cd C:\laragon\www\uas-daya-pertanian
npm.cmd run dev
```

Setelah berhasil, terminal menampilkan:

```text
Local: http://localhost:3000
Rekap dosen: http://localhost:3000/?halaman=rekap
```

Buka **http://localhost:3000** untuk peserta dan **http://localhost:3000/rekap** untuk dosen. Formulir terbuka tanpa login. Isi identitas fiktif, golongan A/B/C, dan kode mulai `MULAI-LOKAL`. Soal dan timer pengerjaan baru tampil setelah kode benar. Angka “30 menit” pada halaman depan adalah informasi durasi, bukan timer aktif.

Kode rekap diisi pada halaman dosen. Filter golongan dan tombol CSV membaca hasil terkirim. CSV memakai UTF-8 BOM, pemisah titik koma, waktu WIB, dan perlindungan formula Excel.

Hentikan aplikasi dengan **Ctrl+C** di terminal kedua, lalu hentikan database dengan **Ctrl+C** di terminal pertama. Untuk menjalankan lagi, ulangi langkah 2 dan 3; data tidak dihapus. Jika port aplikasi terpakai, ubah `PORT` dalam `.env` lalu mulai lagi. PostgreSQL lokal menggunakan port 55432 dan pengujian 55433.

## 4. Menggunakan PostgreSQL yang sudah tersedia

Lewati `db:local` bila memakai PostgreSQL sendiri. Salin `.env.example` menjadi `.env` **hanya jika belum mempunyai `.env`**. Isi `DATABASE_URL` dengan URL database yang benar, `KODE_MULAI_UAS`, `KODE_REKAP_DOSEN` yang berbeda, dan `EXAM_ID`. Jangan gunakan password contoh.

```powershell
npm.cmd run db:migrate
npm.cmd run dev
```

`db:migrate` hanya membuat skema bila belum ada; tidak menghapus isi database. PostgreSQL harus dapat diakses dan pengguna database perlu izin CREATE TABLE. URL Neon pooled dapat digunakan kemudian dengan `sslmode=require`; jangan mengganti URL database produksi untuk menjalankan tes.

Kode mulai kosong berarti sesi baru ditutup. Kode mulai dan rekap harus berbeda dan maksimal 100 karakter. Sesudah mengubah `.env`, restart `npm.cmd run dev`. Sesi yang sudah ada tetap dapat dibuka walaupun pembuatan sesi baru ditutup.

## 5. Menjalankan pengujian

Google Chrome perlu terpasang untuk uji browser. Jalankan dari terminal lain:

```powershell
npm.cmd test
```

Tes membuat database baru bernama `uas_test_<timestamp>` di cluster PostgreSQL terpisah `.local/test/`, port 55433. Tes tidak membaca `.env` atau mengakses database peserta/produksi. Bank uji berisi 50 soal fiktif; identitas peserta juga fiktif. Data uji disimpan, bukan dicampur ke rekap `uas_local`.

Urutan tes: akses/kode salah, satu peserta, komposisi, reset V4, tenggat server, penilaian 76, kirim ganda/paralel, versi bank, ujian ditutup, browser desktop/viewport 390px, lalu **3 putaran × 80 peserta**. Tiap putaran meluncurkan 80 mulai dalam <1 detik dan 80 kirim dalam <1 detik; membandingkan skor harapan dengan PostgreSQL, rekap, CSV penuh, dan filter A/B/C. Putaran ketiga menunggu idle 35 detik dan merestart PostgreSQL/pool lokal. Tidak ada retry tersembunyi. p95 mulai dan kirim harus ≤5 detik.

Pemeriksaan habis waktu menggunakan perubahan waktu sesi di database uji ke masa lampau; tidak menunggu 30 menit waktu nyata. UI reset diuji dengan event visibility yang disimulasikan. Uji beban adalah permintaan HTTP serentak, bukan 80 browser fisik.

Hasil terbaru tersimpan dalam `test-results/report.json`, `round-1.csv` sampai `round-3.csv`, rekap JSON, data harapan, serta CSV dan tangkapan layar dari browser. Panel browser juga diperiksa berisi tepat 80 baris per putaran beserta filter golongan. Lihat [laporan aktual](docs/HASIL-UJI-LOKAL.md). Untuk meninjau database uji dengan klien SQL, kredensial ada di `.local/test/credentials.json`; cluster dihentikan setelah tes selesai. Jangan mempublikasikan folder `.local`.

## Aturan yang dipertahankan

V4 memilih satu soal dari tiap pasangan q1/q26 sampai q25/q50: 17 pemahaman dan 8 hitungan, total 100 poin. Tenggat 30 menit ditetapkan server/database saat pembuatan pertama. Pengulangan mulai dengan token sama tidak memperpanjang tenggat. Kunci hanya ada pada server dan database, tidak di aset publik. Penilaian menggunakan bank versi sesi, dan satu sesi hanya mempunyai satu hasil.

Pindah tab atau kehilangan fokus selama 1 detik menghapus draf, mengganti paket, dan mengembalikan posisi ke awal. Timer terus berjalan. Reload dapat memicu reset melalui pagehide. Peserta harus menjawab 25 soal dan mengirim manual sebelum tenggat; nilai langsung ditampilkan setelah berhasil. NIM yang sama dapat membuat sesi baru seperti V4. **Usulan perubahan aturan belum diaktifkan**; lihat [addendum PRD](docs/PRD-Addendum-Lokal.md), yang juga ditambahkan pada PRD DOCX.

## Struktur dan kesiapan Vercel

- `public/`: HTML/CSS/JavaScript hasil adaptasi paket Sites.
- `server/`: aturan ujian, bank V4, versi bank, PostgreSQL, dan CSV.
- `api/index.mjs`: entry point Vercel Functions, memakai aplikasi Express yang sama dengan localhost.
- `vercel.json`: direktori publik dan rewrite API/rekap.
- `sql/001-init.sql`: skema PostgreSQL.
- `scripts/`: dev server, migrasi, dan PostgreSQL lokal.
- `tests/`: bank fiktif, uji integrasi/beban/browser.
- `sources/sites-worker.js`: salinan sumber Sites asli untuk pelacakan, tidak disajikan ke browser. Sumber Apps Script asli dipertahankan.

Tidak ada D1, SQLite, penyimpanan hasil dalam memori, atau filesystem runtime untuk sesi/nilai pada backend aplikasi. `embedded-postgres` hanya alat pengembangan; Vercel memakai PostgreSQL eksternal dari `DATABASE_URL`. Transaksi menggunakan satu koneksi dan `SELECT ... FOR UPDATE` per sesi; primary key `results.attempt_id` mencegah nilai ganda.

Sebelum deploy: siapkan database produksi terpisah, terapkan SQL, isi environment variables pada Vercel, dan uji lagi URL hosting pada HP serta beban nyata. Panel pengaturan buka/tutup, pembatasan percobaan kode yang tersimpan, kebijakan NIM, persistensi draf, auto-submit, impor histori, dan retensi masih keputusan PRD. Pekerjaan ini berhenti pada uji lokal.

Referensi implementasi: [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js), [transaksi node-postgres](https://node-postgres.com/features/transactions), dan [embedded-postgres](https://github.com/leinelissen/embedded-postgres).
