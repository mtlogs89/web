// Cửa ảnh nén cho src/lib/anh-loader.ts: nhận /anh-nen/828/75/images/cargo-port.jpg, nhờ bộ nén
// sẵn có của Next (/_next/image, có cache trên đĩa) làm việc, rồi trả kèm cache dài để
// Cloudflare và trình duyệt giữ ảnh. Gọi Next qua 127.0.0.1 — đi qua tên miền sẽ vòng ra
// Cloudflare rồi mới quay về.
const PORT = process.env.PORT || "3000";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ w: string; q: string; path: string[] }> }
) {
  const { w, q, path } = await params;
  if (!/^\d{1,4}$/.test(w) || !/^\d{1,3}$/.test(q) || path.some((p) => p === ".." || p === ".")) {
    return new Response("Not found", { status: 404 });
  }
  const url = "/" + path.map(encodeURIComponent).join("/");
  const res = await fetch(
    `http://127.0.0.1:${PORT}/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}`,
    { headers: { accept: req.headers.get("accept") || "image/webp,*/*" } }
  );
  if (!res.ok) {
    return new Response(null, { status: res.status === 400 ? 404 : res.status });
  }
  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/webp",
      // Thay ảnh thì đổi tên file (ảnh up/AI vẽ đều có số thời gian trong tên).
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
}
