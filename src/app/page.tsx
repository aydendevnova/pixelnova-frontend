import { Metadata } from "next";
import HeroLandingSection from "@/components/landing/hero";
import PixelPerfectLandingSection from "@/components/landing/pixel-perfect";
import ColorizerLandingSection from "@/components/landing/colorizer";
import SkinToneLandingSection from "@/components/landing/skin-tones";
import EditorLandingSection from "@/components/landing/editor";

export const metadata: Metadata = {
  title: "Pixel Nova Studio",
  description:
    "A free suite of pixel art tools: convert images to pixel art, colorize sprites, generate skin tone palettes, and draw in the pixel editor.",
  openGraph: {
    title: "Pixel Nova Studio",
    description:
      "A free suite of pixel art tools for artists, game developers, and designers.",
    type: "website",
    images: [
      {
        url: "https://pixelnova.app/og-image.jpg",
        width: 1024,
        height: 1024,
        alt: "Pixel Nova Studio",
      },
    ],
    siteName: "Pixel Nova Studio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Nova Studio",
    description:
      "A free suite of pixel art tools for artists, game developers, and designers.",
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
        <HeroLandingSection />

        <PixelPerfectLandingSection />
        <ColorizerLandingSection />
        <SkinToneLandingSection />
        <EditorLandingSection />
      </div>
    </div>
  );
}
