# Pembaruan bank soal melalui Excel

Fitur pada halaman rekap dosen memakai format `.xlsx` dan autentikasi kode rekap. Ada unduhan template kosong (50 baris ID/metadata), unduhan bank aktif beserta kunci, pemeriksaan dengan pesan kesalahan per baris, pratinjau komposisi/cuplikannya, dan aktivasi untuk sesi baru.

## Instalasi pada aplikasi yang sudah berjalan

1. Jalankan `npm.cmd ci`.
2. Pada database lokal yang dituju `.env`, jalankan `npm.cmd run db:migrate` saat PostgreSQL aktif; atau jalankan `sql/002-exam-banks.sql` melalui SQL Editor Neon untuk database online yang sudah mempunyai skema awal.
3. Restart server lokal dan Ctrl+F5, atau deploy ulang ke Vercel. Pemasangan fitur memerlukan pembaruan kode; unggahan bank berikutnya tidak memerlukan deploy.

Migrasi menambah tabel `exam_banks` untuk penunjuk versi aktif per `EXAM_ID`. `bank_versions` yang sudah ada tetap dipakai sebagai penyimpanan versi immutable. Tidak ada penghapusan sesi atau nilai.

## Format sheet Soal

| Kolom | Isian |
| --- | --- |
| ID | `q1` sampai `q50`, unik; jangan diubah dari template |
| Jenis | `pemahaman` atau `hitungan`, sesuai ID template |
| Materi | Sesuai ID template: Pompa air, Blower, Panel surya, Kincir angin |
| Pertanyaan | Teks biasa wajib, maksimal 5.000 karakter |
| Opsi A–D | Empat teks pilihan wajib, tiap opsi maksimal 2.000 karakter |
| Kunci | Satu huruf A, B, C, atau D |
| Poin | 4 |

Header dan nama sheet **Soal** harus tetap. Sheet Petunjuk/Contoh tidak diimpor. File maksimal 1 MB; tanpa formula, macro, password, atau lampiran. Baris boleh diurutkan berbeda karena server mengurutkan ulang berdasarkan ID.

Bank tetap berisi 50 soal, dipilih satu dari tiap pasangan q1/q26 sampai q25/q50 menjadi 25 soal. Komposisi per paket adalah 17 pemahaman dan 8 hitungan: pompa 4+2, blower 4+2, panel surya 5+2, kincir 4+2. Dosen menilai kesetaraan tingkat kesulitan pasangan.

## Konsistensi

- Pemeriksaan file tidak menyimpan/mengaktifkan bank; aktivasi adalah tindakan terpisah.
- Aktivasi memvalidasi file lagi dan menyimpan versi serta penunjuk aktif dalam satu transaksi PostgreSQL.
- Aktivasi untuk ujian sama diserialkan dan memeriksa versi aktif yang dilihat saat pratinjau, sehingga pratinjau lama ditolak HTTP 409.
- Sesi baru membaca versi aktif dari database, tanpa cache permanen pada proses Node/Vercel.
- Sesi lama tetap mengacu versi saat mulai. Paket reset dan penilaian tetap memakai versi itu.
- Bank untuk `EXAM_ID` lain tidak berubah. Bila tidak ada unggahan, bank bawaan V4 tetap digunakan.
- Seluruh endpoint bank memerlukan kode dosen. Aset publik dan endpoint peserta tidak memperoleh bank lengkap/kunci.
- File Excel tidak disimpan sebagai file runtime. Hanya soal tervalidasi yang disimpan sebagai JSONB dalam PostgreSQL.

## Pengujian

Jalankan `npm.cmd run test:bank` (Chrome diperlukan). Tes memakai soal fiktif dan database baru di cluster uji terpisah port 55433; `.env` dan database produksi tidak dibaca. Hasil aktual tersedia di `test-results/bank-report.json`, berkas Excel unduhan uji, serta tangkapan layar pratinjau desktop/390px. Uji hosting Vercel/Neon belum dijalankan untuk fitur ini.

Hasil lokal 15 November 2026: **lulus** untuk roundtrip 50 soal, 14 jenis kesalahan isian, arsip rusak/ukuran berlebih, autentikasi seluruh endpoint bank, pratinjau tanpa perubahan data, aktivasi yang persisten/per ujian, konflik versi, reset dan penilaian sesi lama, serta unduh/unggah/aktivasi melalui Chrome desktop dan viewport 390px. Pengujian utama `npm.cmd test` juga lulus tiga putaran ×80 peserta setelah perubahan pembacaan bank aktif; setiap putaran mempunyai 80 nilai yang cocok dengan panel/CSV dan nol duplikasi. Lihat laporan aktual di `test-results/report.json`. Dependensi runtime lolos `npm audit --omit=dev` dengan nol laporan kerentanan pada pemeriksaan ini.
