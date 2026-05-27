import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZAYA AI — Монголын хамгийн дэвшилтэт астрологи платформ",
    template: "%s | ZAYA AI",
  },
  description:
    "AI-powered астрологи тайлан, хайрын compatibility, soulmate шинжилгээ. Монгол хэлээр. Premium астрологи туршлага.",
  keywords: ["астрологи", "зурхай", "zodiac", "horoscope", "монгол", "хайр", "compatibility", "soulmate", "2026"],
  authors: [{ name: "ZAYA AI" }],
  creator: "ZAYA AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zaya.mn"),
  openGraph: {
    type: "website",
    locale: "mn_MN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ZAYA AI",
    title: "ZAYA AI — Таны хувь заяаг нээ",
    description: "AI астрологи тайлан, хайрын compatibility шинжилгээ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZAYA AI Astrology Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAYA AI — Таны хувь заяаг нээ",
    description: "AI астрологи тайлан, хайрын compatibility шинжилгээ",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${inter.variable} ${playfair.variable}`}>
      <body className="cosmic-bg min-h-screen">
        <Providers>
          <StarsBackground />
          <main className="relative z-10">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
