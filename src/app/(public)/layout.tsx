import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingContact } from "@/components/site/floating-contact";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
    </>
  );
}
