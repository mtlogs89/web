import { site } from "./site";

/** WebSite schema — giúp Google/AI nhận diện website & tên thương hiệu. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "vi-VN",
    publisher: { "@type": "Organization", name: site.name },
  };
}

/** Organization schema — thực thể doanh nghiệp + liên kết mạng xã hội (E-E-A-T cho GEO). */
export function organizationJsonLd() {
  const sameAs = [site.facebook, site.zalo].filter((u) => u && u !== "#");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/images/logo-full.png`,
    telephone: `+84${site.phone.replace(/^0/, "")}`,
    foundingDate: String(site.foundingYear),
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+84${site.phone.replace(/^0/, "")}`,
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: ["Vietnamese"],
    },
  };
}

/**
 * Schema.org LocalBusiness — trụ sở + từng chi nhánh (AEO/GEO: "gửi hàng quốc tế ở Nha Trang").
 * Không ghi toạ độ: số cũ là tâm TP.HCM chứ không phải địa chỉ thật — sai còn tệ hơn thiếu.
 */
export function localBusinessJsonLd() {
  const tel = (p: string) => `+84${p.replace(/\D/g, "").replace(/^0/, "")}`;
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${site.url}/#business`,
    parentOrganization: { "@id": `${site.url}/#organization` },
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: tel(site.phone),
    email: site.email,
    image: `${site.url}/images/og-cover.jpg`,
    logo: `${site.url}/images/logo-full.png`,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    openingHours: "Mo-Su 08:00-21:00",
    areaServed: "Worldwide",
    foundingDate: String(site.foundingYear),
    department: site.branches.slice(1).map((b) => ({
      "@type": "MovingCompany",
      name: `${site.name} – ${b.name}`,
      address: { "@type": "PostalAddress", streetAddress: b.address, addressCountry: "VN" },
      ...(b.phones[0] ? { telephone: tel(b.phones[0]) } : {}),
      openingHours: "Mo-Su 08:00-21:00",
    })),
  };
}

/** Danh sách dịch vụ dạng Service schema. */
export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  /** Nước/khu vực nhận hàng, vd { "@type": "Country", name: "United States" }. */
  areaServed?: object;
  /** Khoảng giá (VNĐ) đúng bảng mà công cụ tính cước trên trang đang dùng. */
  price?: { low: number; high: number; note: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: input.url,
    provider: { "@id": `${site.url}/#business` },
    areaServed: input.areaServed ?? "Worldwide",
    ...(input.price
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "VND",
            lowPrice: input.price.low,
            highPrice: input.price.high,
            description: input.price.note,
            url: input.url,
          },
        }
      : {}),
  };
}

/** FAQPage — cực quan trọng cho AEO (ô trả lời nhanh) và GEO (AI trích dẫn). */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Article schema cho từng bài blog (GEO: thể hiện tác giả, ngày, nguồn rõ ràng). */
export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  section?: string;
  keywords?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    mainEntityOfPage: input.url,
    inLanguage: "vi-VN",
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.keywords ? { keywords: input.keywords } : {}),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/images/logo-full.png` },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Render component cho JSON-LD. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
