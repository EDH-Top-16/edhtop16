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
      <div className="flex h-full w-full flex-col">
        <Banner title={"Commanders View"} />
        <main className="h-full p-6">{children}</main>
      </div>
    </>
  );
}
