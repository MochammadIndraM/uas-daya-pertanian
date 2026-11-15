import { createPool, migrate } from '../server/db.mjs';
const pool = createPool(process.env.DATABASE_URL);
try { await migrate(pool); console.log('Skema PostgreSQL siap.'); }
finally { await pool.end(); }
