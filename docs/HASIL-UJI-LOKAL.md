# Hasil uji lokal UAS Daya Pertanian

Waktu mulai: 2026-11-15 15:25:05 WIB. Status akhir: **PASSED**.

## Lingkungan dan ruang lingkup

Windows, Node.js 24, PostgreSQL nyata dari embedded-postgres 17.7.0-beta.16, driver pg, dan Chrome headless melalui Playwright. Browser memakai instalasi Chrome lokal, tanpa login. Database uji: `uas_test_1794731105226`, cluster terpisah pada port 55433, data di `.local/test`. Seluruh soal dan peserta uji fiktif. Backend yang diuji adalah aplikasi Express yang sama dengan entry point lokal/Vercel; hanya konfigurasi ujian dan bank yang diinjeksi dari fixture tes.

Versi database: PostgreSQL 17.7 on x86_64-windows, compiled by msvc-19.44.35219, 64-bit.

Tampilan publik memakai HTML/CSS/JavaScript dari paket Sites. CSS sudah dicocokkan identik dengan sumber. Bank asli Sites dan Apps Script V4 dicocokkan identik (50 soal). Hash sumber disimpan pada `docs/sumber.json`.

## Pemeriksaan fungsi

- LULUS: Formulir dan aset anonim tanpa bank/kunci; rute file server ditolak.
- LULUS: Kode kosong/salah menghasilkan nol sesi dan nol soal; rekap/CSV dilindungi.
- LULUS: Satu peserta: 25/50; 17 pemahaman + 8 hitungan; timer database tepat 30 menit.
- LULUS: Reset V4: paket berganti, tenggat tetap, event idempoten dan paket lama ditolak.
- LULUS: Validasi jawaban, nilai server 76, kirim paralel/ulang tetap satu hasil.
- LULUS: Tenggat server: jawaban lengkap sesudah 30 menit ditolak; tidak ada nilai.
- LULUS: Bank tersimpan per versi: deployment bank baru tetap menilai sesi lama dengan kunci semula.
- LULUS: UAS ditutup atau kode sama dengan rekap menolak sesi baru; sesi aktif tetap dapat dibuka.
- LULUS: Browser desktop dan viewport seluler dengan bank fiktif.

Browser: Chrome headless: formulir anonim, kode salah/benar, event visibility reset, reload, 25 jawaban, nilai 76, panel dan unduh CSV, viewport 390px.

Uji timer memeriksa selisih mulai-tenggat database **1.800.000 ms**, pengulangan mulai tidak memperpanjang timer, reset tetap memakai tenggat lama, dan pengiriman lengkap sesudah tenggat ditolak HTTP 410 tanpa hasil. Pengujian kedaluwarsa memindahkan waktu sesi dalam database uji ke masa lampau; tidak menunggu 30 menit waktu nyata.

Nilai 76 diuji dengan 19 jawaban benar, sisanya salah, sekaligus mengirim klaim skor 100 dari klien: server tetap menyimpan 76. Delapan kirim paralel pada satu sesi dan kirim ulang dengan payload berbeda mengembalikan hasil pertama yang sama. Kunci jawaban tidak ada pada HTML/JS/API peserta. Endpoint rekap dan CSV memerlukan kode dosen.

## Beban serentak

Setiap putaran meluncurkan 80 permintaan mulai dalam <1 detik dan 80 permintaan kirim dalam <1 detik. Semua permintaan sah berhasil pada percobaan pertama, tanpa retry. Nilai harapan bervariasi dari 0 sampai 100. Tiap nilai, jumlah benar, NIM, nama, dan golongan dicocokkan dengan rekap JSON dan CSV; jumlah hasil PostgreSQL dan kunci uniknya diperiksa. Panel browser diperiksa 80 baris beserta nilainya, filter golongan, dan unduhan CSV yang identik byte demi byte dengan CSV API.

| Putaran | Sesi | Nilai DB | Baris panel | Baris CSV | p95 mulai (detik) | p95 kirim (detik) | Nilai ganda |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 80 | 80 | 80 | 80 | 0.516 | 0.386 | 0 |
| 2 | 80 | 80 | 80 | 80 | 0.452 | 0.376 | 0 |
| 3 | 80 | 80 | 80 | 80 | 0.689 | 0.392 | 0 |

Target p95 ≤5 detik diperiksa oleh assertion. Golongan A/B/C diperiksa masing-masing **27/27/26** peserta. Setelah pengiriman pertama, semua 80 peserta mengirim ulang dan jumlah hasil tetap 80. Putaran ketiga dijalankan sesudah idle lokal 35 detik, PostgreSQL dihentikan/dijalankan kembali, dan pool koneksi baru dibuat.

## Artefak

- `test-results/report.json`: status, pemeriksaan, latensi, dan jumlah aktual.
- `test-results/round-N.csv` dan `round-N-browser.csv`: 80 hasil per putaran dari API dan unduhan browser.
- `test-results/round-N-recap.json` dan `round-N-expected.json`: rekap dan nilai harapan.
- `test-results/round-N-panel.png`: tabel dosen berisi 80 peserta.
- `test-results/form-mobile.png` dan `recap-desktop.png`: tampilan browser.

Jalankan kembali dengan `npm.cmd test`. Tes menyimpan database baru tiap eksekusi dan menghentikan cluster uji setelah selesai. Hanya hasil eksekusi terbaru ditulis ke berkas laporan/CSV. Database pengembangan `uas_local` terpisah dan pada pemeriksaan akhir tetap **0 sesi / 0 nilai**.

## Verifikasi localhost

`npm.cmd run db:local`, `npm.cmd run db:migrate`, dan `npm.cmd run dev` berhasil dijalankan. Server mencetak **http://localhost:3000**, dan halaman serta stylesheet memberikan HTTP 200. Halaman rekap ada di **http://localhost:3000/rekap**. Server pengembangan/database yang dibuka untuk verifikasi dihentikan setelah pekerjaan; jalankan dua terminal sesuai README untuk membuka lagi.

## Yang masih tertunda

- Android Chrome dan iPhone Safari pada perangkat fisik; viewport Chrome 390px sudah diperiksa tanpa overflow horizontal.
- Timer 30 menit waktu nyata, koneksi putus pada jaringan HP, dan perilaku blur/pagehide pada perangkat fisik. Event visibility browser sudah disimulasikan untuk menguji reset V4.
- Deploy dan uji beban di Neon/Vercel, region/latensi internet, serta suspend/cold start platform. Restart PostgreSQL lokal tidak menggantikan uji tersebut.
- Keputusan aturan dosen dalam addendum PRD: pindah tab, simpan draf, percobaan per NIM, waktu pelepasan nilai, auto-submit, panel buka/tutup, pembatasan percobaan kode, histori, dan retensi. Uji pertama tetap mengikuti V4.

Binari PostgreSQL 18 sempat gagal initdb pada Windows ini (0xC0000005); dependensi lokal dipin ke PostgreSQL 17.7 yang berhasil menyelesaikan pengujian. Seluruh hasil yang dinyatakan lulus di atas berasal dari eksekusi final PostgreSQL 17, bukan dari simulasi D1/SQLite atau database dalam memori.
