import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getArticleBySlug, parseFaq, readingMinutes } from "@/lib/articles";
import {
  JsonLd,
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";
import { site } from "@/lib/site";
import { ContactOverride } from "@/components/site/contact-override";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  const url = `${site.url}/tin-tuc/${article.slug}`;
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      url,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const faqs = parseFaq(article.faqJson);
  const url = `${site.url}/tin-tuc/${article.slug}`;
  const date = new Date(article.publishedAt).toLocaleDateString("vi-VN");
  const phone = article.phone || site.phone;
  const phoneDisplay = article.phone || site.phoneDisplay;

  return (
    <>
      {article.phone && <ContactOverride phone={article.phone} />}
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt || article.title,
          url,
          image: article.coverImage || undefined,
          datePublished: new Date(article.publishedAt).toISOString(),
          dateModified: new Date(article.updatedAt).toISOString(),
        })}
      />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Tin tức", url: `${site.url}/tin-tuc` },
          { name: article.title, url },
        ])}
      />

      <PageHero
        title={article.title}
        crumbs={[
          { name: "Tin tức", href: "/tin-tuc" },
          { name: article.category, href: `/tin-tuc?cat=${encodeURIComponent(article.category)}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-600">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {date} · {readingMinutes(article.content)} phút đọc
          </span>
        </div>

        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-6 w-full rounded-3xl object-cover"
          />
        )}

        <div
          className="prose-mt mt-8"
          dangerouslySetInnerHTML={{
            // Ảnh trong bài chỉ tải khi khách cuộn tới (đỡ nặng trang)
            __html: article.content.replace(/<img /g, '<img loading="lazy" decoding="async" '),
          }}
        />

        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-black text-ink">Câu hỏi thường gặp</h2>
            <div className="mt-5 space-y-3">
              {faqs.map((f, i) => (
                <details
                  key={i}
                  className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm"
                >
                  <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
                  <p className="mt-2 text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 rounded-3xl bg-brand-50 p-7 text-center">
          <h3 className="text-xl font-black text-ink">Cần gửi hàng hoặc tư vấn thêm?</h3>
          <p className="mt-2 text-ink-soft">
            Gọi Minh Thiện Logistics để được báo giá miễn phí, chính xác trong 5 phút.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3 font-semibold text-white shadow-lg shadow-coral-500/30 hover:bg-coral-600"
            >
              <Phone className="h-5 w-5" /> {phoneDisplay}
            </a>
            <Link
              href="/lien-he"
              className="rounded-full border border-brand-200 bg-white px-7 py-3 font-semibold text-brand-700 hover:bg-white"
            >
              Gửi yêu cầu báo giá
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
