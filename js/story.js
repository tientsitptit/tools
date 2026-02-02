const STORY_STORAGE_KEY = "reader_state";


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
  document.getElementById("summary-actions").style.display = "none";

  try {
    const res = await fetch("https://vtv24-summary.laohacbacho20032003.workers.dev/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: selectedStory,
          chapter: chapterInput.value,
          summarize: isSummarizeEnabled()
        })
      }
    );

    const data = await res.json();
    if (!data.summary || (data.summary && data.summary.length < 80)) {
      if(isSummarizeEnabled() ){
        document.getElementById("summary-title").innerText = "Tóm tắt";
        document.getElementById("summary-actions").style.display = "flex";
        document.getElementById("copy-btn").style.display = "none";
        summary.innerText = "";
      } else {
        document.getElementById("summary-title").innerText = "Nội dung";
        document.getElementById("summary-actions").style.display = "none";
        summary.innerText = data.content || "Không có nội dung";
        document.getElementById("copy-btn").style.display = "inline-block";
      }
    } else {
      document.getElementById("summary-title").innerText = "Tóm tắt";
      summary.innerText = data.summary || "Không tóm tắt được";
      document.getElementById("copy-btn").style.display = "none";
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

document.querySelectorAll(".story-dropdown-item").forEach(item => {
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
    STORY_STORAGE_KEY,
    JSON.stringify({
      story: selectedStory,
      storyName: document.getElementById("selectedText").innerText,
      chapter: Number(chapterInput.value) || 1
    })
  );
}

function loadReaderState() {
  const saved = localStorage.getItem(STORY_STORAGE_KEY);
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


document.getElementById("copy-btn").addEventListener("click", async () => {
  const text = document.getElementById("summary").innerText.trim();
  try {
    await navigator.clipboard.writeText("Hãy tóm tắt nội dung chương truyện sau tầm 300 chữ, đủ thông tin quan trọng, không được quá dài (không quá 400 chữ):\n\n" + text);
    document.getElementById("copy-btn").innerText = "Đã sao chép";
    setTimeout(() => {
      document.getElementById("copy-btn").innerText = "Lấy nội dung";
    }, 1000);
    window.open("https://chatgpt.com/", "_blank");
  } catch (err) {
    alert("Trình duyệt không cho phép sao chép");
  }
});

function isSummarizeEnabled() {
  return document.getElementById("summarizeToggle").checked;
}
window.isSummarizeEnabled = isSummarizeEnabled;

document.getElementById("cf-btn").onclick = () => {
  window.open(
    "https://dash.cloudflare.com/6244996be1e72bc80d694e2d773799be/workers/services/edit/vtv24-summary/production",
    "_blank"
  );
};

document.getElementById("gemini-btn").onclick = () => {
  window.open(
    "https://aistudio.google.com/usage?timeRange=last-28-days&tab=rate-limit&hl=vi",
    "_blank"
  );
};
