import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="duration-500 animate-in fade-in">
        {/* Hero Section - AI Generator */}
        <section className="px-4 pb-8 pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h1 className="mb-4 flex items-center justify-center gap-4 text-5xl font-bold">
                <Image
                  src="/logo-og.png"
                  alt="Pixel Nova Logo"
                  width={74}
                  height={74}
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Pixel Nova
                </span>
              </h1>
              <p className="text-xl text-slate-400">
                AI-Powered Pixel Art Creation Suite
              </p>
            </div>

            {/* Main Features Grid */}

            <div className="grid gap-8 md:grid-cols-2">
              {/* AI Generator Card */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
                <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur transition-all duration-300 hover:border-purple-500/50">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="mb-2 text-3xl font-bold text-white">
                        Create Pixel Art with AI
                      </h2>
                      <Badge className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        ✨ Text to Pixel Art
                      </Badge>
                    </div>
                    <div className="text-5xl opacity-20">🎨</div>
                  </div>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    Transform your ideas into pixel art instantly. Just describe
                    what you want, and our AI will create beautiful pixel art
                    for your games, social media, or projects.
                  </p>
                  <div className="flex flex-row gap-4">
                    <Link href="/ai">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 font-semibold text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                      >
                        Start Creating
                      </Button>
                    </Link>

                    <Link href="/gallery">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                      >
                        View Gallery
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* AI Downscaler Card */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
                <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur transition-all duration-300 hover:border-emerald-500/50">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="mb-2 text-3xl font-bold text-white">
                        Fix AI-Generated Pixel Art
                      </h2>
                      <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                        ✨ Magic Fix
                      </Badge>
                    </div>
                    <div className="text-5xl opacity-20">✨</div>
                  </div>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    Got pixel art style images from ChatGPT, Midjourney, or
                    other AI tools? Our magic fixer transforms them into clean,
                    crisp pixel art that looks perfect up close.
                  </p>
                  <Link href="/convert">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 font-semibold text-white hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700"
                    >
                      Fix My Pixel Art
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="px-4 pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Colorize Sprites */}
              <div className="group relative flex h-full">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
                <div className="relative flex h-full w-full flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all duration-300 hover:border-blue-500/50">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      Colorize Sprites
                    </h3>
                    <div className="text-3xl opacity-20">🎨</div>
                  </div>
                  <p className="mb-6 text-slate-400">
                    Transform any sprite into vibrant pixel art with our
                    colorization tools. Perfect for rapid prototyping and art
                    style exploration.
                  </p>
                  <Link href="/colorizer" className="mt-auto">
                    <Button
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                    >
                      Colorize Art
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Skin Tone Generator */}
              <div className="group relative flex h-full">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
                <div className="relative flex h-full w-full flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all duration-300 hover:border-amber-500/50">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      Skin Tone Generator
                    </h3>
                    <div className="text-3xl opacity-20">👤</div>
                  </div>
                  <p className="mb-6 text-slate-400">
                    Generate inclusive and diverse skin tone palettes for your
                    character sprites. Create authentic representations with our
                    specialized tool.
                  </p>
                  <Link href="/skin-tone-generator" className="mt-auto">
                    <Button
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                    >
                      Generate Palettes
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Pixel Editor */}
              <div className="group relative flex h-full">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
                <div className="relative flex h-full w-full flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all duration-300 hover:border-purple-500/50">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Pixel Editor
                      </h3>
                      <Badge className="mt-1 bg-purple-500/20 text-xs text-purple-400">
                        Alpha
                      </Badge>
                    </div>
                    <div className="text-3xl opacity-20">⚡</div>
                  </div>
                  <p className="mb-6 text-slate-400">
                    Our custom pixel art editor made for new users. Perfect for
                    fine-tuning AI pixel art.
                  </p>
                  <Link href="/editor" className="mt-auto">
                    <Button
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    >
                      Try Editor
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
