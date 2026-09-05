import { destinations } from "@/lib/pricing";
import { getPriceOverrides } from "@/lib/price-tables";
import { PriceTableForm } from "./price-form";

export const dynamic = "force-dynamic";

export default async function BangGiaPage() {
  const overrides = await getPriceOverrides();

  // Chỉ tuyến dùng bảng theo mốc cân mới nạp được từ file.
  // Singapore tính theo khoảng cân, "Nước khác" luôn báo liên hệ — để nguyên.
  const uploadable = destinations
    .filter((d) => d.table.type === "steps" && d.key !== "khac")
    .map((d) => ({
      key: d.key,
      label: d.label,
      basePrices: d.table.type === "steps" ? d.table.prices : [],
      baseOver20: d.table.type === "steps" ? d.table.over20PerKg : null,
      override: overrides[d.key] ?? null,
    }));

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Bảng giá</h1>
        <p className="mt-1 text-ink-muted">
          Up file Excel là web cập nhật giá cho khách. File chỉ cần hai cột:{" "}
          <span className="font-semibold">số ký</span> và <span className="font-semibold">giá tiền</span>.
          Xem trước rồi mới lưu, chưa bấm lưu thì chưa có gì đổi.
        </p>
      </div>
      <PriceTableForm dests={uploadable} />
    </div>
  );
}
