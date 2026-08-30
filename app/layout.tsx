import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

// Defines the --font-noto CSS variable that tailwind.config.ts maps to `font-sans`.
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Entropy",
  description: "Order and chaos dance — digital poetry in motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // data-theme is required: globals.css only defines --background/--foreground/
  // --text-primary/--text-secondary under :root[data-theme="dark"|"light"].
  return (
    <html lang="en" data-theme="dark" className={notoSans.variable}>
      <body>{children}</body>
    </html>
  );
}
