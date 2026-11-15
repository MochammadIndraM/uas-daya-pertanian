import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync('sources/sites-worker.js','utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(0,source.indexOf('const durationMs =')) + '\nthis.assets = {html, stylesheet, client, bank: BANK_DAYA_50};',context);
const {html,stylesheet,client,bank} = context.assets;
assert.deepEqual(JSON.parse(JSON.stringify(bank)),JSON.parse(fs.readFileSync('server/bank-v4.json','utf8')),'Bank Sites dan V4 harus sama.');
let js = client.replace('document.body.dataset.recap === "true"','location.pathname === "/rekap" || new URLSearchParams(location.search).get("halaman") === "rekap"');
js = js.replace('Isi identitas untuk memulai ujian.','Jika hanya mengetes tautan, cukup pastikan formulir ini tampil. Kode mulai dibagikan dosen saat ujian.');
js = js.replace('<form id="start-form">','<form id="start-form" method="post">');
js = js.replace('          <p class="notice">',`          <div class="field">
            <label for="start-code">Kode mulai UAS</label>
            <input id="start-code" name="startCode" type="password" maxlength="100" autocomplete="off" autocapitalize="off" spellcheck="false" required>
          </div>
          <p class="notice">`);
js = js.replace('() => downloadRecap(loadedRows)','() => void downloadRecap(code, group.value)');
js = js.slice(0,js.indexOf('function downloadRecap(')) + `async function downloadRecap(code, group) {
  try {
    const response = await fetch('/api/recap.csv',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,group})});
    if (!response.ok) throw new Error((await response.json()).error);
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url; link.download = 'Rekap_UAS_Daya_Pertanian.csv'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  } catch (error) { showError('recap-error',error.message); }
}
`;
fs.writeFileSync('public/index.html',html.replace('data-recap="__VIEW_RECAP__"','').replace('__PAGE_TITLE__','UAS Daya Dalam Bidang Pertanian')+'\n');
fs.writeFileSync('public/styles.css',stylesheet+'\n');
fs.writeFileSync('public/app.js',js+'\n');
console.log('HTML/CSS/JavaScript dari Sites dipasang; kode mulai V4 ditambahkan. Bank Sites = bank V4 (50 soal).');
