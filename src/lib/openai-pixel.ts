/**
 * ChatGPT Ads Measurement Pixel (OpenAI).
 *
 * Pixel ID từ Ads Manager. `debug` bật khi dev, hoặc khi build với
 * NEXT_PUBLIC_OAIQ_DEBUG=true. Production mặc định tắt. Biến này được
 * nhúng lúc build — đổi thì phải build lại.
 *
 * Tài liệu: https://developers.openai.com/ads/measurement-pixel
 * Sự kiện chuẩn: https://developers.openai.com/ads/supported-events
 *
 * Web này không có bước khách tự tạo đơn. /tra-cuu chỉ tra cứu mã có sẵn
 * (API app.minhthienlogs.com). /admin/don-hang là nhân viên nhập. Đơn thật
 * nằm ở app đặt đơn riêng — dùng trackOrderCreated bên dưới khi tới lúc,
 * trên trình duyệt khách. Conversions API (gửi từ server) là giai đoạn sau:
 * khi làm, gửi cùng event_id (Pixel gọi là event_id, CAPI gọi là id).
 */

export const OAIQ_PIXEL_ID = "F6z34umc3NWwSa3o9i8BCn";

/** true khi dev, hoặc khi build với NEXT_PUBLIC_OAIQ_DEBUG=true. */
function oaiqDebug(): boolean {
  return (
    process.env.NEXT_PUBLIC_OAIQ_DEBUG === "true" ||
    (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_OAIQ_DEBUG !== "false")
  );
}

export type ContactClickEvent = "zalo_click" | "whatsapp_click" | "phone_click";

type Oaiq = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    oaiq?: Oaiq;
  }
}

function callOaiq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const oaiq = window.oaiq;
  if (typeof oaiq !== "function") return;
  oaiq(...args);
}

/**
 * lead_created — khách gửi form báo giá và server trả ok.
 * Không gọi khi chỉ bấm nút "Báo giá ngay" / "Gửi yêu cầu báo giá" (đó là link sang /lien-he).
 * Không gửi số điện thoại. Pixel tự băm dữ liệu khách nếu bật advanced matching.
 */
export function trackLeadCreated() {
  callOaiq("measure", "lead_created", { type: "customer_action" });
}

export type OrderContent = {
  id?: string;
  name?: string;
  content_type?: string;
  quantity?: number;
  amount?: number;
  currency?: string;
};

export type OrderCreatedInput = {
  /**
   * Giá trị cả đơn, số nguyên theo đơn vị nhỏ ISO 4217.
   * VND không có số lẻ: amount là số đồng (100000 = 100.000đ).
   */
  amount?: number;
  /** Bắt buộc nếu có amount. Mặc định VND. */
  currency?: string;
  /**
   * Id ổn định của đơn. Giữ nguyên khi gửi lại từ Conversions API
   * để OpenAI đếm một lần. Mỗi đơn một id mới.
   */
  eventId?: string;
  contents?: OrderContent[];
};

/**
 * order_created — helper cho app đặt đơn riêng, chưa gọi ở web này.
 *
 * Gọi trên trình duyệt của khách, sau khi tạo đơn thành công và sau khi
 * trang đó đã nhúng cùng pixel (cùng snippet init, cùng pixelId). Ví dụ:
 *
 *   trackOrderCreated({
 *     amount: 1500000,
 *     currency: "VND",
 *     eventId: "order_MT123456",
 *     contents: [{ id: "MT123456", name: "Gửi hàng đi Mỹ", content_type: "shipment", quantity: 1 }],
 *   });
 *
 * Tương đương:
 *
 *   oaiq("measure", "order_created", {
 *     type: "contents",
 *     amount: 1500000,
 *     currency: "VND",
 *     contents: [{ id: "MT123456", name: "Gửi hàng đi Mỹ", content_type: "shipment", quantity: 1 }],
 *   }, { event_id: "order_MT123456" });
 *
 * Không gọi từ /admin/don-hang và không gọi từ /tra-cuu.
 * Conversions API là giai đoạn sau — chưa có khóa, chưa gửi từ server.
 */
export function trackOrderCreated(input: OrderCreatedInput = {}) {
  const data: {
    type: "contents";
    amount?: number;
    currency?: string;
    contents?: OrderContent[];
  } = { type: "contents" };
  if (input.amount != null) {
    data.amount = input.amount;
    data.currency = input.currency ?? "VND";
  }
  if (input.contents?.length) data.contents = input.contents;
  if (input.eventId) {
    callOaiq("measure", "order_created", data, { event_id: input.eventId });
    return;
  }
  callOaiq("measure", "order_created", data);
}

/**
 * Phân loại cú bấm liên hệ. Cùng luật với listener trong snippet <head>
 * (hàm mtOaiqContact) — sửa một chỗ thì sửa chỗ kia.
 *
 * - phone_click: <a href="tel:..."> hoặc <button data-phone> (bản máy tính
 *   của CallAction: cố ý không dùng tel: để Google Ads khỏi đếm nhầm).
 * - zalo_click: link zalo.me / zalo://
 * - whatsapp_click: wa.me, *.whatsapp.com, whatsapp://
 *
 * Trang /admin không gửi (nhân viên bấm số khách).
 */
export function classifyContactClick(target: EventTarget | null): ContactClickEvent | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest("a,button");
  if (!el) return null;
  if (el instanceof HTMLButtonElement && el.hasAttribute("data-phone")) return "phone_click";
  const anchor = el instanceof HTMLAnchorElement ? el : el.closest("a");
  if (!anchor) return null;
  const href = anchor.getAttribute("href") || "";
  if (/^tel:/i.test(href.trim())) return "phone_click";
  if (/^whatsapp:/i.test(href.trim())) return "whatsapp_click";
  if (/^zalo:/i.test(href.trim())) return "zalo_click";
  let url: URL;
  try {
    url = new URL(href, "https://minhthienlogs.com");
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (host === "zalo.me" || host.endsWith(".zalo.me")) return "zalo_click";
  if (host === "wa.me" || host === "whatsapp.com" || host.endsWith(".whatsapp.com")) return "whatsapp_click";
  return null;
}

/**
 * Snippet cài pixel, chạy một lần trong <head> của root layout.
 * Listener bắt click trước cả khi React hydrate — link Zalo/tel hoạt động
 * ngay từ HTML, không chờ onClick của React.
 */
export function openaiPixelInstallScript(): string {
  const debug = oaiqDebug() ? "true" : "false";
  return `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
oaiq("init",{pixelId:"${OAIQ_PIXEL_ID}",debug:${debug}});
if(!window.__mtOaiqClicks){
  window.__mtOaiqClicks=1;
  document.addEventListener("click",function(e){
    try{
      var path=location.pathname||"";
      if(path==="/admin"||path.indexOf("/admin/")===0)return;
      var node=e.target&&e.target.closest?e.target.closest("a,button"):null;
      if(!node)return;
      var name=null;
      if(node.tagName==="BUTTON"&&node.hasAttribute("data-phone"))name="phone_click";
      else{
        var a=node.tagName==="A"?node:(node.closest?node.closest("a"):null);
        if(!a)return;
        var href=(a.getAttribute("href")||"").trim();
        if(/^tel:/i.test(href))name="phone_click";
        else if(/^whatsapp:/i.test(href))name="whatsapp_click";
        else if(/^zalo:/i.test(href))name="zalo_click";
        else{
          var url;
          try{url=new URL(href,location.origin);}catch(err){return;}
          var host=url.hostname.toLowerCase();
          if(host==="zalo.me"||host.endsWith(".zalo.me"))name="zalo_click";
          else if(host==="wa.me"||host==="whatsapp.com"||host.endsWith(".whatsapp.com"))name="whatsapp_click";
        }
      }
      if(!name)return;
      oaiq("measure","custom",{type:"custom"},{custom_event_name:name});
    }catch(err){}
  },true);
}
`;
}
