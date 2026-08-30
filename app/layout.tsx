import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

// Defines the --font-noto CSS variable that tailwind.config.ts maps to `font-sans`.
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
