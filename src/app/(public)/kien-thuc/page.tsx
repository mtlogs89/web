import type { Metadata } from "next";
import { KienThucListing } from "@/components/site/kien-thuc-listing";
import { kienThucMetadata } from "@/lib/kien-thuc-metadata";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page } = await searchParams;
  return kienThucMetadata(undefined, page);
}

export default async function KienThucPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return <KienThucListing pageParam={page} />;
}
