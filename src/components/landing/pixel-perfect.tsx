import { ArrowRight, Upload, Palette, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function PixelPerfectLandingSection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4 border-0 bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-1 text-white">
            🎯 Pixel Perfect Conversion
          </Badge>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Convert Any Image to True Pixel Art
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Transform AI-generated images, photos, or artwork into authentic
            pixel art that stays crisp and clean at any resolution.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href="/convert" className="mx-auto mb-8 w-fit">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
            >
              Try Now
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="relative mb-12 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
          <div className="grid gap-8">
            {/* Text Content */}
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="text-center">
                <h3 className="mb-3 text-2xl font-semibold text-white">
                  The Problem with AI "Pixel Art" from <i>Other Tools</i>
                </h3>
                <p className="text-slate-300">
                  AI tools like ChatGPT, Midjourney, and DALL-E create "pixel
                  art style" images that look blurry when zoomed in. They're not
                  true pixel art. Our generator is the only true pixel art
                  generator. However, you can convert images from other tools
                  into true pixel art.
                </p>
              </div>

              <div className="text-center">
                <h3 className="mb-3 text-2xl font-semibold text-emerald-400">
                  Our Pixel-Perfect Solution
                </h3>
                <p className="text-slate-300">
                  Convert any image into crisp, clean pixel art where every
                  single pixel is perfectly placed. Get that authentic retro
                  game look that stays sharp at any size.
                </p>
              </div>
            </div>

            {/* Image Comparison */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="relative aspect-square w-[350px]">
                  <Image
                    src="/images/tutorials/sample_ai.png"
                    alt="AI Generated (Blurry)"
                    fill
                    className="rounded-lg border border-slate-600 object-cover"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-400">AI Generated</p>
                <p className="text-xs text-red-400">Blurry when zoomed</p>
              </div>
              <div className="text-2xl font-bold text-emerald-400">→</div>
              <div className="text-center">
                <div className="relative aspect-square w-[350px]">
                  <Image
                    src="/images/tutorials/sample_pixel.png"
                    alt="Pixel Perfect"
                    fill
                    className="rounded-lg border border-slate-600 object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-400">Pixel Perfect</p>
                <p className="text-xs text-emerald-400">Sharp at any size</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-800/50">
            <div className="mb-4 inline-block rounded-full bg-emerald-500/20 p-3">
              <Upload className="h-5 w-5 text-emerald-500" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">Upload</h4>
            <p className="text-slate-400">
              Start with any image - photos, artwork, or AI-generated content
            </p>
          </div>

          <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-800/50">
            <div className="mb-4 inline-block rounded-full bg-emerald-500/20 p-3">
              <Palette className="h-5 w-5 text-emerald-500" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">Customize</h4>
            <p className="text-slate-400">
              Adjust resolution, color palettes, and pixelation settings to find
              the perfect number of pixels
            </p>
          </div>

          <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-800/50">
            <div className="mb-4 inline-block rounded-full bg-emerald-500/20 p-3">
              <ArrowRight className="h-5 w-5 text-emerald-500" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">Export</h4>
            <p className="text-slate-400">
              Download your pixel art in multiple formats
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Link href="/convert" className="mx-auto mb-8 w-fit">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
          >
            Try Converting to Pixel Art Now
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
