function showTab(n) {
  document.querySelectorAll("section")
    .forEach(s => s.classList.remove("active"));

  const content = document.getElementById("content" + n);
  if (content) content.classList.add("active");

  document.querySelectorAll("nav button")
    .forEach(b => b.classList.remove("active"));

  const tabBtn = document.getElementById("tab" + n);
  if (tabBtn) tabBtn.classList.add("active");
}

window.showTab = showTab;


window.showTab = showTab;

function toggleMenu() {
  document.getElementById("menu-panel")
    .classList.toggle("hidden");
}

function openTab(n) {
  showTab(n);        // dùng lại hàm cũ của bạn
  toggleMenu();     // tự đóng menu
}
window.openTab = openTab;
