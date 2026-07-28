import { NextRequest, NextResponse } from "next/server";
import { generateThumbnail } from "@/lib/ai-thumbnail";

export const maxDuration = 120; // vẽ ảnh mất ~30-60s

export async function POST(request: NextRequest) {
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
