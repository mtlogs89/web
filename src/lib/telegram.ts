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
    if (!res.ok) {
      console.error(`[telegram] notifyNewLead lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
  } catch (e) {
    console.error("[telegram] notifyNewLead exception:", (e as Error).message);
  }
}
