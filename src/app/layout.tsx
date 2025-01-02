import LayoutClient from "@/components/layout/layout-client";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel Nova | Pixel Art Editor",
  description:
    "Create stunning pixel art with our powerful online editor. Features AI-assisted drawing tools, real-time collaboration, custom color palettes, and advanced editing capabilities. Perfect for game developers, digital artists and pixel art enthusiasts. ",
  keywords: [
    "ai pixel art",
    "ai pixel art editor",
    "ai pixel art generator",
    "ai pixel art creator",
    "pixel art",
    "pixel art editor",
    "pixel art generator",
    "pixel art creator",
    "pixel art editor online",
    "pixel art editor free",
    "pixel art editor for beginners",
    "pixel art editor for kids",
    "pixel art editor for professionals",
    "pixel art editor for game developers",
    "pixel art editor for digital artists",
    "pixel art editor for artists",
    "pixel art editor for designers",
    "pixel art editor for illustrators",
    "pixel art editor for animators",
  ],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get the current pathname
  const pathname = process.env.NEXT_PUBLIC_VERCEL_URL ? "/" : "";

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
