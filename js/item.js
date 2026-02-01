const CHANNEL_KEY = "youtube_channels";
let channels = JSON.parse(localStorage.getItem(CHANNEL_KEY)) || [];

function renderChannelList() {
  const list = document.getElementById("channelList");
  if (!list) return;

  list.innerHTML = "";

  channels.forEach((c, index) => {
    // container cho mỗi item
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.marginBottom = "8px";

    // nút chính (copy link)
    const btn = document.createElement("button");
    btn.className = "video-btn";
    btn.innerText = `${index + 1}. 📺 ${c.name}`;
    btn.style.flex = "1"; // chiếm hết chiều ngang còn lại

    btn.onclick = () => {
      // copy link
      navigator.clipboard.writeText(c.link);

      // 🔥 hiệu ứng click
      btn.style.transition = "transform 0.08s ease, background 0.15s ease";
      btn.style.transform = "scale(0.97)";

      const oldBg = btn.style.background;
      btn.style.background = "#dbeafe"; // xanh nhạt

      setTimeout(() => {
        btn.style.transform = "scale(1)";
        btn.style.background = oldBg;
      }, 150);
    };

    // nút xoá 🗑️
    const del = document.createElement("button");
    del.innerText = "🗑️";
    del.className = "delete-btn";

    del.onclick = (e) => {
      e.stopPropagation(); // 🔥 không trigger click copy
      channels.splice(index, 1);
      localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels));
      renderChannelList();
    };

    row.appendChild(btn);
    row.appendChild(del);
    list.appendChild(row);
  });
}

function addChannel() {
  const name = document.getElementById("channelNameInput").value.trim();
  const link = document.getElementById("channelLinkInput").value.trim();

  channels.push({ name, link });
  localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels));

  document.getElementById("channelNameInput").value = "";
  document.getElementById("channelLinkInput").value = "";

  renderChannelList();
}

document.addEventListener("DOMContentLoaded", renderChannelList);
