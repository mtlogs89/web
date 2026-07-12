import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { getGalleryItems } from "@/lib/gallery";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thư viện hàng thật khách đã gửi",
  description: `Hình ảnh thực tế các kiện hàng khách đã gửi đi quốc tế qua ${site.name}: thực phẩm, đặc sản, quà tặng, hàng kinh doanh được đóng gói chuẩn.`,
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <>
      <PageHero
        title="Hàng thật khách đã gửi"
        subtitle="Hình ảnh thực tế các kiện hàng được Minh Thiện đóng gói và gửi đi quốc tế mỗi ngày — minh bạch và đáng tin."
        crumbs={[{ name: "Thư viện", href: "/thu-vien" }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <GalleryGrid items={items} />
      </section>
    </>
  );
}
