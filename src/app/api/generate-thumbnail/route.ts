import { NextRequest, NextResponse } from "next/server";
import { generateThumbnail } from "@/lib/ai-thumbnail";
import { getAdminId } from "@/lib/auth";

export const maxDuration = 120; // vẽ ảnh mất ~30-60s

export async function POST(request: NextRequest) {
  // Gọi OpenAI tốn tiền: chỉ admin đã đăng nhập hoặc script có ARTICLE_API_KEY.
  const adminId = await getAdminId();
  const key = request.headers.get("x-api-key");
  const isValidKey = !!process.env.ARTICLE_API_KEY && key === process.env.ARTICLE_API_KEY;
  if (!adminId && !isValidKey) {
    return NextResponse.json({ error: "Không được phép" }, { status: 401 });
  }

  try {
    const { title, category } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Thiếu tiêu đề bài viết" }, { status: 400 });
    }

    const thumbnailUrl = await generateThumbnail(title, category);

    return NextResponse.json({ success: true, thumbnailUrl });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Vẽ ảnh thất bại" },
      { status: 500 },
    );
  }
}
