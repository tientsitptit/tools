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

  // cache channel
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

    // cache videos
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
    btn.onclick = () => copyPrompt(v.url);
    list.appendChild(btn);
  });
}

/***********************
 * COPY PROMPT
 ***********************/
function copyPrompt(videoUrl) {
  const prompt = getPromptByType(selectedPromptType, videoUrl);

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

      // cache prompt type
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
  // restore channel
  const savedChannel = localStorage.getItem(CACHE_CHANNEL);
  if (savedChannel) {
    document.getElementById("youtubeChannel").value = savedChannel;
  }

  // restore videos
  const cachedVideos = localStorage.getItem(CACHE_VIDEOS);
  if (cachedVideos) {
    renderVideoList(JSON.parse(cachedVideos));
  }

  // restore prompt text
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

//// Helper to get prompt by type ----------------------------------------------------------
function getPromptByType(type, videoUrl) {
  switch (type) {
    case "longpromt":
      return `
        Hãy tóm tắt chi tiết dễ hiểu nội dung video YouTube sau.
        Link:
        ${videoUrl}
        `.trim();

    case "shortpromt":
      return `
        Hãy tóm tắt ngắn gọn dễ hiểu nội dung video YouTube sau trong khoảng 100-200 từ.
        Link:
        ${videoUrl}
        `.trim();

    default:
      return `
        Hãy tóm tắt nội dung video YouTube sau trong khoảng 200–300 từ.
        Link:
        ${videoUrl}
        `.trim();
  }
}
