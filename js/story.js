const STORAGE_KEY = "reader_state";


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

  summary.innerText = "⏳ Đang tải nội dung, hãy đợi vài giây ...";

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
    if (data.summary && data.summary.length < 80) {
      document.getElementById("summary-title").innerText = "Nội dung";
      summary.innerText = data.summary + (data.content || "Không có nội dung");
    } else {
      document.getElementById("summary-title").innerText = "Tóm tắt";
      summary.innerText = data.summary || "Không tóm tắt được";
    }

    saveReaderState(); 
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
    saveReaderState(); // 🔥 THÊM DÒNG NÀY
    // đóng dropdown sau khi chọn
    document.getElementById("dropdownList").classList.add("hidden");
  };
});


function saveReaderState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      story: selectedStory,
      storyName: document.getElementById("selectedText").innerText,
      chapter: Number(chapterInput.value) || 1
    })
  );
}

function loadReaderState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const state = JSON.parse(saved);

    if (state.story) {
      selectedStory = state.story;
    }

    if (state.storyName) {
      document.getElementById("selectedText").innerText = state.storyName;
    }

    if (state.chapter) {
      chapterInput.value = state.chapter;
    }
  } catch (e) {
    console.warn("Reader state lỗi");
  }
}

loadReaderState();



