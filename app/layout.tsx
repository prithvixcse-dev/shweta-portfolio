import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/src/components/CustomCursor";
import BackToTop from "@/src/components/BackToTop";
import ScrollProgress from "@/src/components/ScrollProgress";
import Preloader from "@/src/components/Preloader";
import ThemeToggle from "@/src/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "Shweta Sharma — Graphic Designer, Video Editor & VFX Artist",
  description:
    "Helping brands look professional through design & video. Logo design, graphic design, video editing, and VFX — powered by Adobe Creative Suite. Based in Thane, Maharashtra.",
  openGraph: {
    title: "Shweta Sharma — Graphic Designer, Video Editor & VFX Artist",
    description:
      "Helping brands look professional through design & video. Logo design, graphic design, video editing, and VFX.",
    url: "https://anshikasharma.in",
    siteName: "Shweta Sharma Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/anshika.jpeg",
        width: 1200,
        height: 630,
        alt: "Shweta Sharma — Graphic Designer & VFX Artist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shweta Sharma — Graphic Designer & VFX Artist",
    description:
      "Helping brands look professional through design & video.",
    images: ["/anshika.jpeg"],
  },
  metadataBase: new URL("https://anshikasharma.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen">
        <Preloader />
        <ScrollProgress />
        <div className="grain-overlay" />
        <CustomCursor />
        {children}
        <BackToTop />
        <ThemeToggle />
      </body>
    </html>
  );
}
