import { createPool } from '../server/db.mjs';
import { createApp } from '../server/app.mjs';

const app = createApp(createPool(process.env.DATABASE_URL), {
  examId:process.env.EXAM_ID || 'uas-daya-v4',
  startCode:process.env.KODE_MULAI_UAS,
  recapCode:process.env.KODE_REKAP_DOSEN,
});
export default app;
