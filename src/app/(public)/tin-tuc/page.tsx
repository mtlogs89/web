import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ArticleCard } from "@/components/site/article-card";
import { getPublishedArticles, getCategories } from "@/lib/articles";
import { EU_COUNTRIES, EU_CATEGORY, DESTINATIONS } from "@/lib/eu-countries";

export const metadata: Metadata = {
  title: "Tin tức & cẩm nang gửi hàng quốc tế",
  description:
    "Cẩm nang, kinh nghiệm và hướng dẫn gửi hàng đi Mỹ, Úc, Châu Âu, nhập hàng Trung Quốc từ Minh Thiện Logistics.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const [articles, categories] = await Promise.all([
    getPublishedArticles({ category: cat }),
    getCategories(),
  ]);

  const isEu = cat === EU_CATEGORY;
  const countByCat = new Map(categories.map((c) => [c.name, c.count]));

  // Với chuyên mục Châu Âu: tách bài theo nước & các bài chung (tổng quan…)
  const euSlugs = new Set(EU_COUNTRIES.map((c) => c.slug));
  const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
  const euGeneralArticles = isEu ? articles.filter((a) => !euSlugs.has(a.slug)) : [];

  return (
    <>
      <PageHero
        title="Tin tức & cẩm nang"
        subtitle="Kinh nghiệm gửi hàng quốc tế, nhập hàng và mọi điều bạn cần biết trước khi gửi."
        crumbs={[{ name: "Tin tức", href: "/tin-tuc" }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Điểm đến chính */}
        {!cat && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-black text-ink">Cẩm nang theo điểm đến</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {DESTINATIONS.map((d) => (
                <Link
                  key={d.category}
                  href={`/tin-tuc?cat=${encodeURIComponent(d.category)}`}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-brand-50 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.flagImg} alt={d.label} className="h-10 w-14 rounded-md object-cover shadow" />
                  <span className="font-bold text-ink group-hover:text-brand-600">{d.label}</span>
                  <span className="text-xs text-ink-muted">{countByCat.get(d.category) ?? 0} bài viết</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bộ lọc chuyên mục */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/tin-tuc"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !cat ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
            }`}
          >
            Tất cả
          </Link>
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/tin-tuc?cat=${encodeURIComponent(c.name)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                cat === c.name ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {c.name} ({c.count})
            </Link>
          ))}
        </div>

        {/* Lưới 27 nước Châu Âu */}
        {isEu && (
          <div className="mb-12">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-ink">
                  Gửi hàng đi Châu Âu — {EU_COUNTRIES.length} quốc gia
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Chọn quốc gia để xem hướng dẫn gửi hàng chi tiết: chi phí, thủ tục, thời gian.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {EU_COUNTRIES.map((c) => {
                const article = articleBySlug.get(c.slug);
                return article ? (
                  <Link
                    key={c.slug}
                    href={`/tin-tuc/${c.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-brand-50 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
                  >
                    <span className="text-3xl">{c.flag}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-ink group-hover:text-brand-600">
                        {c.nameVi}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-600">
                        Xem bài viết <ArrowRight className="h-3 w-3" />
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div
                    key={c.slug}
                    className="flex items-center gap-3 rounded-2xl border border-dashed border-brand-100 bg-brand-50/40 p-4 opacity-70"
                  >
                    <span className="text-3xl">{c.flag}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-ink-soft">{c.nameVi}</span>
                      <span className="text-xs text-ink-muted">Sắp có bài</span>
                    </span>
                  </div>
                );
              })}
            </div>
            {euGeneralArticles.length > 0 && (
              <h3 className="mb-4 mt-10 text-lg font-black text-ink">Cẩm nang chung về Châu Âu</h3>
            )}
          </div>
        )}

        {/* Danh sách bài viết */}
        {isEu ? (
          euGeneralArticles.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {euGeneralArticles.map((a, i) => (
                <ArticleCard key={a.id} article={a} index={i} />
              ))}
            </div>
          )
        ) : articles.length === 0 ? (
          <p className="py-16 text-center text-ink-muted">Chưa có bài viết trong mục này.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
