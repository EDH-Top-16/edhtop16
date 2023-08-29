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
      <div className="flex h-full w-full flex-col">
        <Banner title={"Commander Decks"} />
        <main className="h-full p-6">{children}</main>
      </div>
    </>
  );
}
