import Link from "next/link";

export function Footer() {
  return (
    <div className="mx-auto flex w-full max-w-screen-md justify-center gap-6 p-6 pb-8">
      <Link
        href="/about"
        className="text-sm text-white/60 underline decoration-transparent transition-colors transition-colors hover:text-white hover:decoration-inherit"
      >
        About
      </Link>

      <Link
        href="https://github.com/EDH-Top-16/edhtop16"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/60 underline decoration-transparent transition-colors transition-colors hover:text-white hover:decoration-inherit"
      >
        GitHub
      </Link>

      <Link
        href="https://topdeck.gg"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/60 underline decoration-transparent transition-colors transition-colors hover:text-white hover:decoration-inherit"
      >
        TopDeck.gg
      </Link>
    </div>
  );
}
