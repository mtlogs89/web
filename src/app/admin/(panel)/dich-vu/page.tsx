import { getSystemCardsForAdmin, getCustomCards } from "@/lib/service-cards";
import { destinations } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { ServiceCardsForm } from "./service-cards-form";
import { CustomCardsForm } from "./custom-cards-form";

export const dynamic = "force-dynamic";

export default async function AdminServiceCards() {
  const [systemCards, customCards, articles] = await Promise.all([
    getSystemCardsForAdmin(),
    getCustomCards(),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }),
  ]);

  const dests = destinations.map((d) => ({ key: d.key, label: d.label }));

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-black text-ink">Thẻ nước tự thêm</h1>
          <p className="mt-1 text-ink-muted">
            Thêm thẻ nước mới (VD Đài Loan, Thái Lan…). Mỗi thẻ tự có một trang chi tiết
            (nhúng bài + công cụ tính cước). Bấm &quot;Lưu&quot; là hiện trên trang chủ.
          </p>
        </div>
        <CustomCardsForm cards={customCards} articles={articles} dests={dests} />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-black text-ink">Thẻ có sẵn (hệ thống)</h2>
          <p className="mt-1 text-ink-muted">
            Sửa tên, mô tả, thứ tự, ẩn/hiện 6 nước gốc + Nhập hàng. Cờ và đường dẫn giữ cố định.
          </p>
        </div>
        <ServiceCardsForm cards={systemCards} />
      </div>
    </div>
  );
}
