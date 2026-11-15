import { access, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { startPostgres } from './postgres.mjs';
import { createPool, migrate } from '../server/db.mjs';

const {postgres,url} = await startPostgres('dev',55432);
const admin = createPool(url('postgres'));
if (!(await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',['uas_local'])).rowCount) await postgres.createDatabase('uas_local');
await admin.end();
const pool = createPool(url('uas_local'));
await migrate(pool); await pool.end();
let envExists = true;
try { await access('.env'); } catch { envExists = false; }
if (!envExists) {
  await writeFile('.env',`DATABASE_URL=${url('uas_local')}\nPORT=3000\nKODE_MULAI_UAS=MULAI-LOKAL\nKODE_REKAP_DOSEN=${randomBytes(24).toString('hex')}\nEXAM_ID=uas-daya-v4-local\n`,{flag:'wx',mode:0o600});
  console.log('.env dibuat. Kode mulai lokal: MULAI-LOKAL. Kode rekap tersedia di .env.');
} else console.log('.env yang ada dipertahankan. Database lokal tersedia; cocokkan DATABASE_URL bila memakai database sendiri.');
console.log('PostgreSQL lokal siap di 127.0.0.1:55432. Biarkan terminal ini terbuka.');
console.log('Buka terminal kedua: npm.cmd run dev');
const keepAlive = setInterval(() => {},60000);
async function stop() { clearInterval(keepAlive); await postgres.stop(); process.exit(0); }
process.on('SIGINT',stop); process.on('SIGTERM',stop);
