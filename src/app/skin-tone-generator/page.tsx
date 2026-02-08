import { Metadata } from "next";
import SkinToneGeneratorComponent from "./page-component";

export const metadata: Metadata = {
  title: "Pixel Art Skin Tone Generator | Create Diverse Character Sprites",
  description:
    "Generate inclusive and diverse skin tone variations for your pixel art characters. Create authentic representations with our specialized tool. Perfect for game developers and character artists.",
  keywords: [
    // Core Features
    "skin tone generator",
    "pixel art character creator",
    "sprite color variations",
    "character palette generator",
    "pixel art diversity tool",

    // Use Cases
    "game character creation",
    "inclusive character design",
    "diverse pixel sprites",
    "character customization",
    "pixel art representation",

    // Technical Features
    "skin color palette",
    "character color variations",
    "sprite recoloring",
    "pixel art automation",
    "character design tools",
  ].join(", "),
  openGraph: {
    title: "Pixel Art Skin Tone Generator | Create Diverse Characters",
    description:
      "Create authentic and diverse character variations with our specialized skin tone generator. Perfect for game developers and pixel artists.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Skin Tone Generator - Create Diverse Characters",
      },
    ],
    siteName: "Pixel Nova",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Diverse Pixel Art Characters",
    description:
      "Generate authentic skin tone variations for your pixel art characters. Perfect for inclusive game development.",
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
    canonical: "https://pixelnova.app/skin-tone-generator",
  },
};

export default function SkinToneGeneratorPage() {
  return <SkinToneGeneratorComponent />;
}
