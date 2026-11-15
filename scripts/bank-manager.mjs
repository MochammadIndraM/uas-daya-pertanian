export function addBankManager(js) {
  js = js.replace('    <section class="panel" aria-label="Daftar nilai">', `    <section id="bank-manager" class="panel bank-manager" aria-labelledby="bank-title">
      <div class="bank-heading"><div><h2 id="bank-title">Bank soal</h2><p>Perbarui soal dari Excel untuk peserta yang memulai sesi berikutnya.</p></div>
      <button id="bank-refresh" type="button" class="button button-secondary">Muat info bank</button></div>
      <p id="bank-info" class="bank-info" role="status">Memuat informasi bank soal…</p>
      <div class="bank-downloads">
        <button id="bank-template" type="button" class="button button-secondary">Unduh template Excel</button>
        <button id="bank-export" type="button" class="button button-secondary">Unduh soal aktif</button>
      </div>
      <p class="bank-help">Isi 50 soal pada sheet <strong>Soal</strong>. Lengkapi pertanyaan, opsi A–D, dan kunci A/B/C/D. Pertahankan ID, jenis, materi, serta poin sesuai template. Format .xlsx, maksimal 1 MB.</p>
      <form id="bank-upload-form" class="bank-upload-form">
        <div class="field"><label for="bank-file">File soal Excel</label><input id="bank-file" name="file" type="file" accept=".xlsx" required aria-describedby="bank-upload-note"></div>
        <button id="bank-validate" type="submit" class="button button-secondary">Periksa file</button>
      </form>
      <p id="bank-upload-note" class="bank-help">File diperiksa sebelum digunakan. Sesi yang sudah berjalan tetap memakai soal dan kunci semula.</p>
      <p id="bank-error" class="error" role="alert" hidden></p>
      <ul id="bank-errors" class="bank-errors" hidden></ul>
      <div id="bank-preview" class="bank-preview" hidden>
        <h3>Hasil pemeriksaan</h3><p id="bank-summary"></p>
        <div class="table-wrap"><table class="bank-distribution"><caption>Komposisi setiap paket 25 soal</caption><thead><tr><th>Materi</th><th>Pemahaman</th><th>Hitungan</th></tr></thead><tbody id="bank-distribution"></tbody></table></div>
        <p class="bank-help">Cuplikan tiga soal pertama:</p><ul id="bank-preview-questions"></ul>
        <button id="bank-activate" type="button" class="button button-primary">Gunakan untuk sesi baru</button>
      </div>
      <p id="bank-success" class="bank-success" role="status" hidden></p>
    </section>
    <section class="panel" aria-label="Daftar nilai">`);
  js = js.replace('  async function refresh() {\n    if (deleting) return;', '  const bankManager = initializeBankManager(document.querySelector("#bank-manager"), () => code);\n  async function refresh() {\n    if (deleting) return;');
  js = js.replace('      content.hidden = false;', '      content.hidden = false;\n      if (!bankManager.loaded) void bankManager.refresh();');
  return js;
}
