let quotes = JSON.parse(localStorage.getItem("quote") || "[]");

const quoteInput = document.getElementById("quoteInput");
const quoteList = document.getElementById("quoteList");

function saveQuotes() {
  localStorage.setItem("quote", JSON.stringify(quotes));
}

function renderQuotes() {
  quoteList.innerHTML = "";

  if (quotes.length === 0) {
    quoteList.innerHTML = "<i>Chưa có câu nói nào</i>";
    return;
  }

  quotes.forEach((quote, index) => {
    const div = document.createElement("div");
    div.className = "check-item" + (quote.done ? " done" : "");

    // tên đồ
    const span = document.createElement("span");
    span.innerText = quote.text;

    // nút xóa 🗑️
    const del = document.createElement("button");
    del.innerText = "🗑️";
    del.className = "delete-btn";
    del.onclick = () => {
      quotes.splice(index, 1);   // ❌ xóa đúng item
      saveQuotes();
      renderQuotes();
    };

    div.appendChild(span);
    div.appendChild(del);

    quoteList.appendChild(div);
  });
}

function addQuote() {
  const text = quoteInput.value.trim();
  if (!text) return;

  quotes.push({ text, done: false });
  quoteInput.value = "";
  saveQuotes();
  renderQuotes();
}

window.addQuote = addQuote;

// init
renderQuotes();