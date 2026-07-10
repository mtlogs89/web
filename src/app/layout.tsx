import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { JsonLd, localBusinessJsonLd, websiteJsonLd, organizationJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Vận chuyển quốc tế hơn 200 quốc gia`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "gửi hàng đi Mỹ",
    "gửi hàng đi Úc",
    "vận chuyển quốc tế",
    "nhập hàng Trung Quốc",
    "Minh Thiện Logistics",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name} — Vận chuyển quốc tế hơn 200 quốc gia`,
    description: site.description,
    url: site.url,
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Vận chuyển quốc tế hơn 200 quốc gia`,
    description: site.description,
    images: ["/images/og-cover.jpg"],
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <JsonLd data={localBusinessJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
