import { site } from "./site";

const tel = (p: string) => `+84${p.replace(/\D/g, "").replace(/^0/, "")}`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const openingHours = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: DAYS, opens: "08:00", closes: "21:00" },
];

/**
 * Schema trang chủ — MỘT @graph duy nhất, chỉ in ở trang chủ (không còn nằm ở layout).
 * Các trang khác trỏ về thực thể này bằng @id (`${site.url}/#organization`), đừng khai lại.
 *
 * MST là mỏ neo duy nhất giúp Google/AI tách mình khỏi các công ty trùng tên
 * (Minh Thiên Logistics Đà Nẵng, CTCP Giao nhận Vận tải Minh Thiện Đồng Nai,
 * minhthienlogistics.net tuyến Việt–Thái). sameAs chỉ khai kênh chủ đã xác nhận —
 * khai nhầm là nối sang thực thể khác (Threads @hallo.chaune KHÔNG phải của mình).
 * Không khai địa chỉ ĐKKD (41 An Phú Đông 1), không khai đánh giá sao, không ghi giá.
 */
export function homepageGraphJsonLd() {
  const id = (frag: string) => `${site.url}/#${frag}`;
  const nhaTrang = site.branches[1];
  const sameAs = [site.facebook, site.instagram, site.zalo, site.taxRegistry].filter(Boolean);
  const providerRef = { "@id": id("organization") };
  const offer = (name: string, slug: string) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name, url: `${site.url}/dich-vu/${slug}`, provider: providerRef },
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Brand",
        "@id": id("brand"),
        name: site.name,
        alternateName: ["Minh Thien Logistics", "Minh Thiện Logs"],
        url: `${site.url}/`,
        logo: { "@id": id("logo") },
        sameAs: [site.facebook, site.instagram, site.zalo],
      },
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": id("organization"),
        name: site.name,
        legalName: "CÔNG TY TNHH MINH THIỆN STATION",
        alternateName: ["Minh Thien Logistics", "MINH THIEN STATION COMPANY LIMITED", "MINH THIEN STATION CO., LTD"],
        url: `${site.url}/`,
        description:
          "Minh Thiện Logistics là đơn vị vận chuyển và gửi hàng quốc tế tại Thành phố Hồ Chí Minh, nhận gửi hàng từ Việt Nam đi Mỹ, Úc, Canada, Châu Âu, Nhật Bản, Hàn Quốc và nhiều quốc gia; đồng thời cung cấp dịch vụ nhập hàng và mua hộ từ Trung Quốc, Thái Lan, Châu Âu và Mỹ.",
        taxID: site.taxId,
        identifier: { "@type": "PropertyValue", propertyID: "Mã số thuế", value: site.taxId },
        brand: { "@id": id("brand") },
        logo: {
          "@type": "ImageObject",
          "@id": id("logo"),
          url: `${site.url}/images/logo-full.png`,
          contentUrl: `${site.url}/images/logo-full.png`,
          caption: site.name,
        },
        image: {
          "@type": "ImageObject",
          "@id": id("organization-image"),
          url: `${site.url}/images/og-cover.jpg`,
          contentUrl: `${site.url}/images/og-cover.jpg`,
          width: 1200,
          height: 630,
          caption: `${site.name} - Gửi hàng quốc tế`,
        },
        telephone: tel(site.phone),
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.ward,
          addressRegion: "Thành phố Hồ Chí Minh",
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        hasMap: site.googleMaps,
        openingHoursSpecification: openingHours,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: tel(site.phone),
            email: site.email,
            url: `${site.url}/lien-he`,
            availableLanguage: ["Vietnamese"],
          },
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: tel(site.phone),
            email: site.email,
            url: site.zalo,
            availableLanguage: ["Vietnamese"],
          },
        ],
        sameAs,
        department: { "@id": id("nha-trang-branch") },
        subjectOf: [
          { "@type": "AboutPage", name: `Giới thiệu ${site.name}`, url: `${site.url}/gioi-thieu` },
          { "@type": "ContactPage", name: `Liên hệ ${site.name}`, url: `${site.url}/lien-he` },
        ],
        knowsAbout: [
          "Gửi hàng quốc tế",
          "Chuyển phát quốc tế",
          "Vận chuyển hàng từ Việt Nam đi Mỹ",
          "Vận chuyển hàng từ Việt Nam đi Úc",
          "Vận chuyển hàng từ Việt Nam đi Canada",
          "Vận chuyển hàng từ Việt Nam đi Châu Âu",
          "Vận chuyển hàng từ Việt Nam đi Nhật Bản",
          "Vận chuyển hàng từ Việt Nam đi Hàn Quốc",
          "Nhập hàng Trung Quốc",
          "Mua hộ hàng quốc tế",
          "Đóng gói hàng hóa quốc tế",
          "Khai báo hải quan",
          "Theo dõi vận đơn quốc tế",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          "@id": id("service-catalog"),
          name: `Dịch vụ vận chuyển quốc tế của ${site.name}`,
          itemListElement: [
            offer("Gửi hàng đi Mỹ", "gui-hang-di-my"),
            offer("Gửi hàng đi Úc", "gui-hang-di-uc"),
            offer("Gửi hàng đi Canada", "gui-hang-di-canada"),
            offer("Gửi hàng đi Châu Âu", "gui-hang-di-chau-au"),
            offer("Gửi hàng đi Nhật Bản", "gui-hang-di-nhat"),
            offer("Gửi hàng đi Hàn Quốc", "gui-hang-di-han"),
            offer("Nhập hàng và mua hộ quốc tế", "nhap-hang-mua-ho"),
          ],
        },
        mainEntityOfPage: { "@id": id("webpage") },
      },
      {
        "@type": "LocalBusiness",
        "@id": id("nha-trang-branch"),
        name: `${site.name} - ${nhaTrang.name}`,
        url: `${site.url}/gioi-thieu`,
        telephone: tel(nhaTrang.phones[0]),
        parentOrganization: { "@id": id("organization") },
        address: {
          "@type": "PostalAddress",
          streetAddress: "45 Nguyễn Xiển",
          addressLocality: "Phường Bắc Nha Trang",
          addressRegion: "Khánh Hòa",
          addressCountry: "VN",
        },
        openingHoursSpecification: openingHours,
      },
      {
        // Không có SearchAction: web chưa có ô tìm kiếm thật, khai ra là khai khống.
        "@type": "WebSite",
        "@id": id("website"),
        url: `${site.url}/`,
        name: site.name,
        alternateName: "Minh Thien Logistics",
        description:
          "Website chính thức của Minh Thiện Logistics, cung cấp dịch vụ gửi hàng quốc tế, nhập hàng, mua hộ và tra cứu vận đơn.",
        publisher: { "@id": id("organization") },
        about: { "@id": id("organization") },
        inLanguage: "vi-VN",
      },
      {
        "@type": "WebPage",
        "@id": id("webpage"),
        url: `${site.url}/`,
        name: "Minh Thiện Logistics - Gửi hàng đi Mỹ, Úc, Canada, Châu Âu từ TP.HCM",
        description:
          "Minh Thiện Logistics nhận gửi hàng từ Việt Nam đi Mỹ, Úc, Canada, Châu Âu, Nhật Bản, Hàn Quốc và hơn 200 quốc gia, hỗ trợ lấy hàng tận nơi tại TP.HCM, đóng gói và theo dõi vận đơn.",
        isPartOf: { "@id": id("website") },
        about: { "@id": id("organization") },
        mainEntity: { "@id": id("organization") },
        primaryImageOfPage: { "@id": id("organization-image") },
        inLanguage: "vi-VN",
      },
    ],
  };
}

/**
 * Trang /tra-cuu — công cụ tra cứu, KHÔNG dùng ParcelDelivery (trang chỉ là form,
 * không có dữ liệu một lô hàng cụ thể). Không nêu tên hãng vận chuyển nào.
 */
export function trackingPageJsonLd() {
  const url = `${site.url}/tra-cuu`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `Tra cứu đơn hàng | ${site.name}`,
        description: `Tra cứu hành trình vận đơn quốc tế của ${site.name} bằng mã đơn MT.`,
        inLanguage: "vi-VN",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#organization` },
        mainEntity: { "@id": `${url}#tracking-tool` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "WebApplication",
        "@id": `${url}#tracking-tool`,
        name: `Tra cứu vận đơn ${site.name}`,
        description:
          "Công cụ tra cứu trạng thái và hành trình đơn hàng gửi quốc tế. Khách nhập mã đơn Minh Thiện (ví dụ MT-0000276) và 2 số cuối số điện thoại người nhận để xem tình trạng đơn.",
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "vi-VN",
        provider: { "@id": `${site.url}/#organization` },
        potentialAction: {
          "@type": "TrackAction",
          name: "Tra cứu vận đơn",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}?code={tracking_code}`,
            actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"],
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Tra cứu đơn hàng", item: url },
        ],
      },
    ],
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
    provider: { "@id": `${site.url}/#organization` },
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
      // Nội dung FAQ/bài viết đi từ CMS. Escape "<" theo hướng dẫn Next.js để
      // chuỗi đó không thể kết thúc thẻ script khi dữ liệu được render ra HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
