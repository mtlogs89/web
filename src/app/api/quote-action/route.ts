import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ACTIONS = new Set(["zalo", "call"]);

/**
 * Ghi lại cú bấm Zalo / Gọi ngay sau khi khách xem giá. Lượt "để lại SĐT" ghi
 * luôn trong server action submitQuoteLead nên không đi qua đây.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const action = String(body.action ?? "");
  if (!ACTIONS.has(action)) {
    return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
  }

  const weight = Number(body.weight);
  try {
    await prisma.quoteAction.create({
      data: {
        action,
        sessionId: body.sessionId ? String(body.sessionId).slice(0, 40) : null,
        dest: body.dest ? String(body.dest).slice(0, 40) : null,
        weight: Number.isFinite(weight) && weight > 0 && weight <= 10000 ? weight : null,
        page: String(body.page ?? "").slice(0, 200),
      },
    });
  } catch (e) {
    // Mất thống kê thì thôi, không được cản khách mở Zalo hay gọi điện.
    console.error("quote-action failed:", e);
  }

  return NextResponse.json({ ok: true });
}
