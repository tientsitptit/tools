export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // ===== CORS =====
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Chỉ hỗ trợ POST" }),
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const { story, chapter } = await request.json();

      if (!story || !chapter) {
        return json({
          error: "Thiếu story hoặc chapter",
          received: { story, chapter }
        }, 400);
      }

      // ✅ BUILD URL TỪ FRONTEND
      const url = `https://truyencom.com/${story}/chuong-${chapter}.html`;

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        }
      });

      const html = await res.text();

      // ===== DEBUG HTML (nếu lỗi)
      const debugHtml = html.slice(0, 1200);

      // ✅ SELECTOR ĐÚNG CHO truyencom.com
      const match =
        html.match(
          /<div[^>]*id=["']chapter-c["'][^>]*>([\s\S]*?)<\/div>/i
        ) ||
        html.match(
          /<div[^>]*class=["'][^"']*chapter-c[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
        );

      if (!match) {
        return json({
          error: "Không tìm thấy nội dung chương",
          built_url: url,
          debug_html_preview: debugHtml
        });
      }

      let content = match[1]
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\n{2,}/g, "\n\n")
        .trim();

      return json({
        success: true,
        story,
        chapter,
        url,
        content
      });

    } catch (err) {
      return json({
        error: "Worker exception",
        message: err.message
      }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
