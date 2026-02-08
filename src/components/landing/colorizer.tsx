import Image from "next/image";
import { Palette, Wand2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ColorizerLandingSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900"></div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Badge className="mb-4 border-0 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-white">
            🎨 Smart Color Enhancement
          </Badge>
          <h2 className="mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Smart Colorizer
          </h2>
          <p className="max-w-[600px] text-xl leading-relaxed text-slate-300">
            Transform pixel art into vibrant masterpieces with fun color
            suggestions. Excellent for prototyping and games.
          </p>
          <div className="pt-8">
            <Link href="/colorizer">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                Try Colorizer
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur">
            <Image
              alt="AI colorizer preview"
              className="object-contain"
              height={800}
              width={1000}
              src={"/images/landing/color_spritesheet.png"}
              priority
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Smart Color Enhancement
              </h3>
              <p className="text-slate-300">
                Our algorithms understand pixel art aesthetics and suggest
                harmonious color palettes that bring your artwork to life. Turn
                simple sketches into stunning, colorful pieces with just one
                click.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
                <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
                  <Palette className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-white">
                  Intelligent Palette Suggestions
                </h4>
                <p className="text-slate-400">
                  Get curated color combinations that perfectly match your art
                  style
                </p>
              </div>
              <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
                <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
                  <Wand2 className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-white">
                  One-Click Magic
                </h4>
                <p className="text-slate-400">
                  Instantly transform grayscale art into vibrant masterpieces
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-16 flex justify-center">
        <Link href="/colorizer">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Try Colorizer Now
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
