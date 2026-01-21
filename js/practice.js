function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate() {
  const l = +left.value;
  const r = +right.value;
  if (l > r) return;

  let q = "", a = "";
  for (let i = 0; i < 20; i++) {
    const x = rand(l, r);
    const y = rand(l, r);
    q += `<div>${x} × ${y} =</div>`;
    a += `<div>${x} × ${y} = ${x * y}</div>`;
  }

  questions.innerHTML = q;
  answers.innerHTML = a;
}

window.generate = generate;
