/***********************
 * STORAGE KEY
 ***********************/
const EXPENSE_KEY = "expense_items";

/***********************
 * STATE
 ***********************/
let expenses = JSON.parse(localStorage.getItem(EXPENSE_KEY)) || [];

/***********************
 * RENDER LIST
 ***********************/
function renderExpenseList() {
  const list = document.getElementById("expenseList");
  if (!list) return;

  list.innerHTML = "";

  expenses.forEach((item, index) => {
    // container mỗi item
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.marginBottom = "8px";

    // nút chính
    const btn = document.createElement("button");
    btn.className = "video-btn";
    btn.style.flex = "1";

    const money = Number(item.amount).toLocaleString("vi-VN");
    const time = item.createdAt ? formatTime(item.createdAt) : "";
    btn.innerText = `${index + 1}. 💸 ${item.name} - ${money}.000 đ - Ngày ${time}`;

    // nút xoá
    const del = document.createElement("button");
    del.innerText = "🗑️";
    del.className = "delete-btn";

    del.onclick = (e) => {
      e.stopPropagation();
      expenses.splice(index, 1);
      localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
      renderExpenseList();
    };

    row.appendChild(btn);
    row.appendChild(del);
    list.appendChild(row);
  });
}

/***********************
 * ADD EXPENSE
 ***********************/
function addExpense() {
  const nameInput = document.getElementById("expenseNameInput");
  const amountInput = document.getElementById("expenseAmountInput");

  const name = nameInput.value.trim();
  const amount = amountInput.value.trim();

  expenses.unshift({
    name,
    amount: Number(amount),
    createdAt: Date.now() 
  });

  localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));

  nameInput.value = "";
  amountInput.value = "";

  renderExpenseList();
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

/***********************
 * INIT
 ***********************/
document.addEventListener("DOMContentLoaded", renderExpenseList);
