import { Metadata } from "next";
import ConvertImagePageClient from "./page-component";

export const metadata: Metadata = {
  title: "Image to Pixel Art Converter | Pixel Nova Studio",
  description:
    "Convert any image into true pixel art. Our converter snaps every pixel to a clean grid and reduces the palette so the result stays sharp at any size. Free to use.",
  keywords: [
    "image to pixel art",
    "pixel art converter",
    "pixel art cleanup",
    "pixel perfect conversion",
    "smart downscaling",
    "pixel art optimization",
    "retro style converter",
    "sprite converter",
    "free pixel art tool",
  ].join(", "),
  openGraph: {
    title: "Image to Pixel Art Converter",
    description:
      "Convert any image into clean, authentic pixel art. Free to use.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Studio Converter",
      },
    ],
    siteName: "Pixel Nova Studio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Pixel Art Converter",
    description:
      "Convert any image into clean, authentic pixel art. Free to use.",
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
    canonical: "https://pixelnovastudio.app/convert",
  },
};

export default function DownscalePage() {
  return <ConvertImagePageClient />;
}
