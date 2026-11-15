import ExcelJS from 'exceljs';
import yauzl from 'yauzl';
import { bankV4 } from './bank.mjs';

export const MAX_EXCEL_BYTES = 1024 * 1024;
export const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const HEADERS = ['ID','Jenis','Materi','Pertanyaan','Opsi A','Opsi B','Opsi C','Opsi D','Kunci','Poin'];
const metadata = new Map(bankV4.map(q => [q.id,q]));
export class BankValidationError extends Error {
  constructor(message, errors = []) { super(message); this.errors = errors.slice(0,30); }
}
export function bankSummary(bank) {
  return {total:bank.length,pairs:25,distribution:['Pompa air','Blower','Panel surya','Kincir angin'].map(topic => ({
    topic,pemahaman:bank.filter(q => q.topic===topic && q.section==='pemahaman').length / 2,
    hitungan:bank.filter(q => q.topic===topic && q.section==='hitungan').length / 2,
  }))};
}

// Pemeriksaan ukuran arsip sebelum ExcelJS memuat XML ke memori.
async function checkArchive(buffer) {
  return new Promise((resolve,reject) => yauzl.fromBuffer(buffer,{lazyEntries:true,validateEntrySizes:true},(error,zip) => {
    if (error) return reject(new BankValidationError('File bukan Excel .xlsx yang valid atau arsipnya rusak.'));
    let total=0,entries=0,actual=0,finished=false;
    const fail = message => { if(finished)return;finished=true;zip.close();reject(new BankValidationError(message)); };
    zip.on('error',()=>fail('Arsip Excel tidak dapat dibaca.'));
    zip.on('end',()=>{if(!finished){finished=true;resolve();}});
    zip.on('entry',entry => {
      total+=entry.uncompressedSize;
      if(++entries>200 || total>8*1024*1024) return fail('Isi Excel terlalu besar. Gunakan template 50 soal tanpa gambar atau lampiran.');
      if(entry.generalPurposeBitFlag & 1) return fail('Excel yang dilindungi password tidak didukung.');
      if(/\.bin$/i.test(entry.fileName)) return fail('Gunakan Excel .xlsx tanpa macro atau lampiran.');
      if(entry.fileName.endsWith('/')) return zip.readEntry();
      zip.openReadStream(entry,(error,stream) => {
        if(error) return fail('Isi arsip Excel rusak.');
        stream.on('error',()=>fail('Isi arsip Excel rusak.'));
        stream.on('data',chunk => {actual+=chunk.length;if(actual>8*1024*1024){stream.destroy();fail('Isi Excel terlalu besar.');}});
        stream.on('end',()=>{if(!finished)zip.readEntry();});
      });
    });
    zip.readEntry();
  }));
}

export function decodeExcel(data) {
  if(typeof data.fileName!=='string' || !/\.xlsx$/i.test(data.fileName)) throw new BankValidationError('Pilih file Excel berformat .xlsx.');
  if(typeof data.content!=='string' || data.content.length===0 || data.content.length>Math.ceil(MAX_EXCEL_BYTES/3)*4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.content)) throw new BankValidationError('File Excel kosong, tidak valid, atau melebihi 1 MB.');
  const buffer=Buffer.from(data.content,'base64');
  if(buffer.length>MAX_EXCEL_BYTES || buffer.toString('base64')!==data.content) throw new BankValidationError('File Excel tidak valid atau melebihi 1 MB.');
  return buffer;
}

export async function parseBankExcel(buffer) {
  if(!Buffer.isBuffer(buffer) || buffer.length===0 || buffer.length>MAX_EXCEL_BYTES) throw new BankValidationError('Ukuran file Excel harus antara 1 byte dan 1 MB.');
  await checkArchive(buffer);
  const workbook=new ExcelJS.Workbook();
  try {await workbook.xlsx.load(buffer);} catch {throw new BankValidationError('File Excel tidak dapat dibaca. Simpan ulang sebagai .xlsx tanpa password.');}
  const sheet=workbook.getWorksheet('Soal');
  if(!sheet) throw new BankValidationError('Sheet "Soal" tidak ditemukan. Gunakan template yang disediakan.');
  if(sheet.rowCount>200 || sheet.columnCount>10) throw new BankValidationError('Sheet Soal hanya boleh berisi 10 kolom dan 50 baris soal. Hapus baris/kolom tambahan.');
  const errors=[];
  function text(cell) {
    const value=cell.value;
    if(value===null || value===undefined) return '';
    if(typeof value==='string' || typeof value==='number') return String(value).trim();
    errors.push(`Baris ${cell.row}, kolom ${cell.col}: gunakan teks/angka biasa, bukan rumus, tautan, atau objek.`);
    return '';
  }
  HEADERS.forEach((header,i)=>{if(text(sheet.getCell(1,i+1))!==header)errors.push(`Kolom ${i+1} harus bernama "${header}".`);});
  const questions=[],seen=new Set();
  for(let row=2;row<=sheet.rowCount;row++) {
    const values=HEADERS.map((_,i)=>text(sheet.getCell(row,i+1)));
    if(values.every(value=>value==='')) continue;
    const [id,section,topic,prompt,...rest]=values;
    const options=rest.slice(0,4),key=rest[4].toUpperCase(),points=rest[5];
    const expected=metadata.get(id);
    if(!expected) errors.push(`Baris ${row}: ID harus q1 sampai q50 sesuai template.`);
    if(seen.has(id)) errors.push(`Baris ${row}: ID ${id} duplikat.`);
    seen.add(id);
    if(expected && (section!==expected.section || topic!==expected.topic)) errors.push(`Baris ${row} (${id}): Jenis harus ${expected.section} dan Materi harus ${expected.topic} agar komposisi paket tetap.`);
    if(!prompt || prompt.length>5000) errors.push(`Baris ${row}: Pertanyaan wajib diisi, maksimal 5.000 karakter.`);
    options.forEach((option,i)=>{if(!option || option.length>2000)errors.push(`Baris ${row}: Opsi ${'ABCD'[i]} wajib diisi, maksimal 2.000 karakter.`);});
    if(!/^[ABCD]$/.test(key)) errors.push(`Baris ${row}: Kunci harus A, B, C, atau D.`);
    if(points!=='4') errors.push(`Baris ${row}: Poin harus 4.`);
    questions.push({id,section,topic,prompt,options,correct:'ABCD'.indexOf(key),points:4});
  }
  if(questions.length!==50) errors.unshift(`Ditemukan ${questions.length} soal; isi tepat 50 soal (q1 sampai q50).`);
  for(const id of metadata.keys()) if(!seen.has(id)) errors.push(`Soal ${id} belum diisi.`);
  if(errors.length) throw new BankValidationError('Excel belum dapat digunakan. Perbaiki isian berikut.',errors);
  return questions.sort((a,b)=>Number(a.id.slice(1))-Number(b.id.slice(1)));
}

export async function createBankExcel(bank = bankV4, {blank = true} = {}) {
  const workbook=new ExcelJS.Workbook();
  workbook.creator='UAS Daya Pertanian';
  const help=workbook.addWorksheet('Petunjuk');
  help.columns=[{width:31},{width:110}];
  [
    ['TEMPLATE BANK SOAL UAS','Isi sheet Soal, simpan sebagai .xlsx, lalu unggah melalui Rekap dosen > Bank soal.'],
    ['Jumlah soal','Wajib 50 soal. Sistem memilih satu soal dari setiap pasangan q1/q26 sampai q25/q50.'],
    ['Kolom tetap','Jangan ubah ID, Jenis, Materi, dan Poin. Komposisi paket tetap 17 pemahaman + 8 hitungan.'],
    ['Kolom yang diisi','Isi Pertanyaan, Opsi A, Opsi B, Opsi C, Opsi D, dan Kunci untuk seluruh 50 soal.'],
    ['Kunci jawaban','Tulis satu huruf A/B/C/D, bukan angka. Jangan memakai rumus Excel.'],
    ['Pasangan setara','q1 dan q26 harus menguji kompetensi dan tingkat kesulitan yang setara; begitu juga pasangan lain.'],
    ['Batas teks','Pertanyaan maksimal 5.000 karakter; setiap opsi maksimal 2.000 karakter. Teks biasa tanpa gambar.'],
    ['Ukuran file','Maksimal 1 MB. Format .xlsx tanpa macro, password, rumus, dan lampiran.'],
    ['Pemeriksaan','Klik Periksa file, tinjau ringkasan, lalu klik Gunakan untuk sesi baru. File salah tidak mengubah bank aktif.'],
    ['Sesi yang berjalan','Sesi yang sudah dibuat tetap memakai soal dan kunci versi semula, termasuk setelah reset.'],
    ['Lingkup bank','Unggahan berlaku untuk ID ujian (EXAM_ID) yang sedang digunakan pada server.'],
    ['Contoh','Lihat sheet Contoh. Contoh tersebut fiktif dan tidak ikut diimpor.'],
  ].forEach(row=>help.addRow(row));
  help.eachRow(row=>{row.alignment={wrapText:true,vertical:'top'};row.height=42;});
  const sheet=workbook.addWorksheet('Soal',{views:[{state:'frozen',ySplit:1}]});
  sheet.columns=HEADERS.map((header,i)=>({header,key:String(i),width:[10,18,20,65,38,38,38,38,12,10][i]}));
  sheet.autoFilter='A1:J51';
  [...bank].sort((a,b)=>Number(a.id.slice(1))-Number(b.id.slice(1))).forEach((q,i)=>{
    const row=sheet.addRow([q.id,q.section,q.topic,blank?'':q.prompt,...(blank?['','','','']:q.options),blank?'':'ABCD'[q.correct],4]);
    row.height=72;row.alignment={wrapText:true,vertical:'top'};
    for(const column of [1,2,3,10]) row.getCell(column).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFEAF0EA'}};
    row.getCell(9).dataValidation={type:'list',allowBlank:false,formulae:['"A,B,C,D"'],showErrorMessage:true,error:'Pilih A, B, C, atau D.'};
  });
  const example=workbook.addWorksheet('Contoh');
  example.columns=sheet.columns.map((col,i)=>({header:HEADERS[i],width:col.width}));
  example.addRow(['q1','pemahaman','Pompa air','Contoh fiktif: manakah pilihan A?','Pilihan A','Pilihan B','Pilihan C','Pilihan D','A',4]);
  example.addRow(['q26','pemahaman','Pompa air','Contoh pasangan fiktif: manakah pilihan B?','Pilihan A','Pilihan B','Pilihan C','Pilihan D','B',4]);
  example.eachRow(row=>{row.alignment={wrapText:true,vertical:'top'};row.height=50;});
  for(const ws of [help,sheet,example]) {
    const header=ws.getRow(1);header.font={bold:true,color:{argb:'FFFFFFFF'}};
    header.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF1B4D3C'}};header.height=32;
  }
  workbook.views=[{activeTab:1}];
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
