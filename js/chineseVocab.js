import { words } from "../data/hsk_words.js";
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
  const w = words[current];

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
  current = pickWord(words, current);
  words[current].shown++;
  render();
}

export function cnRemember() {
  words[current].score++;
  cnNext();
}

export function cnReview() {
  words[current].score = Math.max(0, words[current].score - 1);
  cnNext();
}

// expose cho HTML onclick
window.toggleReveal = toggleReveal;
window.cnNext = cnNext;
window.cnRemember = cnRemember;
window.cnReview = cnReview;

// ===== Init =====
cnNext();
