import LayoutClient from "@/components/layout/layout-client";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import {
  IBM_Plex_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import { type Metadata } from "next";
import Script from "next/script";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
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
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://pixelnova.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <body className="bg-nova-bg text-nova-fg antialiased">
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="a4fb1317-1159-4702-8b14-7b24dbbfab06"
          strategy="afterInteractive"
        />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
