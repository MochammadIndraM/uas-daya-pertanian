# Addendum PRD 0.2 — implementasi dan uji lokal Windows

Tanggal: 15 November 2026. Melengkapi PRD 0.1; aturan usulan tidak otomatis berlaku pada simulasi pertama.

## Keputusan untuk pengujian pertama

- Tampilan memakai HTML, CSS, dan JavaScript paket sumber Sites. Backend memakai Node.js, endpoint Vercel Functions, dan PostgreSQL. Apps Script V4 menjadi acuan perilaku.
- Formulir terbuka anonim. Kode kosong/salah atau konfigurasi mulai kosong tidak membuat sesi dan tidak mengirim soal. Timer server 30 menit mulai saat sesi pertama berhasil disimpan.
- Paket memilih satu dari masing-masing pasangan q1/q26 sampai q25/q50, diacak urutannya: 17 pemahaman dan 8 hitungan; pompa 4+2, blower 4+2, panel surya 5+2, kincir angin 4+2. Tiap jawaban benar 4 poin.
- Pindah tab/kehilangan fokus selama 1 detik mengikuti V4: jawaban draf terhapus, paket berganti, posisi kembali ke awal, tenggat tetap. Pagehide/muat ulang dapat memicu reset yang sama. Draf tidak dipersistenkan dalam uji pertama.
- Kirim manual dengan 25 jawaban lengkap sebelum tenggat. Sesudah tenggat server menolak; tidak membuat nilai otomatis. Nilai dan jumlah benar tampil setelah kirim seperti V4.
- Token UUID acak disimpan pada sessionStorage browser, tidak menggunakan NIM untuk membuka sesi. Idempotensi kirim dijamin transaksi per sesi dan kunci primer hasil. NIM yang sama boleh membuat percobaan baru seperti V4.
- Rekap dan ekspor CSV dilindungi kode dosen. Mulai dibuka/ditutup dengan KODE_MULAI_UAS pada konfigurasi; perubahan memerlukan restart server lokal.
- Bank diberi versi berdasarkan SHA-256, disimpan dalam PostgreSQL, dan dipakai kembali untuk penilaian/reset sesi lama meskipun sumber bank berubah.
- Uji otomatis memakai bank fiktif dan database uji terpisah; bank UAS asli tidak dipakai untuk uji peserta. Tidak ada deployment pada pekerjaan ini.

## Keputusan dosen yang masih terbuka

| Usulan PRD 0.1 | Perilaku uji pertama | Keputusan yang diperlukan |
| --- | --- | --- |
| Pindah tab hanya dicatat | V4 menghapus draf dan mengganti paket | Pilih kebijakan sebelum simulasi mahasiswa, khususnya HP |
| Pulihkan jawaban saat reload | V4 tidak menyimpan jawaban draf | Setujui atau tolak persistensi draf dan penanganan pagehide |
| Satu percobaan per NIM per ujian | Belum dibatasi, mengikuti V4 | Aturan NIM unik dan prosedur pemulihan/ganti perangkat |
| Nilai hanya tampil di panel dosen | Nilai peserta langsung tampil setelah kirim | Waktu pelepasan nilai kepada peserta |
| Kirim otomatis ketika waktu habis | Kirim manual, terlambat ditolak | Apakah auto-submit diperlukan dan aturan koneksi putus |
| Panel buka/tutup dan hash kode tanpa deploy | Kode server dari .env, restart lokal | Autentikasi dosen, pengaturan tersimpan, audit, dan batas percobaan kode sebelum publikasi |
| Impor histori Apps Script | Belum diimpor | Kebutuhan arsip, retensi, kepemilikan akun, dan prosedur penghapusan |
| Infrastruktur produksi Neon/Vercel | PostgreSQL localhost | Region, paket/kuota, pooling, latensi, serta uji suspend/cold start produksi |

## Batas penerimaan

Laporan pengujian aktual berada di `test-results/report.json` dan `docs/HASIL-UJI-LOKAL.md`. Uji browser desktop/viewport seluler tidak menggantikan Android dan iPhone fisik. Idle/restart PostgreSQL lokal tidak membuktikan perilaku suspend Neon atau Vercel. Pengujian deployment dan uji HP fisik tetap diperlukan sebelum penerbitan produksi.
