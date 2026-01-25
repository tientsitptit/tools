export default {
  async fetch(request, env) { // Thêm 'env' để lấy API Key
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Chỉ hỗ trợ POST" }, 405);
    }

    try {
      const { story, chapter, summarize = false } = await request.json();

      if (!story || !chapter) {
        return json({ error: "Thiếu story hoặc chapter" }, 400);
      }

      const url = `https://truyencom.com/${story}/chuong-${chapter}.html`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..." }
      });

      const html = await res.text();

      // 1. Lấy Tiêu đề chương (Regex dựa trên cấu trúc file HTML bạn gửi)
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      let chapterTitle = "";
      if (titleMatch) {
        // Loại bỏ các tag con bên trong như <span>Chương </span> và làm sạch text
        chapterTitle = titleMatch[1].replace(/<\/?[^>]+>/g, "").trim();
      }

      // Regex lấy nội dung
      let content = "";
      const rewriter = new HTMLRewriter()
        .on(".chapter-c", {
          text(text) {
            content += text.text;
          }
        })
        .on(".chapter-c p", {
          element() {
            content += "\n\n";
          }
        })
        .on(".chapter-c br", {
          element() {
            content += "\n";
          }
        });

      await rewriter.transform(new Response(html)).text();
      content = content
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      content = content.replace(/\(adsbygoogle[\s\S]*?\);\s*/g, "\n");
      content = content.replace(/Bạn đang đọc truyện tại.*?\n/g, "\n");
      content = content.replace(/\n{3,}/g, "\n\n").trim();


      // Tóm tắt nội dung 
      let summary = "";

      // NẾU FRONTEND YÊU CẦU TÓM TẮT
      if (summarize && content.length > 100) {
        // Gọi hàm tóm tắt
        const aiSummary = await summarizeWithGemini(content, env.GEMINI_API_KEY);
        
        // THÊM TIÊU ĐỀ IN ĐẬM VÀO ĐÂY
        summary = `${chapterTitle}\n\n${aiSummary}`;
      }

      content = `${chapterTitle}\n\n${content}`;

      return json({
        success: true,
        story,
        chapter,
        url,
        content,
        summary // Trả về tóm tắt (nếu có)
      });

    } catch (err) {
      return json({ error: "Worker exception", message: err.message }, 500);
    }
  }
};

// Hàm gọi API Gemini đã được fix logic
async function summarizeWithGemini(text, apiKey) {
  // Thay 'gemini-flash-latest' bằng model cụ thể
  // const MODEL_NAME = "gemini-2.5-flash-lite"; 
  // const MODEL_NAME = "gemini-2.5-flash-lite-preview-09-2025"; 
  // const MODEL_NAME = "gemini-flash-latest"; 
  // const MODEL_NAME = "gemini-3-flash-preview"; 
  const MODEL_NAME = "gemini-robotics-er-1.5-preview"; 

  /**
   ** Link check token Requests Per Day
  https://aistudio.google.com/usage?timeRange=last-28-days&tab=rate-limit&hl=vi&_gl=1*1ls85dk*_ga*OTM1NTk3NjUwLjE3NjkwMDA0Njc.*_ga_P1DBVKWT6V*czE3NjkzMDI0MzkkbzIkZzEkdDE3NjkzMDI1MzQkajU5JGwwJGgxMjM0MTM5NTY5&project=gen-lang-client-0104344035

   */

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const prompt = `Bạn hãy tóm tắt chi tiết dễ hiểu diễn biến của truyện trong nội dung sau tầm 350 chữ (ít nhất cũng phải được 300 chữ):\n\n${text}. Trả lời chữ bình thường không cần in đậm`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    //const responseAPI = `Lỗi API (${response.status}): ${data.error?.message || "Không xác định"}`; 
    const responseAPI = ""; 
    // Trả về lỗi chi tiết nếu vẫn thất bại
    return responseAPI;
  } catch (e) {
    return "Lỗi kết nối hệ thống.";
  }
}
// Hàm bổ trợ JSON response
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}