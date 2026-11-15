import pg from 'pg';
import { readFile } from 'node:fs/promises';

export function createPool(connectionString) {
  if (!connectionString) throw new Error('DATABASE_URL belum diisi. Jalankan npm.cmd run db:local atau isi .env.');
  const pool = new pg.Pool({ connectionString, max: 10, connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000 });
  pool.on('error', () => console.error('Database pool connection failed'));
  return pool;
}
export async function migrate(pool) {
  await pool.query(await readFile(new URL('../sql/001-init.sql', import.meta.url), 'utf8'));
  await pool.query(await readFile(new URL('../sql/002-exam-banks.sql', import.meta.url), 'utf8'));
}
export async function transaction(pool, action) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await action(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
