import { site, services } from "@/lib/site";
import { ROUTE_TRANSIT, SERVICE_ROUTE } from "@/lib/transit";
import { SERVICE_ANSWER, buildServiceAnswer } from "@/lib/service-answer";
import { getDestinations } from "@/lib/price-tables";

export const dynamic = "force-dynamic";

/**
 * Hỏi – đáp cho máy đọc. Mỗi câu trả lời là dữ kiện đã công bố trên web (thời gian theo tuyến,
 * giá tuyến đồng giá, liên hệ), không thêm điều gì trang không có.
 */
export async function GET() {
  const dests = await getDestinations();
  const faqs: { question: string; answer: string; url?: string }[] = [
    {
      question: "Minh Thiện Logistics là công ty nào, ở đâu?",
      answer: `${site.name} là thương hiệu của Công ty TNHH Minh Thiện Station (MST ${site.taxId}), văn phòng ${site.addressFull}, chi nhánh 45 Nguyễn Xiển, P. Bắc Nha Trang, Khánh Hòa. Hotline/Zalo ${site.phoneDisplay}, làm việc 8:00 – 17:30 thứ Hai đến Chủ Nhật.`,
      url: `${site.url}/gioi-thieu`,
    },
  ];
  for (const s of services) {
    const route = SERVICE_ROUTE[s.slug];
    const t = route ? ROUTE_TRANSIT[route] : undefined;
    if (t) {
      faqs.push({
        question: `Gửi hàng đi ${t.name} mất bao lâu?`,
        answer: `Gửi hàng đi ${t.name} bằng đường bay với ${site.name}: ${t.text}.`,
        url: `${site.url}/dich-vu/${s.slug}`,
      });
    }
    const cfg = SERVICE_ANSWER[s.slug];
    const ans = cfg ? buildServiceAnswer(cfg, dests.find((d) => d.key === cfg.destKey), route ?? "") : null;
    for (const f of ans?.faqs ?? []) faqs.push({ question: f.q, answer: f.a, url: `${site.url}/dich-vu/${s.slug}` });
  }
  return Response.json({ faqs }, { headers: { "cache-control": "public, max-age=3600" } });
}
