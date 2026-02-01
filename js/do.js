let dos = JSON.parse(localStorage.getItem("dos") || "[]");

const doInput = document.getElementById("doInput");
const doList = document.getElementById("doList");

function saveDos() {
  localStorage.setItem("dos", JSON.stringify(dos));
}

function renderDos() {
  doList.innerHTML = "";

  if (dos.length === 0) {
    doList.innerHTML = "<i>Chưa có việc nào phải làm</i>";
    return;
  }

  dos.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "check-item" + (item.done ? " done" : "");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.onchange = () => {
      item.done = checkbox.checked;
      saveDos();
      renderDos();
    };

    // tên đồ
    const span = document.createElement("span");
    span.innerText = item.name;

    // nút xóa 🗑️
    const del = document.createElement("button");
    del.innerText = "🗑️";
    del.className = "delete-btn";
    del.onclick = () => {
      dos.splice(index, 1);   // ❌ xóa đúng item
      saveDos();
      renderDos();
    };

    div.appendChild(checkbox);
    div.appendChild(span);
    div.appendChild(del);

    doList.appendChild(div);
  });
}

function addDo() {
  const name = doInput.value.trim();
  if (!name) return;

  dos.push({ name, done: false });
  doInput.value = "";
  saveDos();
  renderDos();
}

window.addDo = addDo;

// init
renderDos();
