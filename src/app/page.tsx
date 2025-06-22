import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import HeroLandingSection from "@/components/landing/hero";
import PixelPerfectLandingSection from "@/components/landing/pixel-perfect";
import AiGenerateLandingSection from "@/components/landing/ai-generate";
import PricingSection from "@/components/pricing/pricing-section";
import ColorizerLandingSection from "@/components/landing/colorizer";
import SkinToneLandingSection from "@/components/landing/skin-tones";
import EditorLandingSection from "@/components/landing/editor";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pixel Nova | AI-Powered Pixel Art Creation Suite",
  description:
    "Transform your ideas into stunning pixel art instantly. Create, fix, and perfect pixel art with our AI-powered tools. Features text-to-pixel-art generation, AI image conversion, colorization, and more.",
  keywords: [
    "ai pixel art",
    "pixel art generator",
    "text to pixel art",
    "ai pixel art creator",
    "pixel art editor",
    "convert to pixel art",
    "pixel art colorizer",
    "skin tone generator",
    "game development",
    "digital art",
    "retro art",
    "8-bit art",
  ],
  openGraph: {
    title: "Pixel Nova | AI-Powered Pixel Art Creation Suite",
    description:
      "Transform your ideas into stunning pixel art instantly with our AI-powered tools.",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Logo",
      },
    ],
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
