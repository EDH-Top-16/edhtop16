"use client";
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
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner title={"Commander Decks"} />
        <main className="w-full px-8 py-4">{children}</main>
      </div>
    </>
  );
}
