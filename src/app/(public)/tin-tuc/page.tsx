import { permanentRedirect } from "next/navigation";
import { KT_PATH, categoryHref } from "@/lib/kien-thuc";

export const dynamic = "force-dynamic";

/**
 * "Tin tức" đã đổi thành "Kiến thức" (/kien-thuc). Link cũ /tin-tuc và /tin-tuc?cat=… còn
 * nằm trên Google/Facebook/Zalo nên 301 sang trang mới tương ứng. URL từng bài
 * (/tin-tuc/<slug>) KHÔNG đổi.
 */
export default async function NewsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { cat, page } = await searchParams;
  const p = Math.max(1, Number(page) || 1);
  const base = cat ? categoryHref(cat) : KT_PATH;
  permanentRedirect(p > 1 ? `${base}?page=${p}` : base);
}
