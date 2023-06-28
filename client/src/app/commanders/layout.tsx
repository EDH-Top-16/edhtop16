/**
 * @fileoverview commanders/page.tsx - commander view page
 */
import Navigation from "@/components/nav";
import Banner from "@/components/banner/banner";

export default function CommandersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <Banner />
      <main>{children}</main>
    </>
  );
}
