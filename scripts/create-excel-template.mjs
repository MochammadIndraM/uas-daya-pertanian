import {mkdir,writeFile} from 'node:fs/promises';
import {createBankExcel} from '../server/bank-excel.mjs';
await mkdir(new URL('../templates',import.meta.url),{recursive:true});
await writeFile(new URL('../templates/Template_Soal_UAS_Daya_Pertanian.xlsx',import.meta.url),await createBankExcel());
console.log('Template siap: templates/Template_Soal_UAS_Daya_Pertanian.xlsx (tanpa soal/kunci UAS asli).');
