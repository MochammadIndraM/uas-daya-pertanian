import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { startPostgres } from '../scripts/postgres.mjs';
import { createPool,migrate } from '../server/db.mjs';
import { createApp } from '../server/app.mjs';
import { fixtureBank,answersFor } from './fixture.mjs';
import { browserFlow,verifyLoadPanel } from './browser.mjs';
import { writeReport } from '../scripts/report.mjs';

await mkdir('test-results',{recursive:true});
const report = {dateWib:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Jakarta',dateStyle:'short',timeStyle:'medium'}).format(new Date()),checks:[],rounds:[],status:'running'};
let postgres,pool,server,url;
const baseConfig = {startCode:'KODE-FIKTIF-MULAI',recapCode:'KODE-FIKTIF-DOSEN'};
const dbName = 'uas_test_' + Date.now();
report.database = dbName;
function check(name, fn) { return Promise.resolve().then(fn).then(() => {report.checks.push({name,status:'passed'}); console.log('PASS',name);}); }
async function serve(examId,custom = {}) {
  const config = {...baseConfig,examId,...custom};
  server = createApp(pool,config,fixtureBank).listen(0,'127.0.0.1');
  await new Promise((resolve,reject) => {server.once('listening',resolve);server.once('error',reject);});
  return {base:`http://127.0.0.1:${server.address().port}`,config};
}
async function closeServer() { if(server) {await new Promise(resolve => server.close(resolve));server=null;} }
async function request(base,path,body,headers={}) {
  const started = performance.now();
  const response = await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
  // Response.text() menghapus UTF-8 BOM; simpan byte aslinya untuk menguji CSV Excel.
  const text = Buffer.from(await response.arrayBuffer()).toString('utf8');
  return {status:response.status,headers:response.headers,data:response.headers.get('content-type')?.includes('application/json')?JSON.parse(text):text,ms:performance.now()-started};
}
function identity(i,group='A') {return {id:randomUUID(),fullName:'Peserta Fiktif '+i,nim:'FIKTIF'+i,group,startCode:baseConfig.startCode};}
function composition(questions) {
  assert.equal(questions.length,25);assert.equal(new Set(questions.map(q=>q.id)).size,25);
  assert.equal(questions.some(q=>Object.hasOwn(q,'correct')),false);
  assert.equal(questions.reduce((n,q)=>n+q.points,0),100);
  const numbers = questions.map(q=>Number(q.id.slice(1)));
  for(let i=1;i<=25;i++) assert.equal(numbers.filter(n=>n===i||n===i+25).length,1);
  assert.deepEqual(['Pompa air','Blower','Panel surya','Kincir angin'].map(topic=>['pemahaman','hitungan'].map(section=>questions.filter(q=>q.topic===topic&&q.section===section).length)),[[4,2],[4,2],[5,2],[4,2]]);
}
function parseCsv(csv) {
  const records=[];let row=[],cell='',quoted=false;
  for(let i=1;i<csv.length;i++) {
    const c=csv[i];
    if(c==='"') {if(quoted&&csv[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(!quoted&&c===';'){row.push(cell);cell='';}
    else if(!quoted&&c==='\r'&&csv[i+1]==='\n'){row.push(cell);records.push(row);row=[];cell='';i++;}
    else cell+=c;
  }
  assert.equal(quoted,false);assert.equal(csv.charCodeAt(0),0xfeff);
  return records;
}
async function count(table) {return Number((await pool.query(`SELECT count(*) AS n FROM ${table}`)).rows[0].n);}
try {
  ({postgres,url} = await startPostgres('test',55433));
  await postgres.createDatabase(dbName);
  pool=createPool(url(dbName));await migrate(pool);
  report.postgres=(await pool.query('SELECT version() AS version')).rows[0].version;
  let {base} = await serve('functional');
  await check('Formulir dan aset anonim tanpa bank/kunci; rute file server ditolak',async()=>{
    assert.equal((await request(base,'/')).status,200);
    const script=await request(base,'/app.js');assert.equal(script.status,200);
    assert.doesNotMatch(script.data,/BANK_DAYA_50|"correct"\s*:|google\.script/);
    for(const path of ['/server/bank-v4.json','/.env','/sources/sites-worker.js']) assert.equal((await request(base,path)).status,404);
  });
  await check('Kode kosong/salah menghasilkan nol sesi dan nol soal; rekap/CSV dilindungi',async()=>{
    for(const startCode of ['', 'salah']) {
      const r=await request(base,'/api/attempts',{...identity('SALAH'),startCode});
      assert.equal(r.status,403);assert.equal(r.data.questions,undefined);
    }
    assert.equal(await count('attempts'),0);
    for(const path of ['/api/recap','/api/recap.csv']) assert.equal((await request(base,path,{})).status,403);
    assert.equal((await request(base,'/api/recap',{code:baseConfig.recapCode},{'sec-fetch-site':'cross-site'})).status,403);
  });
  const person=identity('SATU');let opened;
  await check('Satu peserta: 25/50; 17 pemahaman + 8 hitungan; timer database tepat 30 menit',async()=>{
    const r=await request(base,'/api/attempts',person);assert.equal(r.status,200);opened=r.data;composition(opened.questions);
    const row=(await pool.query('SELECT started_at,deadline_at FROM attempts WHERE id=$1',[person.id])).rows[0];
    assert.equal(row.deadline_at-row.started_at,1800000);
    assert.ok(opened.attempt.deadlineAt-opened.attempt.serverTime<=1800000);
    assert.ok(opened.attempt.deadlineAt-opened.attempt.serverTime>1790000);
    const repeated=await Promise.all(Array.from({length:4},()=>request(base,'/api/attempts',person)));
    repeated.forEach(r=>{assert.deepEqual(r.data.questions,opened.questions);assert.equal(r.data.attempt.deadlineAt,opened.attempt.deadlineAt);});
    assert.equal(await count('attempts'),1);
  });
  await check('Reset V4: paket berganti, tenggat tetap, event idempoten dan paket lama ditolak',async()=>{
    const eventId=randomUUID(),original=opened;
    const responses=await Promise.all(Array.from({length:2},()=>request(base,`/api/attempts/${person.id}/reset`,{eventId})));
    responses.forEach(r=>assert.equal(r.status,200));opened=responses[0].data;
    assert.equal(opened.attempt.resetCount,1);composition(opened.questions);
    assert.notDeepEqual(opened.questions.map(q=>q.id).sort(),original.questions.map(q=>q.id).sort());
    assert.equal(opened.attempt.deadlineAt,original.attempt.deadlineAt);
    assert.equal((await request(base,`/api/attempts/${person.id}/submit`,{resetCount:0,answers:answersFor(original.questions)})).status,409);
  });
  await check('Validasi jawaban, nilai server 76, kirim paralel/ulang tetap satu hasil',async()=>{
    const path=`/api/attempts/${person.id}/submit`;
    for(const answers of [{},{...answersFor(opened.questions),BAD:0}]) assert.equal((await request(base,path,{resetCount:1,answers})).status,400);
    const invalid=answersFor(opened.questions);invalid[opened.questions[0].id]=4;
    assert.equal((await request(base,path,{resetCount:1,answers:invalid})).status,400);
    const submitted=await Promise.all(Array.from({length:8},()=>request(base,path,{resetCount:1,answers:answersFor(opened.questions,19),score:100})));
    submitted.forEach(r=>{assert.equal(r.status,200);assert.equal(r.data.attempt.result.correct,19);assert.equal(r.data.attempt.result.score,76);assert.deepEqual(r.data.attempt.result,submitted[0].data.attempt.result);});
    const repeated=await request(base,path,{answers:{}});assert.deepEqual(repeated.data.attempt.result,submitted[0].data.attempt.result);
    assert.equal(await count('results'),1);
    const recap=await request(base,'/api/recap',{code:baseConfig.recapCode});assert.equal(recap.data.results.length,1);assert.equal(recap.data.results[0].score,76);
    const csv=await request(base,'/api/recap.csv',{code:baseConfig.recapCode});assert.equal(parseCsv(csv.data).length,2);
  });
  await check('Tenggat server: jawaban lengkap sesudah 30 menit ditolak; tidak ada nilai',async()=>{
    const p=identity('KEDALUWARSA');const r=await request(base,'/api/attempts',p);
    await pool.query("UPDATE attempts SET started_at=clock_timestamp()-interval '31 minutes', deadline_at=clock_timestamp()-interval '1 minute' WHERE id=$1",[p.id]);
    const sent=await request(base,`/api/attempts/${p.id}/submit`,{resetCount:0,answers:answersFor(r.data.questions),deadlineAt:Date.now()+1800000});
    assert.equal(sent.status,410);assert.equal(sent.data.attempt.status,'expired');assert.equal(await count('results'),1);
    assert.equal((await request(base,`/api/attempts/${p.id}`)).data.attempt.status,'expired');
  });
  await check('Bank tersimpan per versi: deployment bank baru tetap menilai sesi lama dengan kunci semula',async()=>{
    const p=identity('VERSI');const opened=await request(base,'/api/attempts',p);await closeServer();
    const changed=fixtureBank.map(q=>({...q,correct:(q.correct+1)%4}));
    server=createApp(pool,{...baseConfig,examId:'functional'},changed).listen(0,'127.0.0.1');
    await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}`;
    const sent=await request(base,`/api/attempts/${p.id}/submit`,{resetCount:0,answers:answersFor(opened.data.questions)});
    assert.equal(sent.data.attempt.result.score,100);await closeServer();({base}=await serve('functional'));
  });
  await check('UAS ditutup atau kode sama dengan rekap menolak sesi baru; sesi aktif tetap dapat dibuka',async()=>{
    await closeServer();({base}=await serve('functional',{startCode:''}));
    assert.equal((await request(base,'/api/attempts',identity('TUTUP'))).status,403);
    assert.equal((await request(base,`/api/attempts/${person.id}`)).status,200);
    await closeServer();({base}=await serve('functional',{startCode:baseConfig.recapCode}));
    assert.equal((await request(base,'/api/attempts',{...identity('SAMA'),startCode:baseConfig.recapCode})).status,403);
    await closeServer();({base}=await serve('functional'));
  });
  await check('Browser desktop dan viewport seluler dengan bank fiktif',async()=>{report.browser=await browserFlow(base,baseConfig);});
  await closeServer();
  for(let round=1;round<=3;round++) {
    if(round===3) {
      console.log('Menunggu idle lokal 35 detik sebelum restart PostgreSQL dan koneksi baru (bukan simulasi Neon suspend).');
      await delay(35000);await pool.end();await postgres.stop();
      ({postgres,url}=await startPostgres('test',55433));pool=createPool(url(dbName));
    }
    const examId='load-round-'+round;
    ({base}=await serve(examId));
    const people=Array.from({length:80},(_,i)=>identity(`R${round}P${String(i).padStart(3,'0')}`,['A','B','C'][i%3]));
    const launch = async tasks => {
      const stamps=[];
      const responses=await Promise.all(tasks.map(task=>{stamps.push(performance.now());return task();}));
      const windowMs=stamps.at(-1)-stamps[0];assert.ok(windowMs<1000);
      responses.forEach(r=>assert.equal(r.status,200,JSON.stringify(r.data)));
      const latencies=responses.map(r=>r.ms).sort((a,b)=>a-b);
      const p95Ms=latencies[Math.ceil(latencies.length*.95)-1];assert.ok(p95Ms<=5000,`p95 ${p95Ms}`);
      return {responses,windowMs,p95Ms,maxMs:latencies.at(-1)};
    };
    const starts=await launch(people.map(person=>()=>request(base,'/api/attempts',person)));
    starts.responses.forEach(r=>composition(r.data.questions));
    const expected=people.map((person,i)=>({...person,correct:i%26,score:(i%26)*4,answers:answersFor(starts.responses[i].data.questions,i%26)}));
    const sends=await launch(expected.map(p=>()=>request(base,`/api/attempts/${p.id}/submit`,{answers:p.answers,resetCount:0})));
    sends.responses.forEach((r,i)=>{assert.equal(r.data.attempt.result.score,expected[i].score);assert.equal(r.data.attempt.result.correct,expected[i].correct);});
    const recap=await request(base,'/api/recap',{code:baseConfig.recapCode});assert.equal(recap.data.results.length,80);
    const byNim=new Map(expected.map(p=>[p.nim,p]));
    recap.data.results.forEach(r=>{const e=byNim.get(r.nim);assert.ok(e);assert.equal(r.full_name,e.fullName);assert.equal(r.group_name,e.group);assert.equal(r.score,e.score);assert.equal(r.correct_count,e.correct);});
    const csv=await request(base,'/api/recap.csv',{code:baseConfig.recapCode});assert.equal(csv.status,200);
    const records=parseCsv(csv.data);assert.equal(records.length,81);
    assert.deepEqual(records[0],['Nama lengkap','NIM','Golongan','Jawaban benar','Nilai','Dikirim (WIB)','Jumlah reset','Reset terakhir (WIB)']);
    assert.equal(new Set(records.slice(1).map(r=>r[1])).size,80);
    records.slice(1).forEach(r=>{const e=byNim.get(r[1]);assert.ok(e);assert.equal(r[0],e.fullName);assert.equal(r[2],e.group);assert.equal(Number(r[3]),e.correct);assert.equal(Number(r[4]),e.score);});
    for(const group of ['A','B','C']) {
      const filtered=await request(base,'/api/recap',{code:baseConfig.recapCode,group});
      const desired=expected.filter(e=>e.group===group);
      assert.equal(filtered.data.results.length,desired.length);filtered.data.results.forEach(r=>assert.equal(r.score,byNim.get(r.nim).score));
      const filteredCsv=await request(base,'/api/recap.csv',{code:baseConfig.recapCode,group});
      assert.equal(parseCsv(filteredCsv.data).length,desired.length+1);
    }
    const duplicates=await Promise.all(expected.map(p=>request(base,`/api/attempts/${p.id}/submit`,{answers:{}})));
    duplicates.forEach((r,i)=>{assert.equal(r.status,200);assert.deepEqual(r.data.attempt.result,sends.responses[i].data.attempt.result);});
    const counts=(await pool.query('SELECT count(*)::int AS sessions,count(r.attempt_id)::int AS results,count(DISTINCT r.attempt_id)::int AS unique_results FROM attempts a LEFT JOIN results r ON r.attempt_id=a.id WHERE a.exam_id=$1',[examId])).rows[0];
    assert.deepEqual(counts,{sessions:80,results:80,unique_results:80});
    await verifyLoadPanel(base,baseConfig,expected,csv.data,round);
    await writeFile(`test-results/round-${round}.csv`,csv.data);
    await writeFile(`test-results/round-${round}-recap.json`,JSON.stringify(recap.data.results,null,2));
    await writeFile(`test-results/round-${round}-expected.json`,JSON.stringify(expected.map(({startCode,answers,...p})=>p),null,2));
    const summary={round,examId,mode:round===3?'35s idle + PostgreSQL restart + new pool':'local',...counts,start:{launchWindowMs:starts.windowMs,p95Ms:starts.p95Ms,maxMs:starts.maxMs},submit:{launchWindowMs:sends.windowMs,p95Ms:sends.p95Ms,maxMs:sends.maxMs},csvRows:records.length-1,panelRows:80,browserCsvMatches:true,duplicates:0};
    report.rounds.push(summary);console.log('PASS round',JSON.stringify(summary));await closeServer();
  }
  report.status='passed';
} catch(error) {
  report.status='failed';report.error=error.stack;console.error(error);process.exitCode=1;
} finally {
  await closeServer();if(pool) await pool.end();if(postgres) await postgres.stop();
  await writeFile('test-results/report.json',JSON.stringify(report,null,2)+'\n');
  await writeReport(report);
  console.log('Hasil:',report.status,'— test-results/report.json. Database uji dipertahankan di .local/test.');
}
// Semua resource sudah ditutup. Hindari beforeExit dependensi mengubah status gagal menjadi 0.
process.exit(report.status === 'passed' ? 0 : 1);
