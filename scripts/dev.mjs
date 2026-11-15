import { createPool } from '../server/db.mjs';
import { createApp } from '../server/app.mjs';

const pool = createPool(process.env.DATABASE_URL);
try { await pool.query('SELECT 1 FROM attempts LIMIT 1'); }
catch { console.error('Database belum siap. Jalankan npm.cmd run db:local atau npm.cmd run db:migrate.'); await pool.end(); process.exit(1); }
const app = createApp(pool, {
  examId:process.env.EXAM_ID || 'uas-daya-v4',
  startCode:process.env.KODE_MULAI_UAS,
  recapCode:process.env.KODE_REKAP_DOSEN,
});
const port = Number(process.env.PORT || 3000);
const server = app.listen(port,'127.0.0.1',() => {
  console.log(`Local: http://localhost:${port}`);
  console.log(`Rekap dosen: http://localhost:${port}/?halaman=rekap`);
  console.log(`Sesi baru: ${process.env.KODE_MULAI_UAS ? 'dibuka dengan kode .env' : 'ditutup (kode mulai kosong)'}`);
});
server.on('error',async error => { console.error(error.code === 'EADDRINUSE' ? 'Port terpakai; ubah PORT di .env.' : 'Server gagal dimulai.'); await pool.end(); process.exit(1); });
async function stop() { server.close(async () => { await pool.end(); process.exit(0); }); }
process.on('SIGINT',stop); process.on('SIGTERM',stop);
