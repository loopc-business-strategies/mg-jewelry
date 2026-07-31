import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-loaded",
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body-loaded",
});

export const metadata: Metadata = {
  title: {
    default: "MG Jewelry | Hearts of Namangan",
    template: "%s | MG Jewelry",
  },
  description:
    "Hearts of Namangan — luxury gold and diamond jewelry crafted in Namangan, Uzbekistan, available worldwide.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body
        className="antialiased"
        style={
          {
            "--font-display": "var(--font-display-loaded), serif",
            "--font-body": "var(--font-body-loaded), sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
