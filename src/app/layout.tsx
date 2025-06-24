import LayoutClient from "@/components/layout/layout-client";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel Nova | AI Pixel Art Generator and Tools",
  description:
    "Create stunning pixel art instantly with AI. Transform text and images into beautiful pixel art using advanced AI generation, smart colorization, and editing tools. Perfect for game developers, artists, and designers.",
  keywords: [
    // Primary Keywords
    "AI pixel art generator",
    "AI pixel art creator",
    "text to pixel art",
    "image to pixel art converter",
    "pixel art AI tools",

    // Feature-specific Keywords
    "AI art generation",
    "pixel art colorizer",
    "smart color palette",
    "skin tone generator",
    "pixel perfect conversion",

    // Use-case Keywords
    "game asset creation",
    "pixel sprite generator",
    "retro game art maker",
    "pixel character creator",
    "8-bit art generator",

    // Technical Keywords
    "automated pixel art",
    "AI image processing",
    "pixel art automation",
    "professional pixel editor",
    "pixel art software",

    // Intent-based Keywords
    "create pixel art online",
    "generate pixel art with AI",
    "convert images to pixel art",
    "make pixel art from text",
    "pixel art for games",
  ].join(", "),
  openGraph: {
    title: "Pixel Nova | AI-Powered Pixel Art Generator & Professional Editor",
    description:
      "Transform text and images into stunning pixel art instantly with AI. Professional-grade tools for game developers, artists, and designers. Generate, colorize, and perfect your pixel art.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova - AI Pixel Art Generation Suite",
      },
    ],
    siteName: "Pixel Nova",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Nova | Create Pixel Art with AI",
    description:
      "Generate stunning pixel art from text or images using AI. Professional tools for game developers and artists. Try our AI pixel art generator now!",
    images: ["/og-image.jpg"],
    creator: "@thepixelnova",
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
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://pixelnova.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
