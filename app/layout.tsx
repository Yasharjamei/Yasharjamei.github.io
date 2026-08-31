import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { site } from "@/lib/content";
import { themeInitScript } from "@/components/site/theme-toggle";
import { CustomCursor } from "@/components/site/custom-cursor";
import { AmbientGeometry } from "@/components/site/ambient-geometry";
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
  return (
    <html lang="en" data-theme="dark" className={notoSans.variable} suppressHydrationWarning>
      <head>
        {/* Applies the stored theme before first paint, so there is no flash
            of the wrong palette. Must stay inline and synchronous. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <AmbientGeometry />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
