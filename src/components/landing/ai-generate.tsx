import {
  ArrowRight,
  Wand2,
  Sparkles,
  Package,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function AiGenerateLandingSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900"></div>

      <div className="relative mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-0 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-sm font-medium text-white">
            ✨ AI-Powered Pixel Art Creation
          </Badge>
          <h2 className="mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
            AI Meets Pixel Art
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-slate-300">
            Transform text into beautiful Pixel Art in seconds. Use it for
            games, prototyping, and digital art — no artistic skills required.
          </p>
          <Link href="/ai">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              Start Creating
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Example Showcase */}
        <div className="mb-20">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-slate-800/50 p-8 backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="h-[14vh] rounded-lg border border-slate-700 bg-slate-800/80 p-4">
                  <h4 className="mb-2 font-medium text-purple-400">
                    Prompt Example
                  </h4>
                  <p className="text-white">
                    Plague doctor character with a raven mask, stitched robes,
                    potion satchels, and animated eye glow.
                  </p>
                </div>
                <Image
                  src="/images/landing/raven.png"
                  alt="pixel art raven"
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-lg border border-slate-700 object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div className="space-y-4">
                <div className="h-[14vh] rounded-lg border border-slate-700 bg-slate-800/80 p-4">
                  <h4 className="mb-2 font-medium text-purple-400">
                    Prompt Example
                  </h4>
                  <p className="text-white">
                    Legendary sword embedded in a glowing stone pedestal, with
                    magical runes pulsing along the blade.
                  </p>
                </div>
                <Image
                  src="/images/landing/sword.png"
                  alt="pixel art sword"
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-lg border border-slate-700 object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
            <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
              <Wand2 className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Instant Generation
            </h3>
            <p className="text-slate-400">
              Type your idea and watch as AI transforms it into pixel art in
              seconds
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
            <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Resolution Control
            </h3>
            <p className="text-slate-400">
              Choose from different pixel art resolutions to match your project
              needs
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
            <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Easy Export
            </h3>
            <p className="text-slate-400">
              Download your creations in multiple formats ready for any project
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-12 flex justify-center">
        <Link href="/ai">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Generate Your First Image
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
