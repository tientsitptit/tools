export function pickWord(list, last) {
  const pool = [];

  list.forEach((w, i) => {
    if (i === last) return;
    const weight = 6 - Math.min(w.score, 5) + (w.shown === 0 ? 4 : 0);
    for (let k = 0; k < weight; k++) pool.push(i);
  });

  return pool[Math.floor(Math.random() * pool.length)];
}
