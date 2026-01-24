function getUrl(story, chapter) {
  return `https://truyencom.com/${story}/chuong-${chapter}.html`;
}

function prevChapter() {
  chapterInput.value = Math.max(1, Number(chapterInput.value) - 1);
  loadChapter();
}

function nextChapter() {
  chapterInput.value = Number(chapterInput.value) + 1;
  loadChapter();
}

async function loadChapter() {
  const story = selectedStory;              // ✅ dùng dropdown custom
  const chapter = Number(chapterInput.value);

  summary.innerText = "⏳ Đang tải...";

  try {
    const res = await fetch("https://vtv24-summary.laohacbacho20032003.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: selectedStory,
          chapter: chapterInput.value,
          summarize: true
        })
      }
    );

    const data = await res.json();
    summary.innerText = data.summary || data.content ||  "Không có nội dung";


  } catch (e) {
    summary.innerText = "❌ Lỗi tải truyện";
    console.error(e);
  }
}

let selectedStory = "muc-than-ky";

function toggleDropdown() {
  document.getElementById("dropdownList")
    .classList.toggle("hidden");
}

window.toggleDropdown = toggleDropdown;

document.querySelectorAll(".dropdown-item").forEach(item => {
  item.onclick = () => {
    selectedStory = item.dataset.value;
    document.getElementById("selectedText").innerText = item.innerText;

    // đóng dropdown sau khi chọn
    document.getElementById("dropdownList").classList.add("hidden");
  };
});

