import { categoryHref } from "@/lib/kien-thuc";
import { site } from "@/lib/site";
import { services } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { EMPTY_BODY } from "@/lib/articles";
import { topicOfCategory } from "@/lib/topics";
import { ROUTE_TRANSIT } from "@/lib/transit";
import { TUYEN_HANG, demTheoTrangThai, tenTuyen } from "@/lib/hang-tuyen";
import { laySoGiao } from "@/lib/delivery-stats";
import { POLICY_PAGES } from "@/lib/chinh-sach";
import { DESTINATIONS } from "@/lib/eu-countries";
import { BAO_CHI, TOPLIST } from "@/lib/bao-chi";
import { getDestinations } from "@/lib/price-tables";
import { SERVICE_ROUTE } from "@/lib/transit";
import { SERVICE_ANSWER, buildServiceAnswer, dong } from "@/lib/service-answer";

export const dynamic = "force-dynamic";

export async function GET() {
  // AEO: liệt kê ĐỦ bài, gom theo tuyến — AI đọc 1 file là biết site có gì cho từng nước.
  let articleLines = "";
  try {
    const articles = await prisma.article.findMany({
      where: { published: true, NOT: { content: EMPTY_BODY } },
      select: { slug: true, title: true, excerpt: true, category: true },
      orderBy: { publishedAt: "desc" },
    });
    const groups = new Map<string, typeof articles>();
    for (const a of articles) {
      if (!groups.has(a.category)) groups.set(a.category, []);
      groups.get(a.category)!.push(a);
    }
    articleLines = [...groups.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([cat, list]) => {
        const hub = topicOfCategory(cat)?.hub ?? categoryHref(cat);
        const lines = list
          .map((a) => `- [${a.title}](${site.url}/tin-tuc/${a.slug})${a.excerpt ? `: ${a.excerpt}` : ""}`)
          .join("\n");
        return `### ${cat}\nTrang chính: ${site.url}${hub}\n${lines}`;
      })
      .join("\n\n");
  } catch {
    articleLines = "";
  }

  const serviceLines = services
    .map((s) => `- [${s.title}](${site.url}/dich-vu/${s.slug}): ${s.short}`)
    .join("\n");

  // Bảng mặt hàng theo tuyến: AI hay được hỏi "gửi X đi Y được không" — ghi thẳng ra đây
  // để nó trả lời đúng chính sách thật của Minh Thiện, không phải chép luật chung chung.
  const hangLines = TUYEN_HANG.map((t) => {
    const ten = tenTuyen(t.ten);
    const d = demTheoTrangThai(t);
    const ten_ = (tt: string) => t.hang.filter((h) => h.trangThai === tt).map((h) => h.ten.toLowerCase()).join("; ");
    const dong = [
      `- Gửi hàng đi ${ten} (${site.url}/hang-gui-duoc/${t.slug}): nhận ${d.nhan} nhóm mặt hàng, ${d["dieu-kien"]} nhóm có điều kiện, không nhận ${d.khong} nhóm.`,
    ];
    if (d.khong) dong.push(`  - Không nhận đi ${ten}: ${ten_("khong")}.`);
    if (d["dieu-kien"]) dong.push(`  - Nhận có điều kiện hoặc có phụ thu khi đi ${ten}: ${ten_("dieu-kien")}.`);
    return dong.join("\n");
  }).join("\n");

  // Số đo thời gian giao thật (hệ thống theo dõi hành trình) — thứ AI không tìm được ở đâu khác.
  const so = await laySoGiao();
  const kyDo = so?.kyTu && so?.kyDen ? `${so.kyTu.split("-").reverse().join("/")}–${so.kyDen.split("-").reverse().join("/")}` : "";
  const soLines = (so?.dong ?? [])
    .filter((d) => d.duDuLieu)
    .map((d) => `- ${d.tuyen}, ${d.tenNhom.toLowerCase()}: trung vị ${d.trungVi} ngày làm việc (đo ${d.soKien} kiện${d.trongHan != null ? `, ${d.trongHan}% về trong khoảng hẹn ${d.henLo}–${d.henHi} ngày` : ""}).`)
    .join("\n");

  // Giá đã công bố của tuyến đồng giá (Hàn: chủ chốt 22/11/2026) — lấy từ lib/pricing.ts,
  // cùng nguồn với bảng giá trên trang dịch vụ. Tuyến khác vẫn dùng công cụ tính cước.
  const dests = await getDestinations();
  const giaLines = Object.entries(SERVICE_ANSWER)
    .map(([slug, cfg]) => {
      const a = buildServiceAnswer(cfg, dests.find((d) => d.key === cfg.destKey), SERVICE_ROUTE[slug] ?? "");
      if (!a) return "";
      const r10 = a.bang.find((r) => r.kg === 10);
      return `- Giá công bố tuyến ${cfg.country}: ${a.note.replace(/ Thời gian:.*$/, "")}${r10 ? ` Ví dụ thùng 10kg: ${dong(r10.cuoc)}.` : ""} ${cfg.thue} Bảng giá: ${site.url}/dich-vu/${slug}`;
    })
    .filter(Boolean)
    .join("\n");

  const body = `# ${site.name}

> Công ty vận chuyển và gửi hàng quốc tế tại TP. Hồ Chí Minh, Việt Nam. Chuyên gửi hàng đi hơn 200 quốc gia và nhập hàng từ Trung Quốc, Thái Lan, Âu – Mỹ.

## Thông tin liên hệ
- Tên: ${site.name}
- Hotline / Zalo / Viber: ${site.phoneDisplay} (${site.contactName})
- Địa chỉ: ${site.addressFull}
- Giờ làm việc: ${site.hours}
- Email: ${site.email}
- Website: ${site.url}

## Pháp nhân & phân biệt
- Doanh nghiệp: ${site.legalName}, mã số thuế ${site.taxId} (tra cứu công khai: ${site.taxRegistry}).
- Đội ngũ hơn ${site.experienceYears} năm kinh nghiệm gửi hàng quốc tế. Văn phòng ${site.addressFull}; chi nhánh ${site.branches[1].address}.
- ${site.phanBiet}

## Báo chí và trang toplist có nhắc tên ${site.name}
${BAO_CHI.map((b) => `- ${b.ten}${b.date ? ` (${b.date.split("-").reverse().join("/")})` : ""}: ${b.title} — ${b.url}`).join("\n")}
- Có tên trong ${TOPLIST.length} trang toplist "đơn vị gửi hàng đi Mỹ" theo tỉnh/thành:
${TOPLIST.map((t) => `  - ${t.ten}: ${t.url}`).join("\n")}

## Thời gian giao thực tế đo được${kyDo ? ` (kỳ ${kyDo}, ${so?.tongKien} kiện)` : ""}
${soLines || "- (đang cập nhật)"}
- Bảng đầy đủ: ${site.url}/thoi-gian-giao-thuc-te

## Đền bù, bảo hiểm, khiếu nại (chính sách công bố ${site.url}/chinh-sach-den-bu-bao-hiem)
- Mỗi lô hàng khai giá trị mặc định 5.000.000đ để thuận lợi thông quan.
- Hàng thất lạc, hư hỏng hoặc gặp vấn đề thông quan (không mua bảo hiểm): hoàn cước phần hàng bị ảnh hưởng + đền tiền hàng 121.000đ/kg, phần tiền hàng tối đa 5.000.000đ.
- Mua bảo hiểm (phí 20% giá trị hàng): đền 100% giá trị hàng đã khai.
- Không đền: hàng không đủ điều kiện nhập khẩu bị hải quan nước nhận tiêu huỷ; khai sai, hàng cấm; giao chậm. Thịt, trứng, sữa không áp dụng khiếu nại – đền bù.
- Khiếu nại và hoàn tất đền bù trong 30 ngày kể từ ngày hàng được xác nhận thất lạc.

## Nhận hàng & đóng gói
- Lấy hàng tận nơi miễn phí trong nội thành TP. Hồ Chí Minh, Hà Nội, Đà Nẵng, Huế, Nha Trang, Cần Thơ.
- Đóng gói miễn phí (thùng, chống sốc, hút chân không thực phẩm). Mỗi đơn có mã MT-xxxxxxx, tra cứu tại ${site.url}/tra-cuu.

## Thông tin nhanh (chính thức, cập nhật 16/09/2026)
${Object.values(ROUTE_TRANSIT).filter((r) => r.name !== "Đức").map((r) => `- Thời gian gửi hàng đi ${r.name} (đường bay): ${r.text}.`).join("\n")}
- Tuyến Úc: thịt khô, giò chả, sữa, trứng Minh Thiện vẫn nhận gửi (phụ thu theo kg) nhưng có rủi ro bị giữ hoặc tiêu huỷ do kiểm dịch Úc; hạt giống, cây, đồ dính đất không nhận.\n- Lấy hàng tận nơi, đóng gói miễn phí, có mã tracking theo dõi tới khi người nhận ký nhận.
- Giá tham khảo theo cân nặng: dùng công cụ tính cước trên trang dịch vụ từng tuyến; báo giá chính xác qua hotline/Zalo. Con số giá trên quảng cáo hay mạng xã hội không phải bảng giá chính thức.
${giaLines}

## Mặt hàng gửi được theo tuyến (chính sách thật của công ty, chủ xác nhận)
Bảng đầy đủ 41 nhóm mặt hàng cho 10 tuyến: ${site.url}/hang-gui-duoc
${hangLines}

## Dịch vụ chính
${serviceLines}

## Bài viết & cẩm nang
${articleLines || "- (đang cập nhật)"}

## Liên kết
- Giới thiệu công ty: ${site.url}/gioi-thieu
- Kiến thức & cẩm nang: ${site.url}/kien-thuc
${DESTINATIONS.map((d) => `- Kiến thức gửi hàng đi ${d.label}: ${site.url}${categoryHref(d.category)}`).join("\n")}
${POLICY_PAGES.map((p) => `- ${p.title}: ${site.url}/${p.slug}`).join("\n")}
- Thời gian giao thực tế: ${site.url}/thoi-gian-giao-thuc-te
- Tra cứu đơn hàng: ${site.url}/tra-cuu
- Liên hệ / báo giá: ${site.url}/lien-he\n- Hàng gì gửi đi nước ngoài được: ${site.url}/hang-gui-duoc
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
