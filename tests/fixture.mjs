const pairs = [
  ...Array(4).fill(['Pompa air','pemahaman']), ...Array(4).fill(['Blower','pemahaman']),
  ...Array(5).fill(['Panel surya','pemahaman']), ...Array(4).fill(['Kincir angin','pemahaman']),
  ...Array(2).fill(['Pompa air','hitungan']), ...Array(2).fill(['Blower','hitungan']),
  ...Array(2).fill(['Panel surya','hitungan']), ...Array(2).fill(['Kincir angin','hitungan']),
];
export const fixtureBank = Array.from({length:50},(_,i) => ({
  id:'q'+(i+1),topic:pairs[i%25][0],section:pairs[i%25][1],
  prompt:`SOAL FIKTIF ${i+1}: Pilih opsi untuk simulasi perangkat lunak.`,
  options:['Pilihan uji A','Pilihan uji B','Pilihan uji C','Pilihan uji D'],
  correct:i%4,points:4,
}));
export function answersFor(questions, correctCount = 25) {
  const keys = new Map(fixtureBank.map(q => [q.id,q.correct]));
  return Object.fromEntries(questions.map((q,i) => [q.id,(keys.get(q.id)+(i<correctCount ? 0 : 1))%4]));
}
