import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingContact } from "@/components/site/floating-contact";
import { SiteAnalytics } from "@/components/site/site-analytics";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/*
        Cloudflare "Email Obfuscation" đổi mọi email trên trang thành link /cdn-cgi/l/email-protection
        → Googlebot quét link đó ra 404 (Search Console báo 13/11/2026). Cặp chú thích email_off
        bảo Cloudflare để nguyên email trong đoạn giữa. Email này vốn công khai.
      */}
      <span hidden dangerouslySetInnerHTML={{ __html: "<!--email_off-->" }} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <SiteAnalytics />
      <span hidden dangerouslySetInnerHTML={{ __html: "<!--/email_off-->" }} />
    </>
  );
}
