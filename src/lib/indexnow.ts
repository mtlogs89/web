import { site } from "./site";

/**
 * IndexNow: báo Bing (và Yandex, Seznam…) có URL mới/đổi để vào đọc ngay thay vì chờ
 * vài ngày. ChatGPT Search và Copilot lấy kết quả từ Bing nên bài mới được AI thấy sớm hơn.
 * File khoá nằm ở public/<KEY>.txt.
 *
 * Chỉ chạy khi .env có INDEXNOW=1 (đặt trên VPS) — máy local build y hệt production
 * nên không dựa vào NODE_ENV được.
 */
export const INDEXNOW_KEY = "47d913aea336b8ce1cc64d2329895316";

export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.INDEXNOW !== "1" || paths.length === 0) return;
  const host = new URL(site.url).host;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${site.url}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((p) => `${site.url}${p}`),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok && res.status !== 202) console.error("IndexNow", res.status, await res.text());
  } catch (e) {
    // Báo hỏng không được làm hỏng việc lưu bài.
    console.error("IndexNow failed:", e);
  }
}
