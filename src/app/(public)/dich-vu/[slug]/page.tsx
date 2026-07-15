import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Phone, ArrowRight, BookOpen } from "lucide-react";
import Database from "better-sqlite3";
import { PageHero } from "@/components/site/page-hero";
import { ServiceMedia } from "@/components/site/service-media";
import { services, site } from "@/lib/site";
import { serviceContent, serviceImages } from "@/lib/service-content";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { GuiHangMyDetail } from "@/components/site/gui-hang-my-detail";
import { gallery } from "@/lib/gallery";
import {
  JsonLd,
  serviceJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Không tìm thấy dịch vụ" };
  const detail = serviceContent[slug];
  return {
    title: service.title,
    description: detail?.intro || service.short,
    alternates: { canonical: `${site.url}/dich-vu/${slug}` },
  };
}

function getRelatedArticles(slug: string) {
  const articleMapping: Record<string, string[]> = {
    "gui-hang-di-my": [
      "gui-hang-di-my-tong-quan",
      "gui-hang-di-my-nhan-tat-ca-hang-kho",
      "gui-hang-cong-kenh-di-my-tinh-cuoc",
    ],
    "gui-hang-di-uc": [
      "gui-hang-di-uc-tong-quan",
      "gui-thuc-pham-kho-di-uc-kiem-dich",
      "gui-hang-cam-di-uc-danh-sach",
    ],
    "gui-hang-di-canada": [
      "gui-hang-di-canada-tong-quan",
      "gui-thuc-pham-kho-di-canada",
      "gui-hang-di-canada-mat-bao-lau",
    ],
    "gui-hang-di-chau-au": [
      "gui-hang-di-chau-au-tong-quan",
      "gui-hang-di-germany",
      "gui-hang-di-france",
    ],
    "gui-hang-di-nhat": [
      "gui-hang-di-nhat-tong-quan",
      "gui-do-an-cho-thuc-tap-sinh-nhat",
      "gui-hang-cam-di-nhat-danh-sach",
    ],
    "gui-hang-di-han": [
      "gui-hang-di-han-tong-quan",
      "gui-do-an-cho-lao-dong-han-quoc",
      "gui-qua-cho-co-dau-viet-o-han",
    ],
  };

  const articleSlugs = articleMapping[slug] || [];
  if (articleSlugs.length === 0) return [];

  try {
    const db = new Database(`${process.cwd()}/prisma/dev.db`);
    const placeholders = articleSlugs.map(() => "?").join(",");
    const rows = db.prepare(
      `SELECT slug, title, excerpt, coverImage FROM Article WHERE slug IN (${placeholders})`
    ).all(...articleSlugs) as Array<{ slug: string; title: string; excerpt: string; coverImage: string }>;
    db.close();
    return rows;
  } catch (e) {
    console.error("Failed to fetch articles:", e);
    return [];
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const detail = serviceContent[slug];
  if (!service || !detail) notFound();

  const url = `${site.url}/dich-vu/${slug}`;
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  const relatedArticles = getRelatedArticles(slug);

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: service.title, description: detail.intro, url })} />
      <JsonLd data={faqJsonLd(detail.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Dịch vụ", url: `${site.url}/gui-hang` },
          { name: service.title, url },
        ])}
      />

      <PageHero
        title={service.title}
        subtitle={detail.intro}
        crumbs={[
          { name: service.group === "nhap-hang" ? "Nhập hàng" : "Gửi hàng đi", href: service.group === "nhap-hang" ? "/nhap-hang" : "/gui-hang" },
          { name: service.title, href: url },
        ]}
      />

      {slug === "gui-hang-di-my" ? (
        <>
          <GuiHangMyDetail />

          {relatedArticles.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 py-14">
              <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
                <BookOpen className="h-6 w-6" /> Bài viết liên quan
              </h2>
              <p className="mt-2 text-ink-soft">Đọc thêm kinh nghiệm, tư vấn chuyên sâu về dịch vụ này.</p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/tin-tuc/${article.slug}`}
                    className="group overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    {article.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-40 w-full object-cover transition group-hover:scale-105"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="line-clamp-2 font-bold text-ink group-hover:text-brand-600">{article.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1.5 font-semibold text-brand-600">
                        Đọc bài <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
      <section className="mx-auto max-w-7xl px-6 py-12">
        {serviceImages[slug] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={serviceImages[slug]}
            alt={service.title}
            className="mb-8 h-56 w-full rounded-3xl object-cover shadow-lg shadow-brand-500/10 md:h-72"
          />
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {detail.highlights.map((h) => (
            <div key={h.title} className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
              <div className="font-black text-brand-600">{h.title}</div>
              <p className="mt-1 text-sm text-ink-soft">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-black text-ink">Nhận gửi những mặt hàng gì?</h2>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detail.items.map((it) => (
                <li key={it} className="flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3">
                  <Check className="h-5 w-5 shrink-0 text-brand-600" />
                  <span className="font-medium text-ink">{it}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-black text-ink">Câu hỏi thường gặp</h2>
            <div className="mt-5 space-y-3">
              {detail.faqs.map((f, i) => (
                <details key={i} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
                  <p className="mt-2 text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-3xl p-7 text-white shadow-xl shadow-brand-500/30" style={{ background: "linear-gradient(135deg,#1FB6A2,#0f7568)" }}>
              <ServiceMedia service={service} />
              <h3 className="mt-4 text-xl font-black">Báo giá {service.title.toLowerCase()}</h3>
              <p className="mt-2 text-white/80">Tư vấn miễn phí, báo giá chính xác trong 5 phút.</p>
              <a
                href={`tel:${site.phone}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-bold text-brand-700"
              >
                <Phone className="h-5 w-5" /> {site.phoneDisplay}
              </a>
              <Link
                href="/lien-he"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3.5 font-semibold text-white hover:bg-coral-600"
              >
                Gửi yêu cầu báo giá
              </Link>
            </div>
          </aside>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
              <BookOpen className="h-6 w-6" /> Bài viết liên quan
            </h2>
            <p className="mt-2 text-ink-soft">Đọc thêm kinh nghiệm, tư vấn chuyên sâu về tuyến này.</p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/tin-tuc/${article.slug}`}
                  className="group overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm transition hover:shadow-lg"
                >
                  {article.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.coverImage} alt={article.title} className="h-40 w-full object-cover transition group-hover:scale-105" />
                  )}
                  <div className="p-5">
                    <h3 className="line-clamp-2 font-bold text-ink group-hover:text-brand-600">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1.5 font-semibold text-brand-600">
                      Đọc bài <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14">
          <h2 className="text-2xl font-black text-ink">Hàng thực tế khách đã gửi</h2>
          <p className="mt-2 text-ink-soft">Hình ảnh thật tại kho Minh Thiện — minh bạch, đáng tin.</p>
          <div className="mt-5">
            <GalleryGrid items={gallery.slice(0, 4)} />
          </div>
          <div className="mt-4">
            <Link href="/thu-vien" className="inline-flex items-center gap-1.5 font-semibold text-brand-600">
              Xem thêm hàng đã gửi <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
              <BookOpen className="h-6 w-6" /> Bài viết liên quan
            </h2>
            <p className="mt-2 text-ink-soft">Đọc thêm kinh nghiệm, tư vấn chuyên sâu về dịch vụ này.</p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/tin-tuc/${article.slug}`}
                  className="group overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm transition hover:shadow-lg"
                >
                  {article.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-40 w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="line-clamp-2 font-bold text-ink group-hover:text-brand-600">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1.5 font-semibold text-brand-600">
                      Đọc bài <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14">
          <h2 className="text-2xl font-black text-ink">Dịch vụ khác</h2>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/dich-vu/${s.slug}`}
                className="group flex items-center justify-between rounded-3xl border border-brand-50 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <ServiceMedia service={s} size="sm" />
                  <span className="font-bold text-ink">{s.title}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-brand-600 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
