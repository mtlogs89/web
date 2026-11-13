import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { KienThucListing } from "@/components/site/kien-thuc-listing";
import { getCategories } from "@/lib/articles";
import { findCategoryBySlug } from "@/lib/kien-thuc";
import { kienThucMetadata } from "@/lib/kien-thuc-metadata";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ cat: string }>;
  searchParams: Promise<{ page?: string }>;
};

async function resolve(slug: string) {
  const names = (await getCategories()).map((c) => c.name);
  return findCategoryBySlug(slug, names);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ cat: slug }, { page }] = await Promise.all([params, searchParams]);
  const cat = await resolve(slug);
  return cat ? kienThucMetadata(cat, page) : { robots: { index: false } };
}

export default async function KienThucCategoryPage({ params, searchParams }: Props) {
  const [{ cat: slug }, { page }] = await Promise.all([params, searchParams]);
  const cat = await resolve(slug);
  // /kien-thuc/<gì đó> không phải chuyên mục = link bài của web CMS cũ (từng nằm dưới
  // /kien-thuc/...). Đẩy qua bộ dò bài cũ → 301 sang bài mới gần nghĩa nhất.
  if (!cat) permanentRedirect(`/api/chuyen-huong?p=${encodeURIComponent(`/kien-thuc/${slug}`)}`);
  return <KienThucListing cat={cat} pageParam={page} />;
}
