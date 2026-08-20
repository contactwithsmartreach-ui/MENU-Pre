import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PRODUCTION_URL = "https://laurasahara.dining";

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_URL),
  title: "L'Aura | Interactive 3D Cylinder Restaurant Menu",
  description: "Experience luxury dining with our interactive 3D rotating cylinder menu.",
  openGraph: {
    title: "L'Aura Sahara | Interactive 3D Restaurant Menu",
    description: "Explore our immersive 3D cylinder menu, chef specials, cocktails, and table orders.",
    url: PRODUCTION_URL,
    siteName: "L'Aura Sahara",
    images: [
      {
        url: `${PRODUCTION_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "L'Aura Sahara 3D Restaurant Menu Preview",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "L'Aura Sahara | Interactive 3D Restaurant Menu",
    description: "Experience luxury dining with our interactive 3D rotating cylinder menu.",
    images: [`${PRODUCTION_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white min-h-screen`}
      >
        {children}
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}