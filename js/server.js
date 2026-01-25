
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== CORS =====
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    // ===== ROUTER =====
    if (url.pathname === "/story") {
      return handleStory(request, env);
    }

    if (url.pathname === "/youtube") {
      return handleYoutube(request, env);
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        status: 404,
        headers: corsHeaders(true)
      }
    );
  }
};

async function handleStory(request, env) {
  try {
    const { story, chapter, summarize = false } = await request.json();

    if (!story || !chapter) {
      return json({ error: "Thiếu story hoặc chapter" }, 400);
    }

    const url = `https://truyencom.com/${story}/chuong-${chapter}.html`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const html = await res.text();

    // ===== LẤY TIÊU ĐỀ =====
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    let chapterTitle = titleMatch
      ? titleMatch[1].replace(/<\/?[^>]+>/g, "").trim()
      : "";

    // ===== LẤY NỘI DUNG =====
    let content = "";
    const rewriter = new HTMLRewriter()
      .on(".chapter-c", {
        text(t) {
          content += t.text;
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
      .replace(/\(adsbygoogle[\s\S]*?\);\s*/g, "\n")
      .replace(/Bạn đang đọc truyện tại.*?\n/g, "\n")
      .trim();

    let summary = "";

    if (summarize && content.length > 100) {
      const aiSummary = await summarizeWithGemini(
        content,
        env.GEMINI_API_KEY
      );
      summary = `${chapterTitle}\n\n${aiSummary}`;
    }

    content = `${chapterTitle}\n\n${content}`;

    return json({
      success: true,
      story,
      chapter,
      url,
      content,
      summary
    });

  } catch (err) {
    return json(
      { error: "Worker exception", message: err.message },
      500
    );
  }
}

// ===== GEMINI =====
async function summarizeWithGemini(text, apiKey) {
  const MODEL_NAME = "gemini-flash-latest";
  const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const prompt = `Bạn hãy tóm tắt chi tiết dễ hiểu diễn biến của truyện sau (300–400 chữ):\n\n${text}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

  } catch {
    return "";
  }
}

// ===== JSON HELPER =====
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

async function handleYoutube(request, env) {
  try {
    // ===== parse body =====
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const { url } = body;
    if (!url) {
      return jsonError("Missing url", 400);
    }

    if (!env.YT_API_KEY) {
      return jsonError("Missing API key", 500);
    }

    // ===== lấy handle từ URL =====
    const match = url.match(/youtube\.com\/@([^\/]+)/);
    if (!match) {
      return jsonError("Invalid YouTube channel URL", 400);
    }
    const handle = match[1];

    // ===== 1️⃣ handle -> channelId =====
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${env.YT_API_KEY}`
    );
    const chData = await chRes.json();

    const channelId = chData.items?.[0]?.id;
    if (!channelId) {
      return jsonError("Channel not found", 404);
    }

    // ===== 2️⃣ channelId -> uploads playlist =====
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${env.YT_API_KEY}`
    );
    const plData = await plRes.json();

    const uploadsId =
      plData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsId) {
      return jsonError("Uploads playlist not found", 404);
    }

    // ===== 3️⃣ uploads playlist -> videos =====
    const vRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=30&playlistId=${uploadsId}&key=${env.YT_API_KEY}`
    );
    const vData = await vRes.json();

    const videos = (vData.items || []).map(v => ({
      title: v.snippet.title,
      url: `https://www.youtube.com/watch?v=${v.snippet.resourceId.videoId}`
    }));

    return new Response(JSON.stringify(videos), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return jsonError(err.message || "Internal error", 500);
  }
}

function jsonError(message, status = 400) {
  return new Response(
    JSON.stringify({ error: true, message }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}

// ===== CORS HELPER =====
function corsHeaders(json = false) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...(json ? { "Content-Type": "application/json; charset=utf-8" } : {})
  };
}
