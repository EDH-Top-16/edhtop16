"use client";

import { SearchbarProvider } from "./searchbar";
import { FilterProvider } from "./filter";

const providers = [SearchbarProvider, FilterProvider];

/**
 * This component is used to wrap the entire application with all the context providers.
 */
export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return providers.reduce((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
}
