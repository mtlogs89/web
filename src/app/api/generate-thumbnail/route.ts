import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set in environment");
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const { title, category } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const openai = getOpenAI();

    // Build prompt with article title and category
    const prompt = `Professional logistics shipping banner for article: "${title}"${
      category ? ` (Category: ${category})` : ""
    }. Style: Modern, clean, cargo airplane, delivery truck, shipping containers, teal green and white color scheme. Vibrant colors, 4k quality. NO text or letters on image.`;

    // Call DALL-E 3 API
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    // Download image from URL
    const imageResponse_fetch = await fetch(imageUrl);
    if (!imageResponse_fetch.ok) {
      return NextResponse.json({ error: "Failed to download image" }, { status: 500 });
    }

    const buffer = await imageResponse_fetch.arrayBuffer();

    // Save to /uploads directory
    const uploadsDir = join(process.cwd(), "public", "uploads");
    mkdirSync(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `ai-thumbnail-${timestamp}.webp`;
    const filepath = join(uploadsDir, filename);

    writeFileSync(filepath, Buffer.from(buffer));

    // Return relative URL
    const thumbnailUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      thumbnailUrl,
      message: "Thumbnail generated successfully",
    });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate thumbnail",
      },
      { status: 500 },
    );
  }
}
