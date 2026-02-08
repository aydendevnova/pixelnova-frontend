import { Metadata } from "next";
import ColorizerPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Smart Pixel Art Colorizer | AI Color Palette Generator | Pixel Nova",
  description:
    "Transform your pixel art with intelligent color palettes. Our AI-powered colorizer helps you explore different color schemes, create variations, and perfect your pixel art style instantly.",
  keywords: [
    // Core Features
    "pixel art colorizer",
    "pixel art color palette",
    "sprite colorizer",
    "pixel art recolor",
    "pixel art palette generator",

    // Use Cases
    "game sprite coloring",
    "pixel art variations",
    "retro game palette",
    "pixel art style transfer",
    "sprite color schemes",

    // Technical Features
    "smart color algorithm",
    "automatic coloring",
    "palette optimization",
    "color harmony",
    "pixel art tools",
  ].join(", "),
  openGraph: {
    title: "Smart Pixel Art Colorizer | Transform Your Pixel Art",
    description:
      "Instantly transform your pixel art with intelligent color palettes. Create variations, explore styles, and perfect your pixel art colors.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Smart Colorizer - Transform Your Pixel Art",
      },
    ],
    siteName: "Pixel Nova",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transform Your Pixel Art with Smart Colorizer",
    description:
      "Explore endless color possibilities for your pixel art. Create variations and perfect your style instantly.",
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
    canonical: "https://pixelnova.app/colorizer",
  },
};

export default function ColorizerPage() {
  return <ColorizerPageComponent />;
}
