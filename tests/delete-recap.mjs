import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startPostgres } from '../scripts/postgres.mjs';
import { createPool,migrate } from '../server/db.mjs';
import { createApp } from '../server/app.mjs';
import { fixtureBank,answersFor } from './fixture.mjs';

const report = {status:'running',checks:[],database:'uas_delete_test_'+Date.now()};
let postgres,pool,server,browser;
const config = {examId:'delete-test',startCode:'MULAI-FIKTIF',recapCode:'DOSEN-FIKTIF'};
function passed(name) {report.checks.push(name);console.log('PASS:',name);}
try {
  await mkdir('test-results',{recursive:true});
  const db = await startPostgres('test',55433);postgres=db.postgres;
  await postgres.createDatabase(report.database);pool=createPool(db.url(report.database));await migrate(pool);
  server=createApp(pool,config,fixtureBank).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  async function api(path,body) {
    const response=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
    const text=Buffer.from(await response.arrayBuffer()).toString('utf8');
    return {status:response.status,data:response.headers.get('content-type')?.includes('application/json')?JSON.parse(text):text};
  }
  async function participant(name,correct=25) {
    const id=randomUUID();
    const opened=await api('/api/attempts',{id,fullName:name,nim:'SAMA123',group:'A',startCode:config.startCode});assert.equal(opened.status,200);
    if(correct!==null) assert.equal((await api(`/api/attempts/${id}/submit`,{resetCount:0,answers:answersFor(opened.data.questions,correct)})).status,200);
    return id;
  }
  const first=await participant('Peserta Fiktif Hapus',25);
  const second=await participant('Peserta Fiktif Tetap',19);
  const active=await participant('Peserta Fiktif Aktif',null);
  const foreign=await participant('Peserta Fiktif Ujian Lain',10);
  await pool.query('UPDATE attempts SET exam_id=$2 WHERE id=$1',[foreign,'other-exam']);
  for(const code of [undefined,'SALAH']) assert.equal((await api('/api/recap/delete',{id:first,code})).status,403);
  assert.equal((await api('/api/recap/delete',{id:'tidak-valid',code:config.recapCode})).status,400);
  assert.equal((await api('/api/recap/delete',{id:foreign,code:config.recapCode})).status,404);
  assert.equal((await api('/api/recap/delete',{id:active,code:config.recapCode})).status,409);
  const crossSite=await fetch(base+'/api/recap/delete',{method:'POST',headers:{'Content-Type':'application/json','Sec-Fetch-Site':'cross-site'},body:JSON.stringify({id:first,code:config.recapCode})});assert.equal(crossSite.status,403);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM results')).rows[0].n,3);
  passed('Kode kosong/salah, lintas situs, ID invalid, ujian lain, dan sesi aktif ditolak tanpa menghapus hasil');

  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({acceptDownloads:true});page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/rekap');await page.locator('#recap-code').fill(config.recapCode);await page.locator('#recap-login button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('#count').textContent==='2');
  assert.equal(await page.locator('[data-delete-id]').count(),2);
  page.once('dialog',async dialog=>{assert.match(dialog.message(),/Peserta Fiktif Hapus/);assert.match(dialog.message(),/permanen/);await dialog.dismiss();});
  await page.locator(`[data-delete-id="${first}"]`).click();
  assert.equal((await api('/api/recap',{code:config.recapCode})).data.results.length,2);
  passed('Tombol per baris menampilkan identitas dan konfirmasi permanen; Batal mempertahankan data');

  page.once('dialog',dialog=>dialog.accept());await page.locator(`[data-delete-id="${first}"]`).click();
  await page.waitForFunction(()=>document.querySelector('#count').textContent==='1');
  assert.equal(await page.locator('[data-delete-id]').count(),1);
  assert.match(await page.locator('#recap-rows').innerText(),/Peserta Fiktif Tetap/);
  assert.equal(await page.locator('#average').innerText(),'76');assert.equal(await page.locator('#highest').innerText(),'76');
  assert.equal((await api(`/api/attempts/${first}`)).status,404);
  assert.equal((await api(`/api/attempts/${first}/submit`,{answers:{}})).status,404);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM attempts WHERE id=$1',[first])).rows[0].n,0);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM results WHERE attempt_id=$1',[first])).rows[0].n,0);
  const recap=(await api('/api/recap',{code:config.recapCode})).data.results;assert.deepEqual(recap.map(r=>r.id),[second]);
  const downloadEvent=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadEvent;
  await download.saveAs('test-results/delete-recap.csv');
  const csv=await readFile('test-results/delete-recap.csv','utf8');assert.doesNotMatch(csv,/Peserta Fiktif Hapus/);assert.match(csv,/Peserta Fiktif Tetap/);
  passed('Konfirmasi menghapus tepat satu sesi/hasil; NIM sama tetap aman; statistik dan CSV browser diperbarui');

  await page.screenshot({path:'test-results/delete-recap.png',fullPage:true});
  page.once('dialog',dialog=>dialog.accept());await page.locator(`[data-delete-id="${second}"]`).click();
  await page.waitForFunction(()=>document.querySelector('#count').textContent==='0');
  assert.equal(await page.locator('#export').isDisabled(),true);
  assert.equal(await page.locator('#recap-empty').isVisible(),true);
  const emptyCsv=await api('/api/recap.csv',{code:config.recapCode});assert.equal(emptyCsv.data.trim().split('\r\n').length,1);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM results WHERE attempt_id=$1',[foreign])).rows[0].n,1);
  assert.equal((await api(`/api/attempts/${active}`)).data.attempt.status,'active');
  passed('Hapus baris terakhir menghasilkan rekap/CSV kosong; data ujian lain dan sesi aktif tetap utuh');

  const concurrent=await participant('Peserta Fiktif Paralel',5);
  const repeated=await Promise.all(Array.from({length:2},()=>api('/api/recap/delete',{id:concurrent,code:config.recapCode})));
  assert.deepEqual(repeated.map(r=>r.status).sort(),[200,404]);
  assert.equal((await api('/api/recap',{code:config.recapCode})).data.results.length,0);
  assert.deepEqual(errors,[]);
  passed('Dua penghapusan paralel aman; hasil tetap terhapus dan tidak ada error JavaScript');
  report.status='passed';
} catch(error) {report.status='failed';report.error=error.stack;console.error(error);}
finally {
  if(browser) await browser.close();
  if(server) await new Promise(resolve=>server.close(resolve));
  if(pool) await pool.end();
  if(postgres) await postgres.stop();
  await writeFile('test-results/delete-report.json',JSON.stringify(report,null,2)+'\n');
}
process.exit(report.status==='passed'?0:1);
