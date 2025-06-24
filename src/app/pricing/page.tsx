import { Metadata } from "next";
import PricingSection from "@/components/pricing/pricing-section";

export const metadata: Metadata = {
  title: "Pricing Plans | Pixel Nova AI Pixel Art Tools",
  description:
    "Choose the perfect plan for your pixel art creation needs. From free tier for hobbyists to professional plans for game developers. Access AI generation, conversion tools, and advanced features.",
  keywords: [
    // Plan Types
    "pixel art software pricing",
    "AI art generator plans",
    "pixel art tool subscription",
    "game development tools pricing",
    "pixel art creator plans",

    // Features
    "unlimited pixel art generation",
    "AI art conversion",
    "professional pixel tools",
    "game asset creation",
    "pixel art automation",

    // User Types
    "indie game developer tools",
    "professional pixel artist",
    "game studio software",
    "digital artist tools",
    "pixel art hobbyist",
  ].join(", "),
  openGraph: {
    title: "Pixel Nova Pricing | AI Pixel Art Creation Plans",
    description:
      "Find the perfect plan for your pixel art needs. Professional tools for game developers, artists, and creators.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Pricing Plans",
      },
    ],
    siteName: "Pixel Nova",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Nova Pricing | AI Art Tools",
    description:
      "Choose your perfect pixel art creation plan. Professional tools for every creator.",
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
    canonical: "https://pixelnova.app/pricing",
  },
};

export default function BuyPage() {
  return <PricingSection />;
}
