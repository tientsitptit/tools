function showTab(n) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));

  document.getElementById("content" + n).classList.add("active");
  document.getElementById("tab" + n).classList.add("active");
}

window.showTab = showTab;
