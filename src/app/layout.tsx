import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://laurasahara.dining"),
  title: "L'Aura Sahara | Menu Gastronomique 3D Interactif",
  description: "Découvrez l'expérience gastronomique L'Aura Sahara : notre menu rotatif 3D exclusif, pizzas au feu de bois, smash burgers wagyu, tacos gourmets et commandes rapides.",
  applicationName: "L'Aura Sahara",
  keywords: [
    "L'Aura Sahara",
    "Restaurant 3D",
    "Menu interactif",
    "Pizzas",
    "Burgers",
    "Tacos",
    "Gastronomie",
    "Restaurant Sahara",
  ],
  authors: [{ name: "L'Aura Sahara" }],
  creator: "L'Aura Sahara",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://laurasahara.dining",
    siteName: "L'Aura Sahara",
    title: "L'Aura Sahara | Menu Gastronomique 3D Interactif",
    description: "Explorez notre menu cylindrique 3D immersif, nos spécialités signatures, et commandez directement par téléphone au 0659242630.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "L'Aura Sahara - Menu Gastronomique 3D Interactif",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "L'Aura Sahara | Menu Gastronomique 3D Interactif",
    description: "Explorez notre menu 3D inédit, nos plats signatures et commandez votre repas en quelques secondes.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#e3efed] text-neutral-900 min-h-screen`}
      >
        {children}
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}