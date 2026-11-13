import { PolicyView, policyMetadata } from "@/components/site/policy-page";

const SLUG = "quy-dinh-dong-goi";
export const metadata = policyMetadata(SLUG);

export default function Page() {
  return <PolicyView slug={SLUG} />;
}
