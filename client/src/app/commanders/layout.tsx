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
      <div className="flex flex-col w-full h-full">
        <Banner />
        <main className="h-full p-6">{children}</main>
      </div>
    </>
  );
}
