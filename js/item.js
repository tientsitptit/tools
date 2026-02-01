/***********************
 * STORAGE
 ***********************/
const STORAGE_KEY = "carryBlocks";
let blocks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

/***********************
 * SAVE
 ***********************/
function saveBlocks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

/***********************
 * ADD ACTIVITY (BLOCK)
 ***********************/
function addBlock() {
  const input = document.getElementById("actionInput");
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  blocks.unshift({
    name,
    items: []
  });

  input.value = "";
  saveBlocks();
  renderBlocks();
}

/***********************
 * DELETE ACTIVITY
 ***********************/
function deleteBlock(index) {
  blocks.splice(index, 1);
  saveBlocks();
  renderBlocks();
}

/***********************
 * RENDER ALL BLOCKS
 ***********************/
function renderBlocks() {
  const section = document.getElementById("content4");
  if (!section) return;

  // xoá các block cũ
  section.querySelectorAll(".dynamic-block").forEach(e => e.remove());

  blocks.forEach((block, blockIndex) => {
    const card = document.createElement("div");
    card.className = "card dynamic-block";

    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <h3 style="flex:1;">📌 ${block.name}</h3>
        <button class="delete-btn" onclick="deleteBlock(${blockIndex})">🗑️</button>
      </div>

      <input 
        class="full-input"
        placeholder="Nhập việc cần làm / đồ mang theo"
        id="itemInput-${blockIndex}"
        style="margin: 12px 0;"
      >

      <button class="main" onclick="addItem(${blockIndex})">Thêm</button>

      <div id="itemList-${blockIndex}" style="margin-top:12px;"></div>
    `;

    section.appendChild(card);
    renderItems(blockIndex);
  });
}

/***********************
 * ADD ITEM
 ***********************/
function addItem(blockIndex) {
  const input = document.getElementById(`itemInput-${blockIndex}`);
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  blocks[blockIndex].items.push({
    name,
    done: false
  });

  input.value = "";
  saveBlocks();
  renderItems(blockIndex);
}

/***********************
 * RENDER ITEMS
 ***********************/
function renderItems(blockIndex) {
  const list = document.getElementById(`itemList-${blockIndex}`);
  const items = blocks[blockIndex].items;

  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "<i>Chưa có mục nào</i>";
    return;
  }

  items.forEach((item, itemIndex) => {
    const div = document.createElement("div");
    div.className = "check-item" + (item.done ? " done" : "");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.onchange = () => {
      item.done = checkbox.checked;
      saveBlocks();
      renderItems(blockIndex);
    };

    // text
    const span = document.createElement("span");
    span.innerText = item.name;

    // delete item
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.innerText = "🗑️";
    del.onclick = () => {
      items.splice(itemIndex, 1);
      saveBlocks();
      renderItems(blockIndex);
    };

    div.appendChild(checkbox);
    div.appendChild(span);
    div.appendChild(del);
    list.appendChild(div);
  });
}

// expose
window.addBlock = addBlock;
window.addItem = addItem;
window.deleteBlock = deleteBlock;

/***********************
 * INIT
 ***********************/
document.addEventListener("DOMContentLoaded", renderBlocks);
