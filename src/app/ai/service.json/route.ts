import { congTy, layDuKienAI } from "@/lib/ai-facts";

export const dynamic = "force-dynamic";

/** Dịch vụ cho máy đọc (chuẩn geo-checklist.dev: name + capabilities). */
export async function GET() {
  const { tuyen } = await layDuKienAI();
  const body = {
    name: "Gửi hàng quốc tế từ Việt Nam — Minh Thiện Logistics",
    provider: congTy(),
    capabilities: [
      ...tuyen.map((t) => ({ name: t.name, url: t.url, transit: t.transit, price: t.price, ...(t.pricePerKgVnd ? { pricePerKgVnd: t.pricePerKgVnd } : {}) })),
      { name: "Nhập hàng và mua hộ (Trung Quốc, Thái Lan, Âu – Mỹ)", url: "https://minhthienlogs.com/dich-vu/nhap-hang-mua-ho" },
      { name: "Tra cứu vận đơn bằng mã đơn MT", url: "https://minhthienlogs.com/tra-cuu" },
    ],
    areaServed: "Gửi từ Việt Nam (kho TP.HCM) đi hơn 200 quốc gia",
  };
  return Response.json(body, { headers: { "cache-control": "public, max-age=3600" } });
}
