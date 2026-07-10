import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  const map: Record<string, string> = {
    à: "a", á: "a", ả: "a", ã: "a", ạ: "a", ă: "a", ắ: "a", ằ: "a", ẳ: "a", ẵ: "a", ặ: "a",
    â: "a", ấ: "a", ầ: "a", ẩ: "a", ẫ: "a", ậ: "a", è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
    ê: "e", ế: "e", ề: "e", ể: "e", ễ: "e", ệ: "e", ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
    ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o", ô: "o", ố: "o", ồ: "o", ổ: "o", ỗ: "o", ộ: "o",
    ơ: "o", ớ: "o", ờ: "o", ở: "o", ỡ: "o", ợ: "o", ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
    ư: "u", ứ: "u", ừ: "u", ử: "u", ữ: "u", ự: "u", ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y", đ: "d",
  };
  return text
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  const key = req.headers.get("x-api-key");
  if (!process.env.ARTICLE_API_KEY || key !== process.env.ARTICLE_API_KEY) {
    return NextResponse.json({ error: "Sai hoặc thiếu API key" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không phải JSON hợp lệ" }, { status: 400 });
  }

  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();
  if (!title || !content) {
    return NextResponse.json({ error: "Thiếu title hoặc content" }, { status: 400 });
  }

  const slug = body.slug ? slugify(String(body.slug)) : slugify(title);

  const data = {
    slug,
    title,
    h1: body.h1 ? String(body.h1) : null,
    excerpt: body.excerpt ? String(body.excerpt) : null,
    content,
    coverImage: body.coverImage ? String(body.coverImage) : null,
    category: body.category ? String(body.category) : "Kiến thức",
    tags: body.tags ? String(body.tags) : "",
    metaTitle: body.metaTitle ? String(body.metaTitle) : null,
    metaDescription: body.metaDescription ? String(body.metaDescription) : null,
    faqJson: body.faqs ? JSON.stringify(body.faqs) : null,
    published: body.published === false ? false : true,
  };

  const article = await prisma.article.upsert({
    where: { slug },
    update: data,
    create: data,
  });

  return NextResponse.json({
    ok: true,
    id: article.id,
    slug: article.slug,
    url: `/tin-tuc/${article.slug}`,
  });
}

export async function GET(req: Request) {
  const key = req.headers.get("x-api-key");
  if (!process.env.ARTICLE_API_KEY || key !== process.env.ARTICLE_API_KEY) {
    return NextResponse.json({ error: "Sai hoặc thiếu API key" }, { status: 401 });
  }
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, category: true, published: true, publishedAt: true },
  });
  return NextResponse.json({ count: articles.length, articles });
}
