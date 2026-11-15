const wib = new Intl.DateTimeFormat('id-ID', {timeZone:'Asia/Jakarta', dateStyle:'medium', timeStyle:'short'});
const time = v => v == null ? '—' : wib.format(v) + ' WIB';
export function recapCsv(results) {
  const header = ['Nama lengkap','NIM','Golongan','Jawaban benar','Nilai','Dikirim (WIB)','Jumlah reset','Reset terakhir (WIB)'];
  const rows = results.map(r => [r.full_name,r.nim,r.group_name,r.correct_count,r.score,time(r.submitted_at),r.reset_count,time(r.last_reset_at)]);
  const cell = value => {
    let s = String(value ?? '');
    if (/^[\s\uFEFF]*[=+@-]/u.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"','""') + '"';
  };
  return '\uFEFF' + [header,...rows].map(row => row.map(cell).join(';')).join('\r\n') + '\r\n';
}
