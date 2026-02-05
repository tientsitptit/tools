/***********************
 * STATE + CACHE KEYS
 ***********************/
const CACHE_CHANNEL = "youtubeChannel";
const CACHE_VIDEOS = "cachedVideos";
const CACHE_PROMPT = "promptType";

let selectedPromptType = localStorage.getItem(CACHE_PROMPT) || "vtv24";

/***********************
 * LOAD VIDEOS
 ***********************/
async function loadVideos() {
  const channelInput = document.getElementById("youtubeChannel");
  const channel = channelInput.value.trim();
  const list = document.getElementById("videoList");

  if (!channel) return;

  list.innerHTML = "⏳ Đang tải video...";

  localStorage.setItem(CACHE_CHANNEL, channel);

  try {
    const res = await fetch(
      "https://vtv24-summary.laohacbacho20032003.workers.dev/youtube",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: channel })
      }
    );

    const videos = await res.json();

    localStorage.setItem(CACHE_VIDEOS, JSON.stringify(videos));
    renderVideoList(videos);
  } catch (err) {
    list.innerHTML = "❌ Lỗi tải video";
    console.error(err);
  }
}

/***********************
 * RENDER VIDEO LIST
 ***********************/
function renderVideoList(videos) {
  const list = document.getElementById("videoList");
  list.innerHTML = "";

  videos.forEach((v, index) => {
    const btn = document.createElement("button");
    btn.className = "video-btn";
    btn.innerText = `${index + 1}. 🎬 ${v.title}`;

    // 🔥 SỬA Ở ĐÂY: truyền index
    btn.onclick = () => copyPromptFromStart(index);

    list.appendChild(btn);
  });
}

/***********************
 * COPY PROMPT (1 → N)
 ***********************/
function copyPromptFromStart(clickedIndex) {
  const cachedVideos = localStorage.getItem(CACHE_VIDEOS);
  if (!cachedVideos) return;

  const videos = JSON.parse(cachedVideos);

  const start = Math.max(0, clickedIndex - 4);
  const selectedVideos = videos.slice(start, clickedIndex + 1); 

  const prompt = getPromptByType(
    selectedPromptType,
    selectedVideos.map((v, i) => `${i + 1}. ${v.url}`).join("\n")
  );

  navigator.clipboard.writeText(prompt).then(() => {
    window.open("https://gemini.google.com/app", "_blank");
  });
}

/***********************
 * PROMPT DROPDOWN
 ***********************/
function togglePromptDropdown() {
  document
    .getElementById("promptDropdownList")
    .classList.toggle("hidden");
}

window.togglePromptDropdown = togglePromptDropdown;

document
  .querySelectorAll("#promptDropdownList .ytb-dropdown-item")
  .forEach(item => {
    item.addEventListener("click", () => {
      selectedPromptType = item.dataset.value;

      localStorage.setItem(CACHE_PROMPT, selectedPromptType);

      document.getElementById("selectedPromptText").innerText =
        item.innerText;

      document
        .getElementById("promptDropdownList")
        .classList.add("hidden");
    });
  });

/***********************
 * RESTORE ON LOAD
 ***********************/
window.addEventListener("DOMContentLoaded", () => {
  const savedChannel = localStorage.getItem(CACHE_CHANNEL);
  if (savedChannel) {
    document.getElementById("youtubeChannel").value = savedChannel;
  }

  const cachedVideos = localStorage.getItem(CACHE_VIDEOS);
  if (cachedVideos) {
    renderVideoList(JSON.parse(cachedVideos));
  }

  const savedPromptType = localStorage.getItem(CACHE_PROMPT);
  if (savedPromptType) {
    selectedPromptType = savedPromptType;

    const item = document.querySelector(
      `#promptDropdownList .ytb-dropdown-item[data-value="${savedPromptType}"]`
    );

    if (item) {
      document.getElementById("selectedPromptText").innerText =
        item.innerText;
    }
  }
});

/***********************
 * OPTIONAL: CLEAR CACHE
 ***********************/
function clearCache() {
  localStorage.removeItem(CACHE_CHANNEL);
  localStorage.removeItem(CACHE_VIDEOS);
  localStorage.removeItem(CACHE_PROMPT);
  location.reload();
}

window.clearCache = clearCache;

document
  .getElementById("clearChannelInput")
  .addEventListener("click", () => {
    document.getElementById("youtubeChannel").value = "";
  });

/***********************
 * HELPER: GET PROMPT
 ***********************/
function getPromptByType(type, videoListText) {
  switch (type) {
    case "longpromt":
      return `
Hãy tóm tắt chi tiết, dễ hiểu nội dung của các video YouTube sau.

${videoListText}
      `.trim();

    case "shortpromt":
      return `
Hãy tóm tắt ngắn gọn, dễ hiểu nội dung các video YouTube sau

${videoListText}
      `.trim();

    default:
      return `
Hãy tóm tắt ngắn gọn, dễ hiểu nội dung các video YouTube sau

${videoListText}
      `.trim();
  }
}
