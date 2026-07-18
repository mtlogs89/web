import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { OrderTracker } from "@/components/site/order-tracker";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description:
    "Tra cứu hành trình đơn hàng vận chuyển quốc tế tại Minh Thiện Logistics bằng mã đơn và 2 số cuối số điện thoại người nhận.",
};

export const dynamic = "force-dynamic";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <>
      <PageHero
        title="Tra cứu đơn hàng"
        subtitle="Nhập mã đơn Minh Thiện gửi bạn và 2 số cuối số điện thoại người nhận để xem hành trình đơn hàng."
        crumbs={[{ name: "Tra cứu đơn", href: "/tra-cuu" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <OrderTracker initialCode={code || ""} />
      </section>
    </>
  );
}
