"use client";
import { Banner } from "../../components/banner/banner";
import { Navigation } from "../../components/nav";

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
        <main className="w-full bg-secondary px-8 py-4 text-white">
          {children}
        </main>
      </div>
    </>
  );
}
