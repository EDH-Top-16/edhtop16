import { useHead } from "@unhead/react";
import { PropsWithChildren } from "react";

export function App({ children }: PropsWithChildren<{}>) {
  useHead({
    link: [
      {
        rel: "stylesheet",
        href: "/src/globals.css",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
      },
    ],
  });

  return <main className="relative min-h-screen bg-[#514f86]">{children}</main>;
}
