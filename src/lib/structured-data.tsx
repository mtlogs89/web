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
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo.png`,
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

/** Schema.org LocalBusiness — giúp Google/AI hiểu đây là doanh nghiệp địa phương (AEO/GEO). */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: `+84${site.phone.replace(/^0/, "")}`,
    image: `${site.url}/og.png`,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHours: "Mo-Su 08:00-21:00",
    areaServed: "Worldwide",
    foundingDate: String(site.foundingYear),
  };
}

/** Danh sách dịch vụ dạng Service schema. */
export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      "@type": "MovingCompany",
      name: site.name,
      telephone: `+84${site.phone.replace(/^0/, "")}`,
    },
    areaServed: "Worldwide",
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
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
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
