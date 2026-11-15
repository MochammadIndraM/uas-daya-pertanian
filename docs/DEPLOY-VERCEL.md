# Deploy ke Vercel dari Windows

Konfigurasi lokal sudah disiapkan. Panduan ini tidak berarti deployment sudah dilakukan. Akun Neon dan Vercel menggunakan akun milik dosen/pengelola.

## 1. Buat PostgreSQL online

1. Buka https://console.neon.tech dan buat proyek/database baru khusus aplikasi online. Pertahankan database lokal untuk localhost.
2. Pada Neon, buka **SQL Editor** untuk database yang dipilih.
3. Salin seluruh isi `sql/001-init.sql` dari VS Code, tempel di SQL Editor, lalu jalankan. Tabel `bank_versions`, `attempts`, dan `results` akan dibuat. Bank asli dimasukkan otomatis oleh backend saat sesi pertama berhasil dimulai.
4. Klik **Connect**, aktifkan **Connection pooling**, dan salin connection string PostgreSQL lengkap dengan parameter SSL yang diberikan Neon. URL ini akan menjadi `DATABASE_URL` di Vercel. URL lokal `127.0.0.1:55432` tidak bisa digunakan oleh aplikasi Vercel.

Referensi: [koneksi Neon](https://neon.com/docs/connect/connect-from-any-app).

## 2. Hubungkan folder dengan proyek Vercel

Di terminal PowerShell VS Code:

```powershell
cd C:\laragon\www\uas-daya-pertanian
npx.cmd vercel@latest login
npx.cmd vercel@latest link
```

Ikuti login melalui browser. Pada `link`, pilih akun/team yang benar. Untuk proyek baru, pilih membuat proyek baru, nama misalnya `uas-daya-pertanian`, dan direktori kode `./`. Jika proyek sudah ada, pilih proyek tersebut. Jika ditanya framework, pilih **Other**. Node.js pilih **24.x** pada pengaturan proyek agar sesuai lingkungan uji lokal. Tidak perlu mengunggah kode ke GitHub untuk jalur CLI ini.

`vercel.json` menetapkan direktori publik `public`, entry function `api/index.mjs`, serta route API dan `/rekap`. Tidak diperlukan build frontend. Dependensi pengembangan seperti PostgreSQL lokal dan Playwright tidak dipasang pada deployment.

Referensi: [vercel link](https://vercel.com/docs/cli/link).

## 3. Isi environment variables Vercel

Buka dashboard Vercel → proyek → **Settings → Environment Variables**. Tambahkan untuk lingkungan **Production**:

| Nama | Nilai |
| --- | --- |
| `DATABASE_URL` | Connection string pooled dari Neon, bukan URL localhost |
| `KODE_MULAI_UAS` | Kode mulai yang dipilih dosen, maksimal 100 karakter |
| `KODE_REKAP_DOSEN` | Kode dosen yang berbeda dari kode mulai, maksimal 100 karakter |
| `EXAM_ID` | Misalnya `uas-daya-2026-simulasi` |

`PORT` tidak perlu diatur. Berkas `.env` komputer tidak otomatis menjadi konfigurasi produksi; `.vercelignore` mengecualikannya bersama database lokal, sumber arsip, dan hasil tes.

Untuk membagikan formulir sementara sesi baru ditutup, hapus/tidak isi `KODE_MULAI_UAS`. Untuk simulasi pertama, isi kode dan gunakan identitas fiktif. Jangan mengganti `EXAM_ID` saat ujian berlangsung karena rekap dan akses sesi menggunakan ID tersebut. Gunakan database online terpisah untuk simulasi dan ujian sungguhan.

Jika nanti menggunakan Preview, isi environment Preview dengan database uji terpisah. Referensi: [environment variables Vercel](https://vercel.com/docs/environment-variables).

## 4. Deploy

Setelah skema database dan environment Production selesai:

```powershell
npx.cmd vercel@latest --prod
```

Perintah menampilkan URL deployment bila berhasil. Buka URL Production yang ditampilkan, dan tambahkan `/rekap` untuk dosen. Jika diminta menghubungkan folder lagi, gunakan proyek yang sama.

Untuk perubahan kode berikutnya, jalankan perintah deploy yang sama. Perubahan environment di dashboard baru berlaku setelah **redeploy**; perubahan `.env` lokal tidak mengubah situs online.

Referensi: [deploy CLI](https://vercel.com/docs/cli/deploy).

## 5. Periksa sebelum membagikan tautan

- Buka URL Production pada mode incognito tanpa akun Vercel. Jika muncul login Vercel, periksa **Settings → Deployment Protection** agar URL Production dapat diakses mahasiswa anonim. Perlindungan kode mulai dan kode dosen tetap berlaku di aplikasi.
- Uji kode salah: tidak boleh ada soal atau sesi baru. Uji kode benar dengan identitas fiktif, jawab, kirim, lalu cocokkan rekap dan CSV.
- Periksa HP Android/iPhone dan uji beban pada lingkungan online terpisah. Kelulusan uji localhost belum membuktikan latensi, koneksi database, atau cold start Vercel/Neon.
- HTTP 503 pada API: periksa Runtime Logs Vercel, `DATABASE_URL` Production, dan keberadaan tabel pada database yang dituju. Jangan membagikan connection string atau kode dosen dalam tangkapan layar/log.

Referensi: [Deployment Protection](https://vercel.com/docs/deployment-protection).
