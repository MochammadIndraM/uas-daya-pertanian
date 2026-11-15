import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import ExcelJS from 'exceljs';
import {chromium} from 'playwright';
import {startPostgres} from '../scripts/postgres.mjs';
import {createPool,migrate} from '../server/db.mjs';
import {createApp} from '../server/app.mjs';
import {createService} from '../server/service.mjs';
import {bankVersion} from '../server/bank.mjs';
import {createBankExcel,parseBankExcel,MAX_EXCEL_BYTES} from '../server/bank-excel.mjs';
import {fixtureBank} from './fixture.mjs';

const config={examId:'bank-fiktif',startCode:'MULAI-FIKTIF',recapCode:'DOSEN-FIKTIF'};
const report={status:'running',database:'uas_bank_test_'+Date.now(),checks:[]};
let postgres,pool,server,browser;
const passed=name=>{report.checks.push(name);console.log('PASS:',name);};
const uploaded=fixtureBank.map(q=>({...q,prompt:'UNGGAHAN FIKTIF: '+q.prompt,correct:(q.correct+1)%4}));
const uiBank=fixtureBank.map(q=>({...q,prompt:'EXCEL BROWSER FIKTIF: '+q.prompt,correct:(q.correct+2)%4}));
const bodyOf=buffer=>({fileName:'Soal_Fiktif.xlsx',content:buffer.toString('base64'),code:config.recapCode});
try {
  await mkdir('test-results',{recursive:true});
  const originalFile=await createBankExcel(fixtureBank,{blank:false});
  assert.deepEqual(await parseBankExcel(originalFile),fixtureBank);
  const blankFile=await createBankExcel(fixtureBank,{blank:true});
  const blankWorkbook=new ExcelJS.Workbook();await blankWorkbook.xlsx.load(blankFile);
  assert.equal(blankWorkbook.getWorksheet('Soal').rowCount,51);
  assert.equal(blankWorkbook.getWorksheet('Soal').getCell('I2').value || '','');
  assert.ok(blankWorkbook.getWorksheet('Petunjuk'));assert.ok(blankWorkbook.getWorksheet('Contoh'));
  passed('Excel .xlsx roundtrip tepat 50 soal; template 50 ID/metadata, petunjuk, contoh, dan kolom kunci kosong');

  const invalidCases=[
    ['49 soal',ws=>ws.spliceRows(51,1)],
    ['ID duplikat',ws=>{ws.getCell('A3').value='q1';}],
    ['ID tidak dikenal',ws=>{ws.getCell('A2').value='q999';}],
    ['jenis salah',ws=>{ws.getCell('B2').value='hitungan';}],
    ['materi salah',ws=>{ws.getCell('C2').value='Blower';}],
    ['pertanyaan kosong',ws=>{ws.getCell('D2').value=null;}],
    ['opsi kosong',ws=>{ws.getCell('E2').value=null;}],
    ['kunci salah',ws=>{ws.getCell('I2').value='E';}],
    ['poin salah',ws=>{ws.getCell('J2').value=10;}],
    ['rumus',ws=>{ws.getCell('D2').value={formula:'1+1',result:2};}],
    ['tautan',ws=>{ws.getCell('D2').value={text:'Link',hyperlink:'https://example.com'};}],
    ['header salah',ws=>{ws.getCell('D1').value='Soal';}],
    ['teks terlalu panjang',ws=>{ws.getCell('D2').value='x'.repeat(5001);}],
    ['baris tambahan',ws=>{ws.addRow(['q51','pemahaman','Pompa air','Extra','A','B','C','D','A',4]);}],
  ];
  for(const [name,edit] of invalidCases) {
    const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(originalFile);edit(workbook.getWorksheet('Soal'));
    const buffer=Buffer.from(await workbook.xlsx.writeBuffer());
    await assert.rejects(()=>parseBankExcel(buffer),error=>Array.isArray(error.errors)&&error.errors.length>0,name);
  }
  // Berkas rusak/oversize ditolak sebelum isi Excel digunakan.
  await assert.rejects(()=>parseBankExcel(Buffer.from('bukan xlsx')));
  await assert.rejects(()=>parseBankExcel(Buffer.alloc(MAX_EXCEL_BYTES+1)));
  passed('14 jenis kesalahan isi, arsip rusak, dan ukuran >1 MB ditolak dengan pesan per baris');

  const db=await startPostgres('test',55433);postgres=db.postgres;
  await postgres.createDatabase(report.database);pool=createPool(db.url(report.database));await migrate(pool);await migrate(pool);
  server=createApp(pool,config,fixtureBank).listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  async function api(path,body={}) {
    const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const bytes=Buffer.from(await response.arrayBuffer());
    return {status:response.status,data:response.headers.get('content-type')?.includes('application/json')?JSON.parse(bytes.toString('utf8')):bytes};
  }
  for(const action of ['status','template','export','validate','upload']) {
    for(const code of [undefined,'SALAH']) assert.equal((await api('/api/bank/'+action,{code})).status,403);
  }
  const badOrigin=await fetch(base+'/api/bank/upload',{method:'POST',headers:{'Content-Type':'application/json','Sec-Fetch-Site':'cross-site'},body:JSON.stringify({code:config.recapCode})});assert.equal(badOrigin.status,403);
  assert.equal((await api('/api/bank/validate',{...bodyOf(originalFile),fileName:'file.xls'})).status,400);
  assert.equal((await api('/api/bank/validate',{...bodyOf(originalFile),content:'!invalid!'})).status,400);
  const status=(await api('/api/bank/status',{code:config.recapCode})).data;
  assert.equal(status.version,bankVersion(fixtureBank));
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM exam_banks')).rows[0].n,0);
  passed('Template, ekspor kunci, status, pemeriksaan, dan aktivasi dilindungi kode dosen; lintas situs dan format salah ditolak');

  async function start(name) {
    const id=randomUUID();const r=await api('/api/attempts',{id,fullName:'Peserta Fiktif '+name,nim:'FIKTIF'+name,group:'A',startCode:config.startCode});assert.equal(r.status,200);return r.data;
  }
  const old=await start('LAMA');
  const newFile=await createBankExcel(uploaded,{blank:false});
  const validated=await api('/api/bank/validate',bodyOf(newFile));assert.equal(validated.status,200);assert.equal(validated.data.total,50);
  assert.deepEqual(validated.data.distribution.map(d=>[d.pemahaman,d.hitungan]),[[4,2],[4,2],[5,2],[4,2]]);
  const beforeActivate=await start('SEBELUM');assert.ok(beforeActivate.questions.every(q=>q.prompt.startsWith('SOAL FIKTIF')));
  const invalid=await api('/api/bank/upload',{...bodyOf(blankFile),activeVersion:validated.data.activeVersion});assert.equal(invalid.status,400);
  assert.ok(invalid.data.errors.length>0);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM bank_versions')).rows[0].n,1);
  assert.equal((await api('/api/bank/status',{code:config.recapCode})).data.version,status.version);
  assert.equal((await api('/api/bank/upload',bodyOf(newFile))).status,400);
  passed('Pratinjau tidak mengaktifkan bank; template belum diisi/unggahan salah tidak mengubah bank atau membuat versi parsial');

  const activated=await api('/api/bank/upload',{...bodyOf(newFile),activeVersion:validated.data.activeVersion});assert.equal(activated.status,200);assert.equal(activated.data.activated,true);
  const fresh=await start('BARU');assert.ok(fresh.questions.every(q=>q.prompt.startsWith('UNGGAHAN FIKTIF')));
  assert.equal(fresh.questions.length,25);assert.equal(fresh.questions.filter(q=>q.section==='pemahaman').length,17);
  assert.ok(fresh.questions.every(q=>!Object.hasOwn(q,'correct')));
  const reset=await api(`/api/attempts/${old.attempt.id}/reset`,{eventId:randomUUID()});assert.equal(reset.status,200);
  assert.ok(reset.data.questions.every(q=>q.prompt.startsWith('SOAL FIKTIF')));assert.equal(reset.data.attempt.deadlineAt,old.attempt.deadlineAt);
  for(const [state,bank] of [[reset.data,fixtureBank],[fresh,uploaded]]) {
    const keys=new Map(bank.map(q=>[q.id,q.correct]));
    const r=await api(`/api/attempts/${state.attempt.id}/submit`,{resetCount:state.attempt.resetCount,answers:Object.fromEntries(state.questions.map(q=>[q.id,keys.get(q.id)]))});
    assert.equal(r.status,200);assert.equal(r.data.attempt.result.score,100);
  }
  const newService=createService(pool,config,fixtureBank);
  assert.equal((await newService.rpc('bank-status',{code:config.recapCode})).version,bankVersion(uploaded));
  const otherExam=createService(pool,{...config,examId:'ujian-lain'},fixtureBank);
  assert.equal((await otherExam.rpc('bank-status',{code:config.recapCode})).version,bankVersion(fixtureBank));
  assert.equal((await api('/api/bank/upload',{...bodyOf(newFile),activeVersion:validated.data.activeVersion})).status,409);
  const exported=await api('/api/bank/export',{code:config.recapCode});assert.equal(exported.status,200);assert.deepEqual(await parseBankExcel(exported.data),uploaded);
  passed('Bank baru persisten di PostgreSQL dan per EXAM_ID; sesi baru memakai unggahan, reset/nilai sesi lama tetap memakai kunci lama; konflik aktivasi ditolak');

  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1366,height:1000},acceptDownloads:true});page.setDefaultTimeout(12000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/rekap');assert.equal(await page.locator('#bank-manager').isVisible(),false);
  await page.locator('#recap-code').fill(config.recapCode);await page.locator('#recap-login button[type=submit]').click();
  await page.waitForFunction(()=>document.querySelector('#bank-info')?.textContent.includes('50 soal'));
  const downloadEvent=page.waitForEvent('download');await page.locator('#bank-template').click();const download=await downloadEvent;
  await download.saveAs('test-results/bank-template.xlsx');
  const downloaded=new ExcelJS.Workbook();await downloaded.xlsx.load(await readFile('test-results/bank-template.xlsx'));
  assert.equal(downloaded.getWorksheet('Soal').rowCount,51);
  await page.locator('#bank-file').setInputFiles({name:'Belum_Diisi.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:blankFile});
  await page.locator('#bank-validate').click();await page.locator('#bank-error:not([hidden])').waitFor();
  assert.equal(await page.locator('#bank-preview').isVisible(),false);
  const uiFile=await createBankExcel(uiBank,{blank:false});
  await page.locator('#bank-file').setInputFiles({name:'Bank_Browser_Fiktif.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:uiFile});
  await page.locator('#bank-validate').click();await page.locator('#bank-preview:not([hidden])').waitFor();
  assert.match(await page.locator('#bank-summary').innerText(),/50 soal valid/);
  assert.equal((await api('/api/bank/status',{code:config.recapCode})).data.version,bankVersion(uploaded));
  await page.screenshot({path:'test-results/bank-preview-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.querySelector('#bank-manager').getBoundingClientRect().right<=innerWidth));
  await page.screenshot({path:'test-results/bank-preview-mobile.png',fullPage:true});
  await page.locator('#bank-activate').click();await page.locator('#bank-success:not([hidden])').waitFor();
  assert.match(await page.locator('#bank-success').innerText(),/50 soal berhasil diperbarui/);
  assert.equal((await api('/api/bank/status',{code:config.recapCode})).data.version,bankVersion(uiBank));
  const browserFresh=await start('BROWSER');assert.ok(browserFresh.questions.every(q=>q.prompt.startsWith('EXCEL BROWSER FIKTIF')));
  const exportEvent=page.waitForEvent('download');await page.locator('#bank-export').click();const currentDownload=await exportEvent;
  await currentDownload.saveAs('test-results/bank-current.xlsx');
  assert.deepEqual(await parseBankExcel(await readFile('test-results/bank-current.xlsx')),uiBank);
  assert.deepEqual(errors,[]);
  passed('Chrome desktop/390px: template terunduh, file salah ditolak, validasi menampilkan ringkasan, aktivasi berhasil, soal baru dan ekspor aktif cocok');
  report.status='passed';
} catch(error) {report.status='failed';report.error=error.stack;console.error(error);}
finally {
  if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
  if(pool)await pool.end();if(postgres)await postgres.stop();
  await writeFile('test-results/bank-report.json',JSON.stringify(report,null,2)+'\n');
}
process.exit(report.status==='passed'?0:1);
