"use client";

// Gắn qua src/components/site/anh-nen.tsx. Ảnh nội bộ đi qua /anh-nen/<rộng>/<chất lượng>/<đường dẫn ảnh> thay vì /_next/image?url=...
// Đường dẫn kết thúc bằng đuôi ảnh (.jpg/.webp…) nên Cloudflare gói miễn phí TỰ lưu sẵn;
// còn /_next/image?url=… không có đuôi nên lần nào cũng phải chạy về VPS (đo 15-17/10/2026:
// khách bị đẩy qua trạm xa thì mỗi ảnh 3-9 giây). Xem src/app/anh-nen/.../route.ts.
export default function anhLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const q = quality || 75;
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("?")) {
    return `/anh-nen/${width}/${q}${src}`;
  }
  // Ảnh ngoài (Unsplash…) giữ đường cũ của Next.
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
