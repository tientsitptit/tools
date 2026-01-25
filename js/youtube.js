
async function loadVideos() {
  const channel = document.getElementById("youtubeChannel").value.trim();
  const list = document.getElementById("videoList");

  list.innerHTML = "⏳ Đang tải video...";

  const res = await fetch("https://vtv24-summary.laohacbacho20032003.workers.dev/youtube", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: channel })
  });
  const videos = await res.json();
  
  list.innerHTML = "";
  
  videos.forEach(v => {
    const btn = document.createElement("button");
    btn.className = "video-btn";
    btn.innerText = "🎬 " + v.title;
    btn.onclick = () => copyPrompt(v.url);
    list.appendChild(btn);
  });
}

function copyPrompt(videoUrl) {
  const prompt = `
        Hãy tóm tắt chi tiết dễ hiểu nội dung video YouTube sau tầm 350 từ (ít nhất 300 từ, nhiều nhất 400 từ):
        Link:
        ${videoUrl}
        Yêu cầu:
        - Viết bằng tiếng Việt, dễ đọc
        - Mục đích của video này là gì? Thông điệp quan trọng nhất mà tác giả muốn truyền tải
        - Liệt kê các ý chính quan trọng dưới dạng danh sách gạch đầu dòng.
        - Với mỗi ý chính, hãy tóm tắt ngắn gọn các luận điểm hoặc ví dụ minh họa mà tác giả đã đưa ra.
        - Tóm tắt lại giá trị của video trong 2-3 câu
          `.trim();

  navigator.clipboard.writeText(prompt);
  window.open("https://gemini.google.com/app", "_blank");
}
