
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
  const prompt = getPromptByType(selectedPromptType, videoUrl);

  navigator.clipboard.writeText(prompt).then(() => {
    window.open("https://gemini.google.com/app", "_blank");
  });
}

function togglePromptDropdown() {
  document
    .getElementById("promptDropdownList")
    .classList.toggle("hidden");
}

window.togglePromptDropdown = togglePromptDropdown;

let selectedPromptType = "vtv24";

document
  .querySelectorAll("#promptDropdownList .dropdown-item")
  .forEach(item => {
    item.addEventListener("click", () => {
      selectedPromptType = item.dataset.value;

      document.getElementById("selectedPromptText").innerText =
        item.innerText;

      document
        .getElementById("promptDropdownList")
        .classList.add("hidden");
    });
  });


//// Helper to get prompt by type ----------------------------------------------------------
function getPromptByType(type, videoUrl) {
  switch (type) {
    case "vtv24":
      return `
        Hãy tóm tắt nội dung video YouTube của kênh VTV24 sau một cách rõ ràng, trung lập và dễ hiểu trong khoảng 300–400 từ.
        Link:
        ${videoUrl}
        Yêu cầu:
        - Viết bằng tiếng Việt, văn phong báo chí – thời sự
        - Giữ tính khách quan, không thêm ý kiến cá nhân
        - Làm rõ bối cảnh, nguyên nhân và tác động của sự việc
        - Bỏ qua intro, slogan kênh hoặc phần lặp thông tin không cần thiết
        Cấu trúc:
        1. Tổng quan sự kiện hoặc vấn đề được đề cập
          - Xảy ra ở đâu, khi nào, liên quan đến lĩnh vực nào
        2. Nội dung chính của bản tin
          - Các thông tin, số liệu hoặc diễn biến quan trọng
        3. Nguyên nhân và bối cảnh
          - Vì sao vấn đề này xảy ra hoặc trở nên đáng chú ý
        4. Tác động và hệ quả
          - Ảnh hưởng đến người dân, xã hội, kinh tế hoặc chính sách
        5. Kết luận
          - Tóm tắt lại ý nghĩa và giá trị thông tin của bản tin (2–3 câu)
        `.trim();

    case "study":
      return `
        Hãy tóm tắt nội dung video YouTube sau theo hướng học tập – kỹ thuật trong khoảng 300–400 từ.
        Link:
        ${videoUrl}
        Yêu cầu:
        - Viết bằng tiếng Việt, rõ ràng, mang tính giải thích
        - Bỏ qua intro, quảng cáo, nói lan man
        - Giữ nguyên và sử dụng chính xác thuật ngữ chuyên môn
        Cấu trúc:
        1. Tổng quan chủ đề và mục tiêu video
        2. Các khái niệm hoặc vấn đề chính được đề cập
        3. Các ý chính quan trọng (dạng gạch đầu dòng)
          - Giải thích từng ý bằng ngôn ngữ dễ hiểu
          - Nêu ví dụ hoặc tình huống minh họa nếu có
        4. Kiến thức cốt lõi cần ghi nhớ
        5. Giá trị thực tiễn của video trong học tập hoặc công việc
        `.trim();

    case "knowledge":
      return `
        Hãy tóm tắt dễ hiểu nội dung video YouTube sau trong khoảng 300–400 từ.
        Link:
        ${videoUrl}
        Yêu cầu:
        - Viết bằng tiếng Việt, phù hợp với người không chuyên
        - Diễn giải lại các khái niệm phức tạp bằng cách đơn giản
        Cấu trúc:
        1. Video nói về chủ đề gì?
        2. Những kiến thức hoặc sự thật quan trọng được trình bày
        3. Các ý chính (gạch đầu dòng)
          - Mỗi ý kèm theo giải thích hoặc ví dụ
        4. Điều thú vị hoặc bất ngờ trong video
        5. Giá trị kiến thức mà người xem nhận được
        `.trim();

    case "life":
      return `
        Hãy tóm tắt nội dung video YouTube sau theo hướng phân tích xã hội – cuộc sống trong khoảng 300–400 từ.
        Link:
        ${videoUrl}
        Yêu cầu:
        - Văn phong gần gũi, dễ suy ngẫm
        - Tập trung vào thông điệp và góc nhìn của tác giả
        Cấu trúc:
        1. Bối cảnh và chủ đề video
        2. Vấn đề xã hội hoặc câu hỏi lớn được đặt ra
        3. Các luận điểm chính (gạch đầu dòng)
          - Lý lẽ, ví dụ hoặc câu chuyện minh họa
        4. Thông điệp quan trọng nhất
        5. Bài học hoặc điều người xem có thể áp dụng vào cuộc sống
        `.trim(); 

    case "entertainment":
      return `
        Hãy tóm tắt nội dung video YouTube sau một cách sinh động, dễ đọc trong khoảng 300–400 từ.
        Link:
        ${videoUrl}
        Yêu cầu:
        - Văn phong tự nhiên, dễ theo dõi
        - Không cần quá học thuật
        Cấu trúc:
        1. Video xoay quanh nội dung gì?
        2. Diễn biến hoặc các phần chính của video
        3. Những điểm nổi bật hoặc đáng chú ý
        4. Cảm xúc hoặc trải nghiệm mà video mang lại
        5. Đánh giá ngắn gọn: video phù hợp với ai?
        `.trim();

    case "quick":
      return `
        Hãy tóm tắt nội dung video YouTube sau theo dạng ghi chú học nhanh.
        Link:
        ${videoUrl}
        Yêu cầu:
        - 300–350 từ
        - Ngắn gọn, súc tích, dễ quét mắt
        - Ưu tiên gạch đầu dòng
        Cấu trúc:
        - Chủ đề chính
        - Các ý quan trọng nhất (bullet points)
        - Khái niệm cần nhớ
        - 3–5 dòng tổng kết giá trị video
        `.trim();

    case "teaching":
      return `
        Hãy tóm tắt nội dung video YouTube sau theo phong cách bài giảng / giải thích.
        Link:
        ${videoUrl}
        Yêu cầu:
        - 300–400 từ
        - Viết rõ ràng, mạch lạc, dễ hiểu
        - Phù hợp cho người mới học
        - Giải thích các khái niệm theo từng bước
        Cấu trúc:
        - Chủ đề và mục tiêu bài giảng
        - Các nội dung hoặc khái niệm chính
        - Giải thích từng ý bằng ngôn ngữ đơn giản
        - Ví dụ hoặc minh họa (nếu có)
        - 2–3 câu tổng kết giá trị học tập của video
        `.trim();

    case "storytelling":
      return `
        Hãy tóm tắt nội dung video YouTube sau theo phong cách kể chuyện / podcast.
        Link:
        ${videoUrl}
        Yêu cầu:
        - 300–400 từ
        - Giữ mạch câu chuyện và diễn biến chính
        - Văn phong tự nhiên, dễ theo dõi
        - Nhấn mạnh cảm xúc, bối cảnh hoặc tình huống
        Cấu trúc:
        - Bối cảnh hoặc mở đầu câu chuyện
        - Diễn biến chính theo trình tự
        - Các điểm cao trào hoặc chi tiết đáng chú ý
        - Thông điệp hoặc ý nghĩa rút ra
        - 2–3 câu kết luận tổng giá trị của video
        `.trim();

    default:
      return `
        Hãy tóm tắt nội dung video YouTube sau trong khoảng 300–400 từ.
        Link:
        ${videoUrl}
        `.trim();
  }
}
