import { Metadata } from "next";
import AIGeneratePageSuspense from "./page-component";

export const metadata: Metadata = {
  title: "AI Pixel Art Generator | Create Pixel Art from Text | Pixel Nova",
  description:
    "Transform your ideas into stunning pixel art with our AI generator. Create game assets, character sprites, and pixel art from text descriptions. Perfect for game developers, artists, prototyping, and designers.",
  keywords: [
    // Core Features
    "AI pixel art generator",
    "text to pixel art",
    "AI art generator",
    "pixel art from text",
    "AI sprite generator",

    // Use Cases
    "game asset creation",
    "pixel character generator",
    "pixel sprite maker",
    "retro game art generator",
    "8-bit art creator",

    // Technical Features
    "high resolution pixel art",
    "custom art generation",
    "AI art tools",
    "pixel art automation",
    "game development tools",
  ].join(", "),
  openGraph: {
    title: "AI Pixel Art Generator | Create Pixel Art from Text",
    description:
      "Transform text descriptions into beautiful pixel art instantly with our AI generator. Create game assets, characters, and more.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova AI Generator - Create Pixel Art from Text",
      },
    ],
    siteName: "Pixel Nova",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Pixel Art from Text with AI",
    description:
      "Transform your ideas into pixel art instantly. Perfect for game assets, characters, and more.",
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
  alternates: {
    canonical: "https://pixelnova.app/ai",
  },
};

export default function AIGeneratePage() {
  return <AIGeneratePageSuspense />;
}
