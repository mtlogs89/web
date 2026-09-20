import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import {
  findSimilarSlug,
  getArticleBySlug,
  getArticleRedirect,
  getRelatedArticles,
  parseFaq,
  readingMinutes,
  tomTatThe,
} from "@/lib/articles";
import { detectTopic, topicOfCategory } from "@/lib/topics";
import { ROUTE_GOODS_NOTE, ROUTE_TRANSIT } from "@/lib/transit";
import {
  JsonLd,
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";
import { site } from "@/lib/site";
import { ContactOverride } from "@/components/site/contact-override";
import { ArticleContent, QUOTE_TOKEN, destFromCategory } from "@/components/site/article-content";
import { getDestinations } from "@/lib/price-tables";

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
  if (!article || !article.published) {
    // Bài đã gộp → bài chính của nhóm.
    const merged = await getArticleRedirect(slug);
    if (merged) permanentRedirect(`/tin-tuc/${merged}`);
    // Link cũ trỏ tới bài đã đổi slug → đưa về bài gần nghĩa nhất / trang tuyến.
    const similar = await findSimilarSlug(slug);
    if (similar) permanentRedirect(`/tin-tuc/${similar}`);
    const topic = detectTopic(slug);
    if (topic) permanentRedirect(topic.hub);
    notFound();
  }

  const faqs = parseFaq(article.faqJson);
  const url = `${site.url}/tin-tuc/${article.slug}`;
  const date = new Date(article.publishedAt).toLocaleDateString("vi-VN");
  // Chỉ hiện "Cập nhật" khi sửa sau ngày đăng từ 1 ngày trở lên.
  const updated =
    article.updatedAt.getTime() - article.publishedAt.getTime() > 86_400_000
      ? article.updatedAt
      : null;
  const phone = article.phone || site.phone;
  const phoneDisplay = article.phone || site.phoneDisplay;
  // Bảng giá chỉ cần khi bài có chèn công cụ tính cước.
  const coCongCuTinh = article.content.includes(QUOTE_TOKEN);
  const dests = coCongCuTinh ? await getDestinations() : undefined;
  const { destKey, country } = destFromCategory(article.category);
  const topic = topicOfCategory(article.category);
  const categoryHref = `/tin-tuc?cat=${encodeURIComponent(article.category)}`;
  const related = await getRelatedArticles(article);

  return (
    <>
      {article.phone && <ContactOverride phone={article.phone} />}
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt || article.title,
          url,
          section: article.category,
          keywords: article.tags || undefined,
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
          { name: article.category, url: `${site.url}${categoryHref}` },
          { name: article.title, url },
        ])}
      />

      <PageHero
        title={article.title}
        crumbs={[
          { name: "Tin tức", href: "/tin-tuc" },
          { name: article.category, href: categoryHref },
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-600">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt.toISOString()}>{date}</time>
            {updated && (
              <>
                {" "}· Cập nhật{" "}
                <time dateTime={updated.toISOString()}>{updated.toLocaleDateString("vi-VN")}</time>
              </>
            )}{" "}
            · {readingMinutes(article.content)} phút đọc
          </span>
        </div>

        {article.excerpt && (
          // AEO: câu trả lời ngắn ngay đầu bài — Google/ChatGPT hay trích đoạn này.
          <p className="mt-6 rounded-2xl border-l-4 border-brand-500 bg-brand-50 px-5 py-4 font-medium text-ink">
            <strong className="text-brand-700">Tóm tắt nhanh: </strong>
            {article.excerpt}
          </p>
        )}

        {ROUTE_TRANSIT[article.category] && (
          // Số chuẩn do chủ chốt — bài robot viết có thể ghi số khác, ô này là câu trả lời chính thức.
          <div className="mt-4 rounded-2xl border border-sun-200 bg-sun-50 px-5 py-4 text-ink">
            <strong>Thời gian gửi đi {ROUTE_TRANSIT[article.category].name} (đường bay):</strong>{" "}
            {ROUTE_TRANSIT[article.category].text}.
            {ROUTE_GOODS_NOTE[article.category] && (
              <span className="mt-2 block">
                <strong>Mặt hàng:</strong> {ROUTE_GOODS_NOTE[article.category]}
              </span>
            )}
          </div>
        )}

        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-6 w-full rounded-3xl object-cover"
          />
        )}

        <div className="mt-8">
          <ArticleContent
            html={article.content}
            country={country}
            destKey={destKey}
            dests={dests}
            phone={article.phone}
          />
        </div>

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

        {(topic || related.length > 0) && (
          <nav aria-label="Bài viết liên quan" className="mt-12">
            {topic && (
              <Link
                href={topic.hub}
                className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white p-5 font-bold text-brand-700 shadow-sm hover:border-brand-300"
              >
                <span>
                  {topic.hub.startsWith("/dich-vu") ? "Dịch vụ" : "Tất cả bài"}{" "}
                  {topic.category.toLowerCase()}
                  {topic.hub.startsWith("/dich-vu") ? ": bảng giá, thời gian, hàng nhận gửi" : ""}
                </span>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            )}
            {related.length > 0 && (
              <>
                <h2 className="mt-8 text-2xl font-black text-ink">Bài viết liên quan</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/tin-tuc/${r.slug}`}
                        className="flex h-full gap-3 rounded-2xl border border-brand-50 bg-white p-3 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                      >
                        <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                          {r.coverImage && (
                            <Image
                              src={r.coverImage}
                              alt={r.title}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 py-0.5">
                          <span className="line-clamp-2 font-bold text-ink">{r.title}</span>
                          {tomTatThe(r.excerpt, r.metaDescription) && (
                            <span className="mt-1 line-clamp-2 text-sm text-ink-muted">
                              {tomTatThe(r.excerpt, r.metaDescription)}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={categoryHref} className="mt-4 inline-block font-semibold text-brand-600 hover:underline">
                  Xem tất cả bài {article.category.toLowerCase()} →
                </Link>
              </>
            )}
          </nav>
        )}

        <div className="mt-12 rounded-3xl bg-brand-50 p-7 text-center">
          <h3 className="text-xl font-black text-ink">Cần gửi hàng hoặc tư vấn thêm?</h3>
          <p className="mt-2 text-ink-soft">
            Gọi Minh Thiện Logistics để được báo giá miễn phí, chính xác trong 5 phút.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <CallAction
              phone={phone}
              className="flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3 font-semibold text-white shadow-lg shadow-coral-500/30 hover:bg-coral-600"
            >
              <Phone className="h-5 w-5" /> {phoneDisplay}
            </CallAction>
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
