import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
