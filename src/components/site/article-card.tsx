import Link from "next/link";
import { Calendar } from "lucide-react";
import { readingMinutes } from "@/lib/articles";

const grads = [
  "linear-gradient(135deg,#1FB6A2,#0f7568)",
  "linear-gradient(135deg,#F2A93C,#e0941f)",
  "linear-gradient(135deg,#EC5E5E,#d94747)",
];

type ArticleLike = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  coverImage: string | null;
  content: string;
  publishedAt: Date;
};

export function ArticleCard({ article, index = 0 }: { article: ArticleLike; index?: number }) {
  const date = new Date(article.publishedAt).toLocaleDateString("vi-VN");
  return (
    <article className="overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/10">
      <Link href={`/tin-tuc/${article.slug}`} className="block">
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.coverImage} alt={article.title} className="h-44 w-full object-cover" />
        ) : (
          <div className="h-44" style={{ background: grads[index % grads.length] }} />
        )}
        <div className="p-6">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
            {article.category}
          </span>
          <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{article.title}</h3>
          {article.excerpt && <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>}
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
            <Calendar className="h-3.5 w-3.5" /> {date} · {readingMinutes(article.content)} phút đọc
          </div>
        </div>
      </Link>
    </article>
  );
}
