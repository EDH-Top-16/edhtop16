"use client";
import { useEffect, useContext } from "react";

import Navigation from "@/components/nav";
import Banner from "@/components/banner/banner";

import { CommandersViewDefaultFilters } from "@/constants/defaultFilters";
import { FilterContext } from "@/context/filter";

export default function CommandersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setEnabled } = useContext(FilterContext);

  useEffect(() => {
    // Set the default filters for the commanders view
    setEnabled(CommandersViewDefaultFilters);
    // Fetch the commanders
  }, []);

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
