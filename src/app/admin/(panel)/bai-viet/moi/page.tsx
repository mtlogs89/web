import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleEditor } from "../article-editor";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const cats = await prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return (
    <div>
      <Link href="/admin/bai-viet" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>
      <h1 className="mb-6 text-2xl font-black text-ink">Viết bài mới</h1>
      <ArticleEditor categories={cats.map((c) => c.name)} />
    </div>
  );
}
