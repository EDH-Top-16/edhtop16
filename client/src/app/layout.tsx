import "./globals.css";

/**
 * This file is the root layout for the entire application.
 */

// TODO: add proper metadata
export const metadata = {
  title: "CEDH Top 16",
  description: "Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex bg-secondary h-screen w-screen">{children}</body>
    </html>
  );
}
