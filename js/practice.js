function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate() {

  let q = "", a = "";
  for (let i = 0; i < 10; i++) {
    const x = rand(10, 99);
    const y = rand(10, 99);
    q += `<div>${x} × ${y} =</div>`;
    a += `<div>${x} × ${y} = ${x * y}</div>`;
  }
  for (let i = 0; i < 10; i++) {
    const x = rand(100, 999);
    const y = rand(100, 999);
    q += `<div>${x} × ${y} =</div>`;
    a += `<div>${x} × ${y} = ${x * y}</div>`;
  }

  questions.innerHTML = q;
  answers.innerHTML = a;
}

window.generate = generate;
