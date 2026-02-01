const CHANNEL_KEY = "youtube_channels";
let channels = JSON.parse(localStorage.getItem(CHANNEL_KEY)) || [];

function renderChannelList() {
  const list = document.getElementById("channelList");
  if (!list) return;

  // 🔥 ÉP LIST THEO CHIỀU DỌC
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "8px";

  list.innerHTML = "";

  channels.forEach((c, index) => {
    const btn = document.createElement("button");
    btn.className = "video-btn";
    btn.innerText = `${index + 1}. 📺 ${c.name}`;

    // 🔒 ÉP 1 ITEM = 1 DÒNG
    btn.style.width = "100%";
    btn.style.display = "block";

    btn.onclick = () => {
      navigator.clipboard.writeText(c.link);
    };

    list.appendChild(btn);
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
