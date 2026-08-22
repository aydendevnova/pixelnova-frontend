import { Metadata } from "next";
import HeroLandingSection from "@/components/landing/hero";
import PixelPerfectLandingSection from "@/components/landing/pixel-perfect";
import ColorizerLandingSection from "@/components/landing/colorizer";
import SkinToneLandingSection from "@/components/landing/skin-tones";
import EditorLandingSection from "@/components/landing/editor";
import ClosingCtaSection from "@/components/landing/cta";

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
        url: "https://pixelnovastudio.app/og-image.jpg",
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
    images: ["https://pixelnovastudio.app/og-image.jpg"],
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
    canonical: "https://pixelnovastudio.app",
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-nova-bg">
      <div className="nova-wash" />

      <div className="relative duration-500 animate-in fade-in">
        <HeroLandingSection />
        <PixelPerfectLandingSection />
        <ColorizerLandingSection />
        <SkinToneLandingSection />
        <EditorLandingSection />
        <ClosingCtaSection />
      </div>
    </div>
  );
}
