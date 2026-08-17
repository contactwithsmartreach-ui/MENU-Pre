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

export const metadata: Metadata = {
  title: "L'Aura Sahara | Luxury Glassmorphism 3D Gastronomy",
  description: "Experience luxury dining with our interactive 3D rotating cylinder menu and white glassmorphism aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-neutral-900 min-h-screen selection:bg-amber-500/20 selection:text-amber-900`}
      >
        {children}
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}