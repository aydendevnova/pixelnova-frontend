import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import HeroSection from "@/components/landing/hero";
import PixelPerfect from "@/components/landing/pixel-perfect";

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
        <HeroSection />

        <PixelPerfect />

        {/* Main Features Section */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* AI Text to Pixel Art */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
                <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur transition-all duration-300 hover:border-purple-500/50">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-3xl font-bold text-white">
                        Create Pixel Art with AI
                      </h3>
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

                  <div className="mb-6">
                    <Image
                      src="/images/tutorials/sample_ai_gen_apple.png"
                      alt="AI Generated Pixel Art Example"
                      width={200}
                      height={200}
                      className="rounded-lg border border-slate-600"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="/ai-pixel-art" className="flex-1">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 font-semibold text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                      >
                        Start Creating
                      </Button>
                    </Link>
                    <Link href="/gallery" className="flex-1">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                      >
                        View Gallery
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Convert to Pixel Art */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
                <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur transition-all duration-300 hover:border-emerald-500/50">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-3xl font-bold text-white">
                        Convert to Pixel-Perfect Art
                      </h3>
                      <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                        🎯 Pixel Perfect
                      </Badge>
                    </div>
                    <div className="text-5xl opacity-20">🎯</div>
                  </div>
                  <p className="mb-4 text-lg leading-relaxed text-slate-300">
                    <strong className="text-white">Here's the problem:</strong>{" "}
                    AI tools like ChatGPT, Midjourney, and DALL-E create "pixel
                    art style" images that look blurry when zoomed in. They're
                    not true pixel art.
                  </p>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    <strong className="text-emerald-400">Our solution:</strong>{" "}
                    Convert any image into crisp, clean pixel art where every
                    single pixel is perfectly placed. Get that authentic retro
                    game look that stays sharp at any size.
                  </p>

                  <div className="mb-6 flex items-center gap-4">
                    <div className="text-center">
                      <Image
                        src="/images/tutorials/sample_ai.png"
                        alt="AI Generated (Blurry)"
                        width={120}
                        height={120}
                        className="mb-2 rounded-lg border border-slate-600"
                      />
                      <p className="text-sm text-slate-400">AI Generated</p>
                      <p className="text-xs text-red-400">Blurry when zoomed</p>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">→</div>
                    <div className="text-center">
                      <Image
                        src="/images/tutorials/sample_pixel.png"
                        alt="Pixel Perfect"
                        width={120}
                        height={120}
                        className="mb-2 rounded-lg border border-slate-600"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <p className="text-sm text-slate-400">Pixel Perfect</p>
                      <p className="text-xs text-emerald-400">
                        Sharp at any size
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <p className="text-sm font-semibold text-white">
                        Try it FREE right now:
                      </p>
                    </div>
                    <p className="text-sm text-slate-300">
                      Upload any image and see the magic happen in seconds. No
                      account required to start.
                    </p>
                  </div>

                  <Link href="/convert">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 font-semibold text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 hover:shadow-emerald-500/25"
                    >
                      Convert My Image Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {/* Skin Tone Generator */}
              <div className="group relative flex h-full">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
                <div className="relative flex h-full w-full flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all duration-300 hover:border-amber-500/50">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-xl font-bold text-white">
                      Skin Tone Generator
                    </h4>
                    <div className="text-3xl opacity-20">👤</div>
                  </div>
                  <p className="mb-6 text-slate-400">
                    Generate inclusive and diverse skin tone palettes for your
                    character sprites. Create authentic representations with our
                    specialized tool.
                  </p>

                  <div className="mb-6 flex gap-2">
                    <div className="h-6 w-6 rounded-full border border-slate-600 bg-amber-200"></div>
                    <div className="h-6 w-6 rounded-full border border-slate-600 bg-amber-600"></div>
                    <div className="h-6 w-6 rounded-full border border-slate-600 bg-amber-800"></div>
                    <div className="h-6 w-6 rounded-full border border-slate-600 bg-amber-900"></div>
                  </div>

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
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xl font-bold text-white">
                        Pixel Editor
                      </h4>
                      <div className="text-3xl opacity-20">⚡</div>
                    </div>
                    <Badge className="bg-purple-500/20 text-xs text-purple-400">
                      Featured
                    </Badge>
                  </div>
                  <p className="mb-6 text-slate-400">
                    Our custom pixel art editor made for new users. Perfect for
                    fine-tuning AI pixel art and creating from scratch.
                  </p>

                  <div className="mb-6">
                    <Image
                      src="/images/example-1.png"
                      alt="Pixel Editor Example"
                      width={80}
                      height={80}
                      className="rounded border border-slate-600"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

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

        {/* Workflow Section */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">
                From Imagination to Pixel Art in Minutes
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Start with an AI-generated concept, then transform it into
                stunning pixel art. Fine-tune colors, adjust details, and
                perfect your creation with our suite of specialized tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <span className="text-2xl text-white">💭</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Generate Ideas
                </h3>
                <p className="text-slate-400">
                  Create initial concepts with AI, then transform them into
                  pixel art masterpieces
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600">
                    <span className="text-2xl text-white">⚡</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Instant Pixelation
                </h3>
                <p className="text-slate-400">
                  Convert AI-generated images into pixel art with one click
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600">
                    <span className="text-2xl text-white">🎨</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Smart Enhancement
                </h3>
                <p className="text-slate-400">
                  Perfect colors and details with our AI-powered tools
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-600">
                    <span className="text-2xl text-white">📥</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Export
                </h3>
                <p className="text-slate-400">
                  Download your pixel art in multiple formats
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">Pricing</h2>
              <p className="text-xl text-slate-300">
                One Plan. Unlimited Access.
              </p>
              <p className="mt-2 text-slate-400">
                Transform unlimited images with our AI pixel art converter for
                one simple price.
              </p>
            </div>

            <div className="mx-auto max-w-md">
              <Card className="relative border-slate-700 bg-slate-800/50 backdrop-blur">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur"></div>
                <CardContent className="relative p-8 text-center">
                  <div className="mb-6">
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      Pro Plan
                    </h3>
                    <p className="mb-4 text-slate-400">Unlimited Access</p>
                    <p className="mb-6 text-slate-300">
                      Everything you need for AI pixel art creation
                    </p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">
                        $9.99
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  </div>

                  <div className="mb-8 space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-300">
                        Unlimited AI image generations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-300">
                        Unlimited image conversions
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-300">
                        Advanced customization options
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-300">
                        Priority processing
                      </span>
                    </div>
                  </div>

                  <Link href="/pricing">
                    <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-700">
                      Get Started
                    </Button>
                  </Link>

                  <p className="mt-4 text-xs text-slate-500">
                    *Pricing is subject to change.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="mb-4 text-slate-400">
                Need custom enterprise features?{" "}
                <Link
                  href="/support"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Contact us
                </Link>{" "}
                for custom enterprise solutions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Transform Your Creative Vision Today
            </h2>
            <p className="mb-8 text-xl text-slate-300">
              Join our community of artists revolutionizing their workflow with
              AI-powered pixel art tools. Save countless hours and create
              stunning artwork with professional-grade features.
            </p>

            <div className="mb-8">
              <Badge className="border-0 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-lg text-white">
                Limited Time: Get 50 free tokens when you sign up now!
              </Badge>
            </div>

            <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ai-pixel-art">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 py-3 text-lg font-semibold text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                >
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/tutorials">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 bg-slate-800/50 px-8 py-3 text-lg text-slate-300 hover:bg-slate-700"
                >
                  View Tutorials
                </Button>
              </Link>
            </div>

            <p className="text-slate-400">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
