import { Metadata } from "next";
import HeroLandingSection from "@/components/landing/hero";
import PixelPerfectLandingSection from "@/components/landing/pixel-perfect";
import AiGenerateLandingSection from "@/components/landing/ai-generate";
import PricingSection from "@/components/pricing/pricing-section";
import ColorizerLandingSection from "@/components/landing/colorizer";
import SkinToneLandingSection from "@/components/landing/skin-tones";
import EditorLandingSection from "@/components/landing/editor";

export const metadata: Metadata = {
  title: "Pixel Nova | AI Pixel Art Generator and Tools",
  description:
    "Create pixel art instantly with our AI pixel art generator. Transform text prompts and images into professional pixel art, sprites, and game assets. The new AI-powered pixel art suite for artists, game developers and designers. Try our free tools today!",
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
    title: "Pixel Nova | AI Pixel Art Generator & Editor",
    description:
      "Create pixel art instantly with our AI pixel art generator. Transform text prompts and images into professional pixel art, sprites, and game assets. The new AI-powered pixel art suite for artists, game developers and designers. Try our free tools today!",
    type: "website",
    images: [
      {
        url: "https://pixelnova.app/og-image.jpg",
        width: 1024,
        height: 1024,
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
    images: ["https://pixelnova.app/og-image.jpg"],
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

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="duration-500 animate-in fade-in">
        {/* Hero Section */}
        <HeroLandingSection />

        <AiGenerateLandingSection />
        <PixelPerfectLandingSection />

        <ColorizerLandingSection />
        <SkinToneLandingSection />

        <EditorLandingSection />

        {/* Pricing Section */}
        <PricingSection />
      </div>
    </div>
  );
}
