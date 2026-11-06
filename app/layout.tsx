import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MarketplaceProvider } from "@/lib/context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AFTERLIFE — Find value in what the world overlooks.",
  description:
    "An AI-powered circular marketplace connecting buyers, sellers, artisans, students and small businesses through pre-owned goods, handmade items, refurbished products, upcycled creations and surplus materials.",
  keywords: ["circular economy", "pre-owned", "handmade", "upcycled", "refurbished", "sustainable", "india"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-background font-sans text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        <MarketplaceProvider>
          <Navbar />
          <main className="w-full pt-20 bg-background min-h-screen">{children}</main>
          <Footer />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
