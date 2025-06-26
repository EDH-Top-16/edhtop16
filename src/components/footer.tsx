/* eslint-disable @next/next/no-html-link-for-pages */
// import Link from "next/link";

import { Link } from "../lib/river/router";

export function Footer() {
  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-md) justify-center gap-6 p-6 pb-8">
      <Link
        href="/about"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        About
      </Link>

      <a
        href="https://github.com/EDH-Top-16/edhtop16"
        target="_blank"
        rel="noopener"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        GitHub
      </a>

      <a
        href="https://topdeck.gg"
        target="_blank"
        rel="noopener"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        TopDeck.gg
      </a>
    </div>
  );
}
