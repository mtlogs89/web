// Gửi tin Telegram cho chủ khi có lead mới. Chỉ gọi sendMessage — không polling,
// không đụng tới webhook/bot xử lý "Quản lý chi tiêu" bên app logistics.
const ADMIN_LEAD_URL = "https://minhthienlogs.com/admin/lead";

export async function notifyNewLead(lead: {
  name: string;
  phone: string;
  route?: string | null;
  weight?: string | null;
  cargoType?: string | null;
  message?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[telegram] chưa cấu hình TELEGRAM_BOT_TOKEN / TELEGRAM_LEAD_CHAT_ID — bỏ qua báo lead");
    return;
  }

  const gio = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const lines = [
    "📩 Yêu cầu báo giá mới",
    `👤 ${lead.name}`,
    `📞 ${lead.phone}`,
    lead.route && `🚚 Tuyến: ${lead.route}`,
    lead.weight && `⚖️ Cân nặng: ${lead.weight}`,
    lead.cargoType && `📦 Loại hàng: ${lead.cargoType}`,
    lead.message && `💬 ${lead.message}`,
    `🕒 ${gio}`,
    `👉 ${ADMIN_LEAD_URL}`,
  ].filter(Boolean);

  // Thử tối đa 2 lần: ngay sau khi PM2 restart, lần fetch đầu hay chết vì DNS chưa sẵn sàng.
  for (let lan = 1; lan <= 2; lan++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          disable_web_page_preview: true,
        }),
        // Khách không phải chờ Telegram: quá 8s thì bỏ, lead đã lưu DB rồi.
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return;
      console.error(`[telegram] notifyNewLead lỗi ${res.status} (lần ${lan}): ${(await res.text()).slice(0, 300)}`);
    } catch (e) {
      const err = e as Error & { cause?: { code?: string } };
      console.error(`[telegram] notifyNewLead exception (lần ${lan}):`, err.cause?.code || err.message);
    }
    if (lan === 1) await new Promise((r) => setTimeout(r, 1500));
  }
  console.error("[telegram] KHÔNG gửi được báo lead sau 2 lần — kiểm tra /admin/lead thủ công");
}
