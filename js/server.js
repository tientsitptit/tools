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

      // Regex lấy nội dung
      const match = html.match(/<div[^>]*id=["']chapter-c["'][^>]*>([\s\S]*?)<\/div>/i) ||
                    html.match(/<div[^>]*class=["'][^"']*chapter-c[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

      if (!match) {
        return json({ error: "Không tìm thấy nội dung chương", url });
      }

      let content = match[1]
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\n{2,}/g, "\n\n")
        .trim();

      let summary = "";

      // ✅ NẾU FRONTEND YÊU CẦU TÓM TẮT
      if (summarize && content.length > 100) {
        summary = await summarizeWithGemini(content, env.GEMINI_API_KEY);
      }

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
  //const MODEL_NAME = "gemini-3-flash-preview"; 
  const MODEL_NAME = "gemini-3-flash-preview"; 
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const prompt = `Bạn hãy tóm tắt dễ hiểu diễn biến của truyện trong nội dung sau tầm 250 chữ:\n\n${text}. Trả lời chữ bình thường không cần in đậm`;

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

    // Trả về lỗi chi tiết nếu vẫn thất bại
    return `Lỗi API (${response.status}): ${data.error?.message || "Không xác định"}`;
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