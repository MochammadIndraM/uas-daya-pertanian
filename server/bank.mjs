import { readFileSync } from 'node:fs';
import { createHash, randomInt } from 'node:crypto';

export const bankV4 = JSON.parse(readFileSync(new URL('./bank-v4.json', import.meta.url)));
export function bankVersion(bank) {
  return 'v4-' + createHash('sha256').update(JSON.stringify(bank)).digest('hex');
}
export function selectPackage(bank, previous = []) {
  if (bank.length !== 50) throw new Error('Bank harus berisi 50 soal.');
  const byId = new Map(bank.map(q => [q.id, q]));
  if (byId.size !== 50) throw new Error('ID bank tidak unik.');
  const selected = [];
  for (let i = 1; i <= 25; i++) {
    const a = byId.get('q' + i), b = byId.get('q' + (i + 25));
    if (!a || !b || a.topic !== b.topic || a.section !== b.section || a.points !== b.points) throw new Error('Pasangan bank tidak cocok.');
    for (const q of [a, b]) {
      if (q.points !== 4 || q.options.length !== 4 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) throw new Error('Soal tidak valid.');
    }
    selected.push(randomInt(2) ? a : b);
  }
  if (selected.every(q => previous.includes(q.id))) {
    const i = randomInt(25), n = Number(selected[i].id.slice(1));
    selected[i] = byId.get('q' + (n <= 25 ? n + 25 : n - 25));
  }
  for (let i = 24; i > 0; i--) {
    const j = randomInt(i + 1);
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }
  return selected.map(q => q.id);
}
