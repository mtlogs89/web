import { services, site } from "./site";
import { ROUTE_TRANSIT, SERVICE_ROUTE } from "./transit";
import { getDestinations } from "./price-tables";
import { SERVICE_ANSWER, buildServiceAnswer, dong } from "./service-answer";

/**
 * Dữ kiện chung cho /ai/summary.json, /ai/service.json, /ai/faq.json.
 * CHỈ là dữ kiện (công ty là ai, tuyến nào, mấy ngày, giá đã công bố) — không có câu
 * nào ra lệnh cho AI (chủ chốt sau audit 21/11/2026: lệnh cho AI bị coi là thao túng).
 * Số nào cũng lấy từ nguồn chung (site.ts, transit.ts, pricing.ts), không gõ tay.
 */
export async function layDuKienAI() {
  const dests = await getDestinations();
  const tuyen = services
    .filter((s) => s.group === "gui-hang")
    .map((s) => {
      const route = SERVICE_ROUTE[s.slug];
      const cfg = SERVICE_ANSWER[s.slug];
      const ans = cfg ? buildServiceAnswer(cfg, dests.find((d) => d.key === cfg.destKey), route ?? "") : null;
      return {
        name: s.title,
        url: `${site.url}/dich-vu/${s.slug}`,
        transit: route ? ROUTE_TRANSIT[route]?.text ?? null : null,
        price: ans ? ans.note.replace(/ Thời gian:.*$/, "") : "Tính bằng công cụ tính cước trên trang dịch vụ hoặc gọi hotline.",
        ...(ans ? { pricePerKgVnd: ans.perKg } : {}),
      };
    });
  return { tuyen, dests };
}

export const congTy = () => ({
  name: site.name,
  legalName: "Công ty TNHH Minh Thiện Station",
  taxId: site.taxId,
  url: site.url,
  telephone: site.phoneDisplay,
  zalo: site.zalo,
  email: site.email,
  address: site.addressFull,
  openingHours: "Thứ Hai – Chủ Nhật 8:00 – 17:30",
  pickup: "Lấy hàng tận nơi miễn phí trong nội thành TP.HCM, Hà Nội, Đà Nẵng, Huế, Nha Trang, Cần Thơ; đóng gói, thùng, hút chân không miễn phí.",
});

export { dong };
