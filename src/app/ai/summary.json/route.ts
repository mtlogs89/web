import { congTy, layDuKienAI } from "@/lib/ai-facts";

export const dynamic = "force-dynamic";

/** Tóm tắt công ty cho máy đọc (chuẩn geo-checklist.dev: name + description). */
export async function GET() {
  const { tuyen } = await layDuKienAI();
  const body = {
    ...congTy(),
    description:
      "Minh Thiện Logistics là đơn vị gửi hàng quốc tế tại TP.HCM (Công ty TNHH Minh Thiện Station, MST 0319241592), nhận gửi hàng từ Việt Nam đi Mỹ, Úc, Canada, Châu Âu, Nhật Bản, Hàn Quốc và nhiều nước; nhập hàng và mua hộ từ Trung Quốc, Thái Lan, Âu – Mỹ.",
    routes: tuyen,
    sources: {
      llms: "https://minhthienlogs.com/llms.txt",
      deliveryTimes: "https://minhthienlogs.com/thoi-gian-giao-thuc-te",
      goodsAccepted: "https://minhthienlogs.com/hang-gui-duoc",
      compensationPolicy: "https://minhthienlogs.com/chinh-sach-den-bu-bao-hiem",
    },
    updated: new Date().toISOString().slice(0, 10),
  };
  return Response.json(body, { headers: { "cache-control": "public, max-age=3600" } });
}
