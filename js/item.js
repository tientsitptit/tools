let items = JSON.parse(localStorage.getItem("carryItems") || "[]");

const itemInput = document.getElementById("itemInput");
const itemList = document.getElementById("itemList");

function saveItems() {
  localStorage.setItem("carryItems", JSON.stringify(items));
}

function renderItems() {
  itemList.innerHTML = "";

  if (items.length === 0) {
    itemList.innerHTML = "<i>Chưa có đồ nào</i>";
    return;
  }

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "check-item" + (item.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.onchange = () => {
      item.done = checkbox.checked;
      saveItems();
      renderItems();
    };

    const span = document.createElement("span");
    span.innerText = item.name;

    div.appendChild(checkbox);
    div.appendChild(span);
    itemList.appendChild(div);
  });
}

function addItem() {
  const name = itemInput.value.trim();
  if (!name) return;

  items.push({ name, done: false });
  itemInput.value = "";
  saveItems();
  renderItems();
}

window.addItem = addItem;

// init
renderItems();
