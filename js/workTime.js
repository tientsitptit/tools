function calculate() {
  const inH = +inHour.value || 0;
  const inM = +inMinute.value || 0;
  const outH = +outHour.value || 0;
  const outM = +outMinute.value || 0;

  const total = inH * 60 + inM + 9 * 60 + 48 + outH * 60 + outM;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;

  result.innerText = `Giờ về: ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

window.calculate = calculate;

function calculateArrival() {
  const backH = parseInt(backHour.value) || 0;
  const backM = parseInt(backMinute.value) || 0;

  // tổng phút giờ về
  let total =
    backH * 60 + backM
    - (9 * 60 + 48);

  if (total < 0) total += 24 * 60;

  let h = Math.floor(total / 60) % 24;
  let m = total % 60;

  arrivalResult.innerText =
    `Giờ đến: ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

window.calculateArrival = calculateArrival;
