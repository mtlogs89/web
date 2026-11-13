import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { POLICY_PAGES, POLICY_UPDATED, POLICY_UPDATED_ISO, getPolicy } from "@/lib/chinh-sach";
import { site } from "@/lib/site";

export function policyMetadata(slug: string): Metadata {
  const p = getPolicy(slug);
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `${site.url}/${p.slug}` },
  };
}

/** Khung chung cho 6 trang chính sách: tiêu đề, ngày cập nhật, nội dung, link sang các trang còn lại. */
export function PolicyView({ slug }: { slug: string }) {
  const p = getPolicy(slug);
  const url = `${site.url}/${p.slug}`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${url}#webpage`,
              url,
              name: p.title,
              description: p.description,
              inLanguage: "vi-VN",
              dateModified: POLICY_UPDATED_ISO,
              isPartOf: { "@id": `${site.url}/#website` },
              about: { "@id": `${site.url}/#organization` },
              publisher: { "@id": `${site.url}/#organization` },
            },
            breadcrumbJsonLd([
              { name: "Trang chủ", url: site.url },
              { name: p.title, url },
            ]),
          ],
        }}
      />
      <PageHero title={p.title} crumbs={[{ name: p.title, href: `/${p.slug}` }]} />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_280px]">
        <article>
          <p className="text-sm text-ink-muted">
            Cập nhật lần cuối: {POLICY_UPDATED} · {site.legalName} · MST {site.taxId}
          </p>
          <div className="prose-mt mt-4" dangerouslySetInnerHTML={{ __html: p.html }} />
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-brand-50 bg-brand-50/40 p-5">
            <div className="mb-3 font-bold text-ink">Chính sách & quy định</div>
            <ul className="space-y-1.5 text-[15px]">
              {POLICY_PAGES.map((x) => (
                <li key={x.slug}>
                  {x.slug === p.slug ? (
                    <span className="font-semibold text-brand-700">{x.title}</span>
                  ) : (
                    <Link href={`/${x.slug}`} className="text-ink-soft hover:text-brand-600">
                      {x.title}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link href="/hang-gui-duoc" className="text-ink-soft hover:text-brand-600">
                  Hàng gì gửi đi được?
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-sm text-ink-muted">
              Thắc mắc về chính sách: {site.phoneDisplay} · {site.email}
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
