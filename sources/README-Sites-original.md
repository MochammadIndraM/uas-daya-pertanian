# UAS Daya Dalam Bidang Pertanian

Paket ini berisi sumber kuis dengan 50 soal, pemilihan 25 soal dengan komposisi tetap, reset saat tab ditinggalkan, durasi 30 menit, penilaian di server, rekap dosen, dan unduh CSV. Simpan paket ini untuk dosen karena sumber server memuat kunci jawaban.

## Penerbitan

Pakai proyek ChatGPT Sites yang sudah ada dengan slug `uas-daya-dalam-bidang-pertanian`. Identitas proyek dan binding database D1 `DB` sudah ada di `.openai/hosting.json`. Gunakan alur Sites untuk membuka repositori proyek, menyalin sumber ini, mendorong commit yang diverifikasi, menyimpan versi, dan menerbitkannya. Kode rekap ditentukan melalui rahasia server `KODE_REKAP_DOSEN` sebelum pengujian. Gunakan kode acak yang kuat dan simpan kepada dosen. Proyek belum mempunyai URL terbit ketika paket ini dibuat.

Jalankan dengan Node.js 22.13 atau lebih baru.

```bash
npm run build
npm test
```

Uji dengan identitas fiktif di perangkat seluler. Untuk uji anonim, aktifkan akses publik di proyek yang sama. Pastikan dari HP tanpa login halaman terbuka, membuka sesi menampilkan 25 soal, pindah tab mengembalikan ke nomor 1 dengan paket baru, dan durasi tetap berjalan. Setelah kirim, cocokkan nama, NIM, jumlah jawaban benar, nilai, golongan, serta jumlah reset di rekap dan CSV. Pastikan permintaan rekap memerlukan kode yang benar. Uji pembukaan beberapa sesi bersamaan sesuai jumlah mahasiswa yang akan mengikuti UAS. Bersihkan hanya baris data fiktif yang dipakai dalam pengujian.

Kuis ini menerima nama dan NIM yang diisi peserta. Tentukan kapan tautan dibagikan agar bank soal tidak beredar sebelum sesi ujian. QR lama mengarah ke Apps Script. Buat QR baru setelah URL produksi lolos uji.
