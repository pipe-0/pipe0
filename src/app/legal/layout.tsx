import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <article className="mx-auto max-w-4xl pt-24 pb-24">{children}</article>
      <Footer />
    </div>
  );
}
