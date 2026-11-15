import { createHash, timingSafeEqual } from 'node:crypto';
import { bankV4, bankVersion, selectPackage } from './bank.mjs';
import { transaction } from './db.mjs';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const groups = new Set(['A','B','C']);
const fail = (error, status, payload = {}) => ({error, status, ...payload});
const hash = s => createHash('sha256').update(s).digest();
const matches = (input, secret) => typeof input === 'string' && !!secret && timingSafeEqual(hash(input.trim()), hash(secret));
const ms = date => date == null ? null : new Date(date).getTime();

export function createService(pool, config, bank = bankV4) {
  const version = bankVersion(bank);
  selectPackage(bank);
  let bankReady;
  const ensureBank = () => bankReady ??= pool.query('INSERT INTO bank_versions(version, questions) VALUES ($1,$2) ON CONFLICT DO NOTHING', [version, JSON.stringify(bank)]).catch(e => { bankReady = null; throw e; });

  async function read(client, id, lock = false) {
    const {rows} = await client.query(`SELECT a.*, b.questions AS bank FROM attempts a JOIN bank_versions b ON b.version=a.bank_version WHERE a.id=$1 AND a.exam_id=$2 ${lock ? 'FOR UPDATE OF a' : ''}`, [id,config.examId]);
    if (!rows[0]) return null;
    const row = rows[0];
    row.result = (await client.query('SELECT * FROM results WHERE attempt_id=$1',[id])).rows[0];
    return row;
  }
  async function payload(client, row) {
    const {rows} = await client.query('SELECT clock_timestamp() AS now');
    const now = ms(rows[0].now);
    const byId = new Map(row.bank.map(q => [q.id,q]));
    return {
      attempt: { id:row.id, fullName:row.full_name, nim:row.nim, group:row.group_name,
        deadlineAt:ms(row.deadline_at), serverTime:now, resetCount:row.reset_events.length,
        lastResetAt:ms(row.last_reset_at),
        status:row.result ? 'submitted' : now >= ms(row.deadline_at) ? 'expired' : 'active',
        result: row.result ? {correct:row.result.correct_count, score:row.result.score, maxScore:100, submittedAt:ms(row.result.submitted_at)} : null },
      questions: row.question_ids.map(id => {
        const {section,topic,prompt,options,points} = byId.get(id);
        return {id,section,topic,prompt,options,points};
      })
    };
  }
  async function start(data) {
    const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';
    const nim = typeof data.nim === 'string' ? data.nim.trim().toUpperCase() : '';
    if (!uuid.test(data.id) || fullName.length < 2 || fullName.length > 100 || /[\u0000-\u001f\u007f]/u.test(fullName) || !/^[A-Z0-9]{3,25}$/.test(nim) || !groups.has(data.group)) return fail('Isi nama, NIM (3–25 huruf atau angka), dan golongan.',400);
    const code = config.startCode?.trim(), recap = config.recapCode?.trim();
    if (!code || code.length > 100 || code === recap) return fail('UAS belum dibuka. Tunggu kode dari dosen.',403);
    if (!matches(data.startCode,code)) return fail('Kode mulai UAS tidak valid.',403);
    await ensureBank();
    return transaction(pool, async client => {
      await client.query(`INSERT INTO attempts(id,exam_id,full_name,nim,group_name,bank_version,question_ids,started_at,deadline_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,statement_timestamp(),statement_timestamp()+interval '30 minutes') ON CONFLICT(id) DO NOTHING`,
      [data.id,config.examId,fullName,nim,data.group,version,JSON.stringify(selectPackage(bank))]);
      const row = await read(client,data.id,true);
      return row ? payload(client,row) : fail('Sesi UAS tidak ditemukan.',404);
    });
  }
  async function recap(data) {
    if (!matches(data.code,config.recapCode?.trim())) return fail('Kode rekap tidak valid.',403);
    if (data.group && !groups.has(data.group)) return fail('Golongan tidak valid.',400);
    const {rows} = await pool.query(`SELECT a.full_name,a.nim,a.group_name,r.correct_count,r.score,r.submitted_at,
      jsonb_array_length(a.reset_events) AS reset_count,a.last_reset_at FROM results r JOIN attempts a ON a.id=r.attempt_id
      WHERE a.exam_id=$1 AND ($2::text IS NULL OR a.group_name=$2)
      ORDER BY r.submitted_at DESC,a.nim,a.id`,[config.examId,data.group || null]);
    return {results:rows.map(r => ({...r,submitted_at:ms(r.submitted_at),last_reset_at:ms(r.last_reset_at)}))};
  }
  async function rpc(action, data = {}) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
    if (action === 'start') return start(data);
    if (action === 'recap') return recap(data);
    if (!['get','reset','submit'].includes(action) || !uuid.test(data.id)) return fail('Sesi UAS tidak ditemukan.',404);
    return transaction(pool, async client => {
      const row = await read(client,data.id,true);
      if (!row) return fail('Sesi UAS tidak ditemukan.',404);
      let state = await payload(client,row);
      if (action === 'get') return state;
      if (action === 'reset') {
        if (!uuid.test(data.eventId)) return fail('Catatan reset tidak valid.',400);
        if (state.attempt.status !== 'active' || row.reset_events.includes(data.eventId)) return state;
        if (row.reset_events.length >= 120) return fail('Batas pencatatan reset sesi ini tercapai.',429);
        row.question_ids = selectPackage(row.bank,row.question_ids);
        row.reset_events.push(data.eventId);
        const {rows} = await client.query('UPDATE attempts SET question_ids=$2,reset_events=$3,last_reset_at=clock_timestamp() WHERE id=$1 RETURNING last_reset_at',[row.id,JSON.stringify(row.question_ids),JSON.stringify(row.reset_events)]);
        row.last_reset_at = rows[0].last_reset_at;
        return payload(client,row);
      }
      if (state.attempt.status === 'submitted') return state;
      if (state.attempt.status === 'expired') return fail('Waktu pengerjaan sudah habis.',410,state);
      if (data.resetCount !== row.reset_events.length) return fail('Paket sudah berubah. Mulai lagi dari soal pertama.',409,state);
      const answers = data.answers;
      const byId = new Map(row.bank.map(q => [q.id,q]));
      const qs = row.question_ids.map(id => byId.get(id));
      if (!answers || typeof answers !== 'object' || Array.isArray(answers) || Object.keys(answers).length !== 25 || !qs.every(q => Number.isInteger(answers[q.id]) && answers[q.id] >= 0 && answers[q.id] < q.options.length)) return fail('Jawab semua soal pada paket aktif sebelum mengirim.',400);
      const correct = qs.filter(q => answers[q.id] === q.correct);
      const {rows} = await client.query(`WITH stamp AS MATERIALIZED (SELECT clock_timestamp() AS now)
        INSERT INTO results(attempt_id,correct_count,score,answers,submitted_at)
        SELECT $1,$2,$3,$4,stamp.now FROM stamp WHERE stamp.now < $5::timestamptz RETURNING *`,
      [row.id,correct.length,correct.reduce((n,q) => n+q.points,0),JSON.stringify(answers),row.deadline_at]);
      if (!rows[0]) return fail('Waktu pengerjaan sudah habis.',410,await payload(client,row));
      row.result = rows[0];
      return payload(client,row);
    });
  }
  return {rpc};
}
