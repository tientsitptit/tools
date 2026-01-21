import { wordsHSK3 } from "../data/hsk_words.js";
import { pickWord } from "./weightedRandom.js";

let current = null;
let revealed = false;

// ===== DOM =====
const hanzi = document.getElementById("cn-hanzi");
const pinyin = document.getElementById("cn-pinyin");
const viet = document.getElementById("cn-vietnamese");
const meaningBlock = document.getElementById("meaning-block");

// ===== Render =====
function render() {
  const w = wordsHSK3[current];

  hanzi.innerText = w.hanzi;  
  pinyin.innerText = w.pinyin;
  viet.innerText = w.vietnamese;

  // luôn ẩn nghĩa khi render từ mới
  revealed = false;
  meaningBlock.classList.add("hidden");
}

// ===== Actions =====
export function toggleReveal() {
  revealed = !revealed;
  meaningBlock.classList.toggle("hidden", !revealed);
}

export function cnNext() {
  current = pickWord(wordsHSK3, current);
  wordsHSK3[current].shown++;
  render();
}

export function cnRemember() {
  wordsHSK3[current].score++;
  cnNext();
}

export function cnReview() {
  wordsHSK3[current].score = Math.max(0, wordsHSK3[current].score - 1);
  cnNext();
}

// expose cho HTML onclick
window.toggleReveal = toggleReveal;
window.cnNext = cnNext;
window.cnRemember = cnRemember;
window.cnReview = cnReview;

// ===== Init =====
cnNext();
