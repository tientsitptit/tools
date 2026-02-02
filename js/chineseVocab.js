import { wordsHSK3 } from "../data/hsk_words.js";

/***********************
 * STATE
 ***********************/
let order = [];
let index = -1;
let current = null;
let revealed = false;
const reviewList = [];

/***********************
 * DOM
 ***********************/
const hanzi = document.getElementById("cn-hanzi");
const pinyin = document.getElementById("cn-pinyin");
const viet = document.getElementById("cn-vietnamese");
const meaningBlock = document.getElementById("meaning-block");
const reviewDiv = document.getElementById("review-list");
const counterDiv = document.getElementById("counter");

/***********************
 * INIT LIST
 ***********************/
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export function startList() {
  order = shuffle([...wordsHSK3.keys()]);
  index = 0;
  loadCurrent();
}

/***********************
 * RENDER
 ***********************/
function loadCurrent() {
  current = order[index];
  const w = wordsHSK3[current];

  hanzi.innerText = w.hanzi;
  pinyin.innerText = w.pinyin;
  viet.innerText = w.vietnamese;

  revealed = false;
  meaningBlock.classList.add("hidden");

  counterDiv.innerText = `${index + 1} / ${order.length}`;

  w.shown++;
}

function renderReviewList() {
  if (reviewList.length === 0) {
    reviewDiv.innerHTML = "Chưa có từ nào";
    reviewDiv.classList.add("empty");
    return;
  }

  reviewDiv.classList.remove("empty");
  reviewDiv.innerHTML = "";

  reviewList.forEach((i, pos) => {
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerText = wordsHSK3[i].hanzi;

    item.onclick = () => {
      current = i;
      reviewList.splice(pos, 1);
      wordsHSK3[i].score++;
      wordsHSK3[i].shown++;
      renderReviewList();
      loadManual(i);
    };

    reviewDiv.appendChild(item);
  });
}

function loadManual(i) {
  const w = wordsHSK3[i];
  hanzi.innerText = w.hanzi;
  pinyin.innerText = w.pinyin;
  viet.innerText = w.vietnamese;
  revealed = false;
  meaningBlock.classList.add("hidden");
}

/***********************
 * ACTIONS
 ***********************/
export function cnRemember() {
  wordsHSK3[current].score++;
  next();
}

export function cnReview() {
  if (!reviewList.includes(current)) {
    reviewList.push(current);
  }
  wordsHSK3[current].score = Math.max(0, wordsHSK3[current].score - 1);
  renderReviewList();
  next();
}

function next() {
  if (index < order.length - 1) {
    index++;
    loadCurrent();
  }
}

/***********************
 * TOGGLE MEANING
 ***********************/
hanzi.onclick = () => {
  revealed = !revealed;
  meaningBlock.classList.toggle("hidden", !revealed);
};

/***********************
 * EXPOSE
 ***********************/
window.startList = startList;
window.cnRemember = cnRemember;
window.cnReview = cnReview;
