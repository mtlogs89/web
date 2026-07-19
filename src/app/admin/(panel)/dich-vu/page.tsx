import { getServiceCardsForAdmin } from "@/lib/service-cards";
import { ServiceCardsForm } from "./service-cards-form";

export const dynamic = "force-dynamic";

export default async function AdminServiceCards() {
  const cards = await getServiceCardsForAdmin();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Thẻ Dịch vụ (trang chủ)</h1>
        <p className="mt-1 text-ink-muted">
          Sửa tên hiển thị, mô tả, thứ tự và ẩn/hiện các thẻ trong mục &quot;Gửi hàng đi khắp thế giới&quot;.
          Cờ và đường dẫn giữ cố định trong hệ thống.
        </p>
      </div>
      <ServiceCardsForm cards={cards} />
    </div>
  );
}
