import { Metadata } from "next";
import EditorPage from "./editor/page";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Pixel Nova | AI Pixel Art Editor & Generator",
  description:
    "Create stunning pixel art with our AI-powered online editor. Features intelligent drawing tools, real-time collaboration, custom palettes, and advanced editing capabilities. Perfect for game developers, digital artists and pixel art enthusiasts.",
  keywords: [
    "ai pixel art",
    "ai pixel art editor",
    "ai pixel art generator",
    "pixel art editor",
    "pixel art creator",
    "pixel art generator",
    "online pixel art",
    "pixel art tools",
    "game development",
    "digital art",
    "pixel art animation",
    "retro art",
    "8-bit art",
    "pixel art software",
    "pixel art maker",
  ],
  icons: [
    { rel: "icon", url: "/logo.png" },
    { rel: "icon", url: "/favicon.ico" },
  ],
  openGraph: {
    title: "Pixel Nova | AI Pixel Art Editor & Generator",
    description:
      "Create stunning pixel art with our AI-powered online editor. Perfect for game developers and digital artists.",
    type: "website",
    url: "https://editor.pixelnova.app",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Logo",
      },
    ],
  },
};

export default async function Home() {
  return <EditorPage />;
}
