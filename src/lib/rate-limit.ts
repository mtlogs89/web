import "server-only";

/**
 * Giới hạn tần suất trong bộ nhớ cho các route công khai (khách chưa đăng nhập).
 * Web chạy một tiến trình trên VPS nên bộ đếm trong RAM là đủ; khởi động lại thì
 * bộ đếm về 0, chấp nhận được.
 */
const buckets = new Map<string, number[]>();

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** true = được phép; false = vượt quá `limit` lượt trong `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);

  // Dọn khoá cũ để Map không phình mãi khi bị quét nhiều IP.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}
