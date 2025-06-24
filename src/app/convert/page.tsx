import { Metadata } from "next";
import ConvertImagePageClient from "./page-component";

export const metadata: Metadata = {
  title: "AI Pixel Art Converter | Fix AI-Generated Pixel Art | Pixel Nova",
  description:
    "Convert and fix AI-generated pixel art from Midjourney, DALL-E, or ChatGPT. Our smart converter ensures clean, crisp pixel art with perfect pixel alignment and authentic retro style.",
  keywords: [
    // Core Features
    "AI pixel art converter",
    "pixel art fixer",
    "image to pixel art",
    "pixel art cleanup",
    "AI art converter",

    // AI Platform Integration
    "fix Midjourney pixel art",
    "fix DALL-E pixel art",
    "ChatGPT image converter",
    "AI image cleanup",
    "stable diffusion fixer",

    // Technical Features
    "pixel perfect conversion",
    "smart downscaling",
    "pixel art optimization",
    "retro style converter",
    "pixel art enhancement",
  ].join(", "),
  openGraph: {
    title: "AI Pixel Art Converter | Fix AI-Generated Art",
    description:
      "Convert and perfect AI-generated pixel art. Transform images from Midjourney, DALL-E, or ChatGPT into clean, authentic pixel art.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Converter - Fix AI-Generated Pixel Art",
      },
    ],
    siteName: "Pixel Nova",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix AI-Generated Pixel Art | Smart Converter",
    description:
      "Transform AI-generated images into clean, authentic pixel art. Perfect for Midjourney, DALL-E, and ChatGPT outputs.",
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
    canonical: "https://pixelnova.app/convert",
  },
};

export default function DownscalePage() {
  return <ConvertImagePageClient />;
}
